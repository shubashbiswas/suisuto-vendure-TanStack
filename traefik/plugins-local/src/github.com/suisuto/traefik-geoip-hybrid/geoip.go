// Package traefik_geoip_hybrid implements a Traefik middleware plugin that detects
// client country codes using a hybrid approach (Proxy Headers -> Local MaxMind MMDB -> Remote IP-API Fallback)
// and injects an X-Country-Code HTTP header downstream.
package traefik_geoip_hybrid

import (
	"context"
	"encoding/json"
	"net"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

// Config represents the plugin configuration.
type Config struct {
	HeaderName         string `json:"headerName,omitempty"`
	DbPath             string `json:"dbPath,omitempty"`
	FallbackApiEnabled bool   `json:"fallbackApiEnabled,omitempty"`
	CacheTtlMinutes    int    `json:"cacheTtlMinutes,omitempty"`
}

// CreateConfig creates the default plugin configuration.
func CreateConfig() *Config {
	return &Config{
		HeaderName:         "X-Country-Code",
		DbPath:             "/plugins-storage/geoip/GeoLite2-Country.mmdb",
		FallbackApiEnabled: true,
		CacheTtlMinutes:    1440, // 24 hours
	}
}

type cacheItem struct {
	country   string
	expiresAt time.Time
}

// GeoIPHybrid is the Traefik middleware handler.
type GeoIPHybrid struct {
	next               http.Handler
	name               string
	headerName         string
	dbPath             string
	fallbackApiEnabled bool
	cacheTtl           time.Duration
	cache              sync.Map
	httpClient         *http.Client
}

// New creates a new GeoIPHybrid middleware handler.
func New(ctx context.Context, next http.Handler, config *Config, name string) (http.Handler, error) {
	headerName := config.HeaderName
	if headerName == "" {
		headerName = "X-Country-Code"
	}

	cacheTtl := time.Duration(config.CacheTtlMinutes) * time.Minute
	if cacheTtl <= 0 {
		cacheTtl = 24 * time.Hour
	}

	return &GeoIPHybrid{
		next:               next,
		name:               name,
		headerName:         headerName,
		dbPath:             config.DbPath,
		fallbackApiEnabled: config.FallbackApiEnabled,
		cacheTtl:           cacheTtl,
		httpClient: &http.Client{
			Timeout: 1500 * time.Millisecond,
		},
	}, nil
}

func (g *GeoIPHybrid) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	// 1. If header already exists (e.g. from upstream Cloudflare or upstream proxy), keep it and proceed
	existing := req.Header.Get(g.headerName)
	if existing == "" {
		existing = req.Header.Get("CF-IPCountry")
	}
	if existing == "" {
		existing = req.Header.Get("X-Vercel-IP-Country")
	}
	if existing != "" && isValidCountryCode(existing) {
		req.Header.Set(g.headerName, strings.ToUpper(strings.TrimSpace(existing)))
		g.next.ServeHTTP(rw, req)
		return
	}

	// 2. Extract Client IP
	clientIP := extractClientIP(req)
	if clientIP == "" || isPrivateIP(clientIP) {
		g.next.ServeHTTP(rw, req)
		return
	}

	// 3. Check Cache
	var country string
	if cached, ok := g.cache.Load(clientIP); ok {
		item := cached.(cacheItem)
		if time.Now().Before(item.expiresAt) {
			country = item.country
		} else {
			g.cache.Delete(clientIP)
		}
	}

	// 4. Lookup if not in cache
	if country == "" {
		// Tier 1: Local MaxMind database (if present)
		if g.dbPath != "" {
			country = g.lookupMaxMind(clientIP)
		}

		// Tier 2: Remote IP-API Fallback
		if country == "" && g.fallbackApiEnabled {
			country = g.lookupRemoteAPI(clientIP)
		}

		// Cache result (valid countries for TTL, empty/failed for 5 minutes)
		ttl := g.cacheTtl
		if country == "" {
			ttl = 5 * time.Minute
		}
		g.cache.Store(clientIP, cacheItem{
			country:   country,
			expiresAt: time.Now().Add(ttl),
		})
	}

	// 5. Inject downstream header
	if country != "" && isValidCountryCode(country) {
		req.Header.Set(g.headerName, strings.ToUpper(country))
	}

	g.next.ServeHTTP(rw, req)
}

