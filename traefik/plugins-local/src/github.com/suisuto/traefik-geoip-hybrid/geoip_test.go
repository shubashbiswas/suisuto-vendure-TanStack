package traefik_geoip_hybrid

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestServeHTTP_ExistingHeader(t *testing.T) {
	cfg := CreateConfig()
	ctx := context.Background()

	nextCalled := false
	var receivedCountry string

	next := http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		nextCalled = true
		receivedCountry = req.Header.Get(cfg.HeaderName)
	})

	handler, err := New(ctx, next, cfg, "geoip-hybrid")
	if err != nil {
		t.Fatalf("unexpected error creating handler: %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "https://suisuto.com/", nil)
	req.Header.Set("CF-IPCountry", "BD")

	rw := httptest.NewRecorder()
	handler.ServeHTTP(rw, req)

	if !nextCalled {
		t.Errorf("expected next handler to be called")
	}
	if receivedCountry != "BD" {
		t.Errorf("expected received country to be BD, got %q", receivedCountry)
	}
}

func TestServeHTTP_PrivateIP(t *testing.T) {
	cfg := CreateConfig()
	ctx := context.Background()

	next := http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {})

	handler, err := New(ctx, next, cfg, "geoip-hybrid")
	if err != nil {
		t.Fatalf("unexpected error creating handler: %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "https://suisuto.com/", nil)
	req.RemoteAddr = "127.0.0.1:12345"

	rw := httptest.NewRecorder()
	handler.ServeHTTP(rw, req)

	if req.Header.Get(cfg.HeaderName) != "" {
		t.Errorf("expected empty header for private IP, got %q", req.Header.Get(cfg.HeaderName))
	}
}

func TestIsValidCountryCode(t *testing.T) {
	valid := []string{"BD", "IN", "US", "AE", "gb"}
	invalid := []string{"XX", "T1", "USA", "12", "", "A"}

	for _, v := range valid {
		if !isValidCountryCode(v) {
			t.Errorf("expected %q to be valid", v)
		}
	}

	for _, inv := range invalid {
		if isValidCountryCode(inv) {
			t.Errorf("expected %q to be invalid", inv)
		}
	}
}
