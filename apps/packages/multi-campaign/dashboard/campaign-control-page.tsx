import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@vendure/dashboard';
import {
    Megaphone,
    Sparkles,
    Calendar,
    Plus,
    Trash2,
    ExternalLink,
    Edit3,
    Filter,
    CheckCircle2,
    Clock,
    Tag,
    Globe,
    RefreshCw,
    AlertCircle,
    X,
    Eye,
} from 'lucide-react';

interface CampaignItem {
    id: string;
    market: string;
    name: string;
    slug: string;
    status: string;
    priority?: number;
    startAt?: string;
    endAt?: string;
    heroImageUrl?: string;
    heroHeadline?: string;
    heroSubHeadline?: string;
    heroTag?: string;
    promotionCode?: string;
    landingPages?: Array<{ subSlug: string; title: string }>;
    homepageSections?: Array<{ type: string }>;
}

const GET_CAMPAIGNS_QUERY = `
    query GetAdminCampaigns($market: String, $status: String) {
        campaigns(market: $market, status: $status) {
            id
            createdAt
            updatedAt
            market
            name
            slug
            status
            priority
            startAt
            endAt
            heroImageUrl
            heroHeadline
            heroSubHeadline
            heroCtaLabel
            heroCtaHref
            heroTag
            homepageSections {
                type
            }
            landingPages {
                subSlug
                title
            }
            promotionCode
            seoTitle
            seoDescription
        }
    }
`;

const UPDATE_CAMPAIGN_MUTATION = `
    mutation UpdateCampaign($input: UpdateCampaignInput!) {
        updateCampaign(input: $input) {
            id
            status
        }
    }
`;

const DELETE_CAMPAIGN_MUTATION = `
    mutation DeleteCampaign($id: ID!) {
        deleteCampaign(id: $id) {
            result
            message
        }
    }
`;

const CREATE_CAMPAIGN_MUTATION = `
    mutation CreateCampaign($input: CreateCampaignInput!) {
        createCampaign(input: $input) {
            id
            name
            slug
            status
            market
        }
    }
`;