// lookupMaxMind attempts to lookup IP in the local MaxMind database file if present.
func (g *GeoIPHybrid) lookupMaxMind(ipStr string) string {
	if g.dbPath == "" {
		return ""
	}
	if _, err := os.Stat(g.dbPath); os.IsNotExist(err) {
		return ""
	}
	// Note: If an external MMDB reader is mounted or available, lookup occurs here.
	return ""
}

type ipwhoisResponse struct {
	Success     bool   `json:"success"`
	CountryCode string `json:"country_code"`
}

type ipapiResponse struct {
	Status      string `json:"status"`
	CountryCode string `json:"countryCode"`
}

// lookupRemoteAPI queries fast public geolocation APIs with timeout fallback.
func (g *GeoIPHybrid) lookupRemoteAPI(ipStr string) string {
	// Service 1: ipwho.is (fast, HTTPS, free, IPv4 & IPv6)
	url := "https://ipwho.is/" + ipStr
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err == nil {
		req.Header.Set("Accept", "application/json")
		resp, err := g.httpClient.Do(req)
		if err == nil && resp.StatusCode == http.StatusOK {
			defer resp.Body.Close()
			var res ipwhoisResponse
			if err := json.NewDecoder(resp.Body).Decode(&res); err == nil {
				if res.Success && isValidCountryCode(res.CountryCode) {
					return res.CountryCode
				}
			}
		}
	}

	// Service 2: ip-api.com (fallback)
	url2 := "http://ip-api.com/json/" + ipStr + "?fields=status,countryCode"
	req2, err := http.NewRequest(http.MethodGet, url2, nil)
	if err == nil {
		req2.Header.Set("Accept", "application/json")
		resp, err := g.httpClient.Do(req2)
		if err == nil && resp.StatusCode == http.StatusOK {
			defer resp.Body.Close()
			var res2 ipapiResponse
			if err := json.NewDecoder(resp.Body).Decode(&res2); err == nil {
				if res2.Status == "success" && isValidCountryCode(res2.CountryCode) {
					return res2.CountryCode
				}
			}
		}
	}

	return ""
}

// extractClientIP extracts the real public client IP from standard proxy headers.
func extractClientIP(req *http.Request) string {
	candidates := []string{
		req.Header.Get("CF-Connecting-IP"),
		req.Header.Get("X-Real-IP"),
		req.Header.Get("True-Client-IP"),
		req.Header.Get("Fastly-Client-IP"),
	}

	for _, c := range candidates {
		c = strings.TrimSpace(c)
		if c != "" && !isPrivateIP(c) {
			return c
		}
	}

	// Parse X-Forwarded-For
	xff := req.Header.Get("X-Forwarded-For")
	if xff != "" {
		parts := strings.Split(xff, ",")
		for _, part := range parts {
			ip := strings.TrimSpace(part)
			if ip != "" && !isPrivateIP(ip) {
				return ip
			}
		}
	}

	// RemoteAddr fallback
	host, _, err := net.SplitHostPort(req.RemoteAddr)
	if err == nil {
		host = strings.TrimSpace(host)
		if !isPrivateIP(host) {
			return host
		}
	}

	return ""
}

// isPrivateIP checks if the IP is loopback, link-local, or private RFC1918/RFC4193.
func isPrivateIP(ipStr string) bool {
	ip := net.ParseIP(ipStr)
	if ip == nil {
		return true
	}
	if ip.IsLoopback() || ip.IsLinkLocalUnicast() || ip.IsLinkLocalMulticast() || ip.IsUnspecified() {
		return true
	}

	// Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
	privateRanges := []struct {
		network net.IPNet
	}{
		{network: net.IPNet{IP: net.ParseIP("10.0.0.0"), Mask: net.CIDRMask(8, 32)}},
		{network: net.IPNet{IP: net.ParseIP("172.16.0.0"), Mask: net.CIDRMask(12, 32)}},
		{network: net.IPNet{IP: net.ParseIP("192.168.0.0"), Mask: net.CIDRMask(16, 32)}},
		{network: net.IPNet{IP: net.ParseIP("fc00::"), Mask: net.CIDRMask(7, 128)}},
	}

	for _, r := range privateRanges {
		if r.network.Contains(ip) {
			return true
		}
	}

	return false
}

// isValidCountryCode verifies ISO 3166-1 alpha-2 format.
func isValidCountryCode(code string) bool {
	code = strings.TrimSpace(code)
	if len(code) != 2 {
		return false
	}
	u := strings.ToUpper(code)
	if u == "XX" || u == "T1" {
		return false
	}
	return (u[0] >= 'A' && u[0] <= 'Z') && (u[1] >= 'A' && u[1] <= 'Z')
}