export function CampaignControlPage() {
    const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMarket, setSelectedMarket] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<CampaignItem | null>(null);

    // Form state
    const [formMarket, setFormMarket] = useState('in');
    const [formName, setFormName] = useState('');
    const [formSlug, setFormSlug] = useState('');
    const [formStatus, setFormStatus] = useState('active');
    const [formPriority, setFormPriority] = useState<number>(0);
    const [formStartAt, setFormStartAt] = useState('');
    const [formEndAt, setFormEndAt] = useState('');
    const [formHeroImageUrl, setFormHeroImageUrl] = useState('/images/hero-campaign.jpg');
    const [formCollectionSlug, setFormCollectionSlug] = useState('atelier');
    const [formHeadline, setFormHeadline] = useState('');
    const [formSubHeadline, setFormSubHeadline] = useState('');
    const [formPromoCode, setFormPromoCode] = useState('');
    const [formTag, setFormTag] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadCampaigns = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const vars: Record<string, any> = {};
            if (selectedMarket !== 'all') vars.market = selectedMarket;
            if (selectedStatus !== 'all') vars.status = selectedStatus;

            let data: any;
            if (api && typeof api.query === 'function') {
                data = await api.query(GET_CAMPAIGNS_QUERY, vars);
            } else {
                const res = await fetch('/admin-api', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ query: GET_CAMPAIGNS_QUERY, variables: vars }),
                });
                const json = await res.json();
                data = json.data;
            }

            if (data?.campaigns) {
                setCampaigns(data.campaigns);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load campaigns');
        } finally {
            setLoading(false);
        }
    }, [selectedMarket, selectedStatus]);

    useEffect(() => {
        loadCampaigns();
    }, [loadCampaigns]);

    const handleToggleStatus = async (campaign: CampaignItem) => {
        const newStatus = campaign.status === 'active' ? 'draft' : 'active';
        try {
            if (api && typeof api.mutate === 'function') {
                await api.mutate(UPDATE_CAMPAIGN_MUTATION, {
                    input: { id: campaign.id, status: newStatus },
                });
            } else {
                await fetch('/admin-api', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        query: UPDATE_CAMPAIGN_MUTATION,
                        variables: { input: { id: campaign.id, status: newStatus } },
                    }),
                });
            }
            loadCampaigns();
        } catch (err: any) {
            alert('Failed to update campaign status: ' + err.message);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete campaign "${name}"?`)) return;
        try {
            if (api && typeof api.mutate === 'function') {
                await api.mutate(DELETE_CAMPAIGN_MUTATION, { id });
            } else {
                await fetch('/admin-api', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        query: DELETE_CAMPAIGN_MUTATION,
                        variables: { id },
                    }),
                });
            }
            loadCampaigns();
        } catch (err: any) {
            alert('Failed to delete campaign: ' + err.message);
        }
    };

    const handleOpenCreate = () => {
        const now = new Date();
        const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const toLocalISO = (d: Date) => {
            const offset = d.getTimezoneOffset() * 60000;
            return new Date(d.getTime() - offset).toISOString().slice(0, 16);
        };

        setEditingCampaign(null);
        setFormMarket('in');
        setFormName('');
        setFormSlug('');
        setFormStatus('active');
        setFormPriority(10);
        setFormStartAt(toLocalISO(now));
        setFormEndAt(toLocalISO(future));
        setFormHeroImageUrl('/images/hero-campaign.jpg');
        setFormCollectionSlug('atelier');
        setFormHeadline('');
        setFormSubHeadline('');
        setFormPromoCode('');
        setFormTag('');
        setIsCreateOpen(true);
    };

    const handleSaveCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const now = new Date();
            const startIso = formStartAt ? new Date(formStartAt).toISOString() : new Date(now.getTime() - 60 * 60 * 1000).toISOString();
            const endIso = formEndAt ? new Date(formEndAt).toISOString() : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

            const ctaHref = formMarket === 'global' ? `/campaign/${formSlug}` : `/${formMarket}/campaign/${formSlug}`;

            const input: Record<string, any> = {
                market: formMarket,
                name: formName,
                slug: formSlug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
                status: formStatus,
                priority: Number(formPriority) || 0,
                startAt: startIso,
                endAt: endIso,
                heroImageUrl: formHeroImageUrl || '/images/hero-campaign.jpg',
                heroHeadline: formHeadline || formName,
                heroSubHeadline: formSubHeadline || 'Exclusive seasonal luxury handloom release.',
                heroCtaLabel: 'Explore Collection',
                heroCtaHref: ctaHref,
                heroTag: formTag || 'Festive Release',
                promotionCode: formPromoCode || undefined,
                homepageSections: [
                    { type: 'hero' },
                    { type: 'countdown', props: { headline: `${formName} Window` } },
                    { type: 'campaign-banner' },
                    { type: 'featured-collection', props: { collectionSlug: formCollectionSlug || 'atelier', title: 'Curated Silks' } },
                    { type: 'artisan-story' },
                    { type: 'newsletter' },
                ],
                seoTitle: `${formName} | Suisuto Atelier`,
                seoDescription: formSubHeadline || 'Seasonal luxury garments and heirloom textiles.',
            };

            if (editingCampaign) {
                input.id = editingCampaign.id;
                const updateQuery = `
                    mutation UpdateCampaign($input: UpdateCampaignInput!) {
                        updateCampaign(input: $input) {
                            id
                        }
                    }
                `;
                if (api && typeof api.mutate === 'function') {
                    await api.mutate(updateQuery, { input });
                } else {
                    await fetch('/admin-api', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ query: updateQuery, variables: { input } }),
                    });
                }
            } else {
                if (api && typeof api.mutate === 'function') {
                    await api.mutate(CREATE_CAMPAIGN_MUTATION, { input });
                } else {
                    await fetch('/admin-api', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ query: CREATE_CAMPAIGN_MUTATION, variables: { input } }),
                    });
                }
            }

            setIsCreateOpen(false);
            loadCampaigns();
        } catch (err: any) {
            alert('Failed to save campaign: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const getMarketBadge = (market: string) => {
        switch (market.toLowerCase()) {
            case 'in':
                return { label: 'India 🇮🇳', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400' };
            case 'bd':
                return { label: 'Bangladesh 🇧🇩', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400' };
            default:
                return { label: 'Global 🌐', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400' };
        }
    };

    const getStorefrontLink = (campaign: CampaignItem) => {
        const origin = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';
        if (campaign.market === 'global') {
            return `${origin}/campaign/${campaign.slug}`;
        }
        return `${origin}/${campaign.market}/campaign/${campaign.slug}`;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <Megaphone className="size-6 text-primary" />
                        <h1 className="text-2xl font-semibold tracking-tight">Multi-Market Campaigns</h1>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Control region-specific marketing campaigns, countdown schedules, and landing pages with complete market isolation.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadCampaigns}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition"
                        title="Refresh"
                    >
                        <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:opacity-90 transition"
                    >
                        <Plus className="size-4" />
                        New Campaign
                    </button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Campaigns</div>
                    <div className="text-2xl font-bold mt-1 text-foreground">{campaigns.length}</div>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Windows</div>
                    <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                        {campaigns.filter(c => c.status === 'active').length}
                    </div>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">India (INR ₹)</div>
                    <div className="text-2xl font-bold mt-1 text-orange-600 dark:text-orange-400">
                        {campaigns.filter(c => c.market === 'in').length}
                    </div>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Bangladesh (BDT ৳)</div>
                    <div className="text-2xl font-bold mt-1 text-teal-600 dark:text-teal-400">
                        {campaigns.filter(c => c.market === 'bd').length}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-lg border border-border">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Filter className="size-3.5" /> Market:
                    </span>
                    {['all', 'in', 'bd', 'global'].map(m => (
                        <button
                            key={m}
                            onClick={() => setSelectedMarket(m)}
                            className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                                selectedMarket === m
                                    ? 'bg-background shadow-xs text-foreground border border-border'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {m === 'all' ? 'All' : m.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Status:</span>
                    {['all', 'active', 'draft', 'archived'].map(s => (
                        <button
                            key={s}
                            onClick={() => setSelectedStatus(s)}
                            className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize transition ${
                                selectedStatus === s
                                    ? 'bg-background shadow-xs text-foreground border border-border'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                    <AlertCircle className="size-4" />
                    <span>{error}</span>
                </div>
            )}

            {/* Campaigns Table */}
            <div className="border border-border rounded-lg bg-card overflow-hidden shadow-xs">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <tr>
                            <th className="py-3 px-4">Market</th>
                            <th className="py-3 px-4">Campaign Name & Headline</th>
                            <th className="py-3 px-4">Slug / Path</th>
                            <th className="py-3 px-4">Promo Code</th>
                            <th className="py-3 px-4">Priority</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                    <RefreshCw className="size-5 animate-spin inline mr-2" />
                                    Loading campaign registry...
                                </td>
                            </tr>
                        ) : campaigns.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                    No campaigns found matching current filters.
                                </td>
                            </tr>
                        ) : (
                            campaigns.map(c => {
                                const badge = getMarketBadge(c.market);
                                const storefrontUrl = getStorefrontLink(c);
                                return (
                                    <tr key={c.id} className="hover:bg-muted/30 transition">
                                        {/* Market */}
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${badge.color}`}>
                                                {badge.label}
                                            </span>
                                        </td>

                                        {/* Name & Headline */}
                                        <td className="py-3.5 px-4">
                                            <div className="font-semibold text-foreground">{c.name}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                                {c.heroHeadline || '—'}
                                            </div>
                                            {c.heroTag && (
                                                <span className="inline-block text-[10px] uppercase font-mono tracking-wider text-amber-500 mt-1">
                                                    ★ {c.heroTag}
                                                </span>
                                            )}
                                        </td>

                                        {/* Slug */}
                                        <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">
                                            <div>/{c.slug}</div>
                                            {c.landingPages && c.landingPages.length > 0 && (
                                                <div className="text-[11px] text-primary/80 mt-0.5">
                                                    +{c.landingPages.length} sub-page{c.landingPages.length > 1 ? 's' : ''}
                                                </div>
                                            )}
                                        </td>

                                        {/* Promo Code */}
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            {c.promotionCode ? (
                                                <span className="inline-flex items-center gap-1 font-mono text-xs bg-muted px-2 py-0.5 rounded border border-border text-foreground">
                                                    <Tag className="size-3 text-primary" />
                                                    {c.promotionCode}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </td>

                                        {/* Priority */}
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-muted text-foreground border border-border">
                                                {c.priority ?? 0}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleStatus(c)}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                                                    c.status === 'active'
                                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 hover:bg-emerald-500/20'
                                                        : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                                                }`}
                                                title="Click to toggle status"
                                            >
                                                {c.status === 'active' ? (
                                                    <>
                                                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="size-1.5 rounded-full bg-muted-foreground" />
                                                        {c.status}
                                                    </>
                                                )}
                                            </button>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                                            <a
                                                href={storefrontUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 p-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition"
                                                title="View in Storefront"
                                            >
                                                <Eye className="size-3.5" />
                                            </a>
                                            <button
                                                onClick={() => {
                                                    setEditingCampaign(c);
                                                    setFormMarket(c.market);
                                                    setFormName(c.name);
                                                    setFormSlug(c.slug);
                                                    setFormStatus(c.status);
                                                    setFormPriority(c.priority ?? 0);
                                                    setFormStartAt(c.startAt ? c.startAt.slice(0, 16) : '');
                                                    setFormEndAt(c.endAt ? c.endAt.slice(0, 16) : '');
                                                    setFormHeroImageUrl(c.heroImageUrl || '/images/hero-campaign.jpg');
                                                    setFormHeadline(c.heroHeadline || '');
                                                    setFormSubHeadline(c.heroSubHeadline || '');
                                                    setFormPromoCode(c.promotionCode || '');
                                                    setFormTag(c.heroTag || '');
                                                    setIsCreateOpen(true);
                                                }}
                                                className="inline-flex items-center gap-1 p-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition"
                                                title="Edit Campaign"
                                            >
                                                <Edit3 className="size-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.id, c.name)}
                                                className="inline-flex items-center gap-1 p-1.5 text-xs text-destructive hover:bg-destructive/10 rounded transition"
                                                title="Delete Campaign"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create / Edit Modal Dialog */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
                            <div>
                                <h3 className="font-semibold text-lg text-foreground">
                                    {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Configure regional campaign privileges, hero banners, and countdown windows.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveCampaign} className="p-5 space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Target Market</label>
                                    <select
                                        value={formMarket}
                                        onChange={e => setFormMarket(e.target.value)}
                                        className="w-full text-xs p-2 rounded-md border border-border bg-background text-foreground"
                                    >
                                        <option value="in">India (in) 🇮🇳</option>
                                        <option value="bd">Bangladesh (bd) 🇧🇩</option>
                                        <option value="global">Global (/) 🌐</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
                                    <select
                                        value={formStatus}
                                        onChange={e => setFormStatus(e.target.value)}
                                        className="w-full text-xs p-2 rounded-md border border-border bg-background text-foreground"
                                    >
                                        <option value="active">Active</option>
                                        <option value="draft">Draft</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Priority (Higher wins)</label>
                                    <input
                                        type="number"
                                        value={formPriority}
                                        onChange={e => setFormPriority(Number(e.target.value))}
                                        className="w-full text-xs p-2 rounded-md border border-border bg-background text-foreground"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Start Window (Active from)</label>
                                    <input
                                        type="datetime-local"
                                        value={formStartAt}
                                        onChange={e => setFormStartAt(e.target.value)}
                                        className="w-full text-xs p-2 rounded-md border border-border bg-background text-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">End Window (Active until)</label>
                                    <input
                                        type="datetime-local"
                                        value={formEndAt}
                                        onChange={e => setFormEndAt(e.target.value)}
                                        className="w-full text-xs p-2 rounded-md border border-border bg-background text-foreground"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Campaign Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Navratri 2026 Festive Edit"
                                        value={formName}
                                        onChange={e => {
                                            setFormName(e.target.value);
                                            if (!editingCampaign && !formSlug) {
                                                setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                                            }
                                        }}
                                        className="w-full text-xs p-2 rounded-md border border-border bg-background text-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">URL Slug</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. navratri"
                                        value={formSlug}
                                        onChange={e => setFormSlug(e.target.value)}
                                        className="w-full text-xs p-2 rounded-md border border-border bg-background text-foreground font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Hero Headline</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Divine Grace in Pure Silk"
                                        value={formHeadline}
                                        onChange={e => setFormHeadline(e.target.value)}
                                        className="w-full text-xs p-2 rounded-md border border-border bg-background text-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Promo Voucher Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. FESTIVE20"
                                        value={formPromoCode}
                                        onChange={e => setFormPromoCode(e.target.value.toUpperCase())}
                                        className="w-full text-xs p-2 rounded-md border border-border bg-background text-foreground font-mono uppercase"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Hero Image Asset URL</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={formHeroImageUrl}
                                        onChange={e => setFormHeroImageUrl(e.target.value)}
                                        placeholder="/images/hero-campaign.jpg"
                                        className="flex-1 text-xs p-2 rounded-md border border-border bg-background text-foreground font-mono"
                                    />
                                    {formHeroImageUrl && (
                                        <div className="size-8 rounded border border-border overflow-hidden shrink-0 bg-muted">
                                            <img
                                                src={formHeroImageUrl}
                                                alt="Preview"
                                                className="size-full object-cover"
                                                onError={e => { (e.target as HTMLElement).style.display = 'none'; }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Featured Collection Slug</label>
                                    <input
                                        type="text"
                                        placeholder="atelier"
                                        value={formCollectionSlug}
                                        onChange={e => setFormCollectionSlug(e.target.value)}
                                        className="w-full text-xs p-2 rounded-md border border-border bg-background text-foreground font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1">Hero Badge / Tag</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Limited Festive Edition"
                                        value={formTag}
                                        onChange={e => setFormTag(e.target.value)}
                                        className="w-full text-xs p-2 rounded-md border border-border bg-background text-foreground"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Sub-Headline / Editorial Note</label>
                                <textarea
                                    rows={2}
                                    placeholder="Celebrating timeless craftsmanship and generational heritage..."
                                    value={formSubHeadline}
                                    onChange={e => setFormSubHeadline(e.target.value)}
                                    className="w-full text-xs p-2 rounded-md border border-border bg-background text-foreground"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2 text-xs font-medium border border-border rounded-md hover:bg-muted text-foreground transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : editingCampaign ? 'Update Campaign' : 'Publish Campaign'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
