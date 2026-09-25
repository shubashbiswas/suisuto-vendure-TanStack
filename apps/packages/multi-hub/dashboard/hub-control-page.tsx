import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '@vendure/dashboard';
import {
    Warehouse,
    Truck,
    Boxes,
    Layers,
    Globe,
    Plus,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Edit3,
    Trash2,
    X,
    Search,
    Filter,
    ShieldCheck,
    Calculator,
    Package,
    ArrowRight,
    MapPin,
    ExternalLink,
    Clock,
} from 'lucide-react';

interface StockLocationItem {
    id: string;
    createdAt?: string;
    updatedAt?: string;
    name: string;
    description?: string;
    customFields?: {
        hubCode?: string;
        countryCode?: string;
        domesticCarrier?: string;
        crossBorderCarrier?: string;
        standardTransitDays?: number;
    };
}

interface ProductItem {
    id: string;
    name: string;
    slug: string;
    originHub: string;
    preview?: string;
    variantsCount: number;
    totalStockOnHand: number;
    totalStockAllocated: number;
}

interface ShippingMethodItem {
    id: string;
    code: string;
    name: string;
    description?: string;
    checkerCode?: string;
    calculatorCode?: string;
    domesticRate?: number;
    internationalRatePerHub?: number;
}

interface OrderAuditItem {
    id: string;
    code: string;
    state: string;
    orderPlacedAt?: string;
    totalWithTax: number;
    currencyCode: string;
    destinationCountry: string;
    hubs: string[];
    isMultiHub: boolean;
    recipientKycId?: string;
    itemCount: number;
    shippingFee?: number;
}

interface ChannelItem {
    id: string;
    code: string;
    token: string;
    defaultCurrencyCode?: string;
}

const GET_LOCATIONS_QUERY = `
    query GetHubStockLocations {
        stockLocations {
            items {
                id
                createdAt
                updatedAt
                name
                description
                customFields {
                    hubCode
                    countryCode
                    domesticCarrier
                    crossBorderCarrier
                    standardTransitDays
                }
            }
        }
    }
`;

const GET_CHANNELS_QUERY = `
    query GetHubChannels {
        channels {
            items {
                id
                code
                token
                defaultCurrencyCode
            }
        }
    }
`;

const GET_SHIPPING_METHODS_QUERY = `
    query GetHubShippingMethods {
        shippingMethods {
            items {
                id
                code
                name
                description
                checker {
                    code
                }
                calculator {
                    code
                    args {
                        name
                        value
                    }
                }
            }
        }
    }
`;

const GET_PRODUCTS_QUERY = `
    query GetHubProducts($options: ProductListOptions) {
        products(options: $options) {
            totalItems
            items {
                id
                name
                slug
                featuredAsset {
                    preview
                }
                customFields {
                    originHub
                }
                variants {
                    id
                    name
                    sku
                    stockOnHand
                    stockAllocated
                }
            }
        }
    }
`;

const GET_ORDERS_QUERY = `
    query GetHubOrders($options: OrderListOptions) {
        orders(options: $options) {
            totalItems
            items {
                id
                code
                state
                orderPlacedAt
                totalWithTax
                currencyCode
                shippingAddress {
                    countryCode
                }
                shippingLines {
                    priceWithTax
                    shippingMethod {
                        name
                        code
                    }
                }
                lines {
                    id
                    quantity
                    productVariant {
                        product {
                            customFields {
                                originHub
                            }
                        }
                    }
                }
                customFields {
                    isMultiHubOrder
                    recipientKycId
                }
            }
        }
    }
`;

const CREATE_STOCK_LOCATION_MUTATION = `
    mutation CreateHubLocation($input: CreateStockLocationInput!) {
        createStockLocation(input: $input) {
            id
            name
            description
        }
    }
`;

const UPDATE_STOCK_LOCATION_MUTATION = `
    mutation UpdateHubLocation($input: UpdateStockLocationInput!) {
        updateStockLocation(input: $input) {
            id
            name
            description
        }
    }
`;

const DELETE_STOCK_LOCATION_MUTATION = `
    mutation DeleteHubLocation($input: DeleteStockLocationInput!) {
        deleteStockLocation(input: $input) {
            result
            message
        }
    }
`;

const UPDATE_PRODUCT_HUB_MUTATION = `
    mutation UpdateProductOriginHub($input: UpdateProductInput!) {
        updateProduct(input: $input) {
            id
            name
            customFields {
                originHub
            }
        }
    }
`;

export function HubControlPage() {
    const [activeTab, setActiveTab] = useState<'locations' | 'inventory' | 'shipping' | 'orders'>('locations');
    const [locations, setLocations] = useState<StockLocationItem[]>([]);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [shippingMethods, setShippingMethods] = useState<ShippingMethodItem[]>([]);
    const [orders, setOrders] = useState<OrderAuditItem[]>([]);
    const [channels, setChannels] = useState<ChannelItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Filters
    const [productSearch, setProductSearch] = useState('');
    const [productHubFilter, setProductHubFilter] = useState('ALL');
    const [orderSearch, setOrderSearch] = useState('');

    // Modals
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<StockLocationItem | null>(null);
    const [locationFormName, setLocationFormName] = useState('');
    const [locationFormDesc, setLocationFormDesc] = useState('');
    const [isProductAssignOpen, setIsProductAssignOpen] = useState(false);
    const [assigningProduct, setAssigningProduct] = useState<ProductItem | null>(null);
    const [selectedOriginHub, setSelectedOriginHub] = useState('BD_HUB');
    const [submitting, setSubmitting] = useState(false);

    // Shipping Simulator
    const [simDestCountry, setSimDestCountry] = useState('BD');
    const [simSelectedHubs, setSimSelectedHubs] = useState<string[]>(['BD_HUB']);

    const executeGql = async (query: string, variables?: any) => {
        if (api && typeof (api as any).query === 'function' && !query.trim().startsWith('mutation')) {
            return (api as any).query(query, variables);
        }
        if (api && typeof (api as any).mutate === 'function' && query.trim().startsWith('mutation')) {
            return (api as any).mutate(query, variables);
        }
        const res = await fetch('/admin-api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ query, variables }),
        });
        const json = await res.json();
        if (json.errors?.length) {
            throw new Error(json.errors[0].message);
        }
        return json.data;
    };

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [locData, channelData, shipData, prodData, orderData] = await Promise.all([
                executeGql(GET_LOCATIONS_QUERY).catch(() => ({ stockLocations: { items: [] } })),
                executeGql(GET_CHANNELS_QUERY).catch(() => ({ channels: { items: [] } })),
                executeGql(GET_SHIPPING_METHODS_QUERY).catch(() => ({ shippingMethods: { items: [] } })),
                executeGql(GET_PRODUCTS_QUERY, { options: { take: 50 } }).catch(() => ({ products: { items: [] } })),
                executeGql(GET_ORDERS_QUERY, { options: { take: 25 } }).catch(() => ({ orders: { items: [] } })),
            ]);

            // Process Stock Locations
            if (locData?.stockLocations?.items) {
                setLocations(locData.stockLocations.items);
            }

            // Process Channels
            if (channelData?.channels?.items) {
                setChannels(channelData.channels.items);
            }

            // Process Shipping Methods
            if (shipData?.shippingMethods?.items) {
                const parsedMethods: ShippingMethodItem[] = shipData.shippingMethods.items.map((m: any) => {
                    let domesticRate = 120;
                    let internationalRatePerHub = 2500;
                    if (m.calculator?.args) {
                        for (const arg of m.calculator.args) {
                            if (arg.name === 'domesticRate') domesticRate = Number(arg.value);
                            if (arg.name === 'internationalRatePerHub') internationalRatePerHub = Number(arg.value);
                        }
                    }
                    return {
                        id: m.id,
                        code: m.code,
                        name: m.name,
                        description: m.description,
                        checkerCode: m.checker?.code,
                        calculatorCode: m.calculator?.code,
                        domesticRate,
                        internationalRatePerHub,
                    };
                });
                setShippingMethods(parsedMethods);
            }

            // Process Products
            if (prodData?.products?.items) {
                const mappedProducts: ProductItem[] = prodData.products.items.map((p: any) => {
                    const variants = p.variants || [];
                    const stockOnHand = variants.reduce((sum: number, v: any) => sum + (v.stockOnHand || 0), 0);
                    const stockAllocated = variants.reduce((sum: number, v: any) => sum + (v.stockAllocated || 0), 0);
                    return {
                        id: p.id,
                        name: p.name,
                        slug: p.slug,
                        originHub: p.customFields?.originHub || '',
                        preview: p.featuredAsset?.preview,
                        variantsCount: variants.length,
                        totalStockOnHand: stockOnHand,
                        totalStockAllocated: stockAllocated,
                    };
                });
                setProducts(mappedProducts);
            }

            // Process Orders
            if (orderData?.orders?.items) {
                const mappedOrders: OrderAuditItem[] = orderData.orders.items.map((o: any) => {
                    const hubsSet = new Set<string>();
                    for (const line of o.lines || []) {
                        const hub = line.productVariant?.product?.customFields?.originHub;
                        if (hub) hubsSet.add(hub);
                    }
                    const hubs = Array.from(hubsSet);
                    const shippingFee = o.shippingLines?.[0]?.priceWithTax;
                    return {
                        id: o.id,
                        code: o.code,
                        state: o.state,
                        orderPlacedAt: o.orderPlacedAt,
                        totalWithTax: o.totalWithTax,
                        currencyCode: o.currencyCode,
                        destinationCountry: o.shippingAddress?.countryCode || 'N/A',
                        hubs,
                        isMultiHub: Boolean(o.customFields?.isMultiHubOrder || hubs.length > 1),
                        recipientKycId: o.customFields?.recipientKycId,
                        itemCount: (o.lines || []).reduce((sum: number, l: any) => sum + (l.quantity || 1), 0),
                        shippingFee,
                    };
                });
                setOrders(mappedOrders);
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to load multi-hub data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const showToast = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 4000);
    };

    // Location CRUD
    const handleSaveLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            if (editingLocation) {
                await executeGql(UPDATE_STOCK_LOCATION_MUTATION, {
                    input: {
                        id: editingLocation.id,
                        name: locationFormName,
                        description: locationFormDesc,
                    },
                });
                showToast(`Hub '${locationFormName}' updated successfully`);
            } else {
                await executeGql(CREATE_STOCK_LOCATION_MUTATION, {
                    input: {
                        name: locationFormName,
                        description: locationFormDesc,
                    },
                });
                showToast(`Hub '${locationFormName}' created successfully`);
            }
            setIsLocationModalOpen(false);
            setEditingLocation(null);
            setLocationFormName('');
            setLocationFormDesc('');
            await loadData();
        } catch (err: any) {
            setError(err?.message || 'Failed to save location');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteLocation = async (loc: StockLocationItem) => {
        if (!window.confirm(`Are you sure you want to delete hub '${loc.name}'?`)) return;
        try {
            await executeGql(DELETE_STOCK_LOCATION_MUTATION, { input: { id: loc.id } });
            showToast(`Hub '${loc.name}' deleted`);
            await loadData();
        } catch (err: any) {
            setError(err?.message || 'Failed to delete hub');
        }
    };

    // Product Hub Reassignment
    const handleSaveProductHub = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!assigningProduct) return;
        setSubmitting(true);
        try {
            await executeGql(UPDATE_PRODUCT_HUB_MUTATION, {
                input: {
                    id: assigningProduct.id,
                    customFields: {
                        originHub: selectedOriginHub,
                    },
                },
            });
            showToast(`Assigned ${assigningProduct.name} to ${selectedOriginHub}`);
            setIsProductAssignOpen(false);
            setAssigningProduct(null);
            await loadData();
        } catch (err: any) {
            setError(err?.message || 'Failed to assign product hub');
        } finally {
            setSubmitting(false);
        }
    };

    // Filtered data
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch =
                p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                p.slug.toLowerCase().includes(productSearch.toLowerCase());
            const matchesHub =
                productHubFilter === 'ALL'
                    ? true
                    : productHubFilter === 'UNASSIGNED'
                    ? !p.originHub
                    : p.originHub === productHubFilter;
            return matchesSearch && matchesHub;
        });
    }, [products, productSearch, productHubFilter]);

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            return (
                o.code.toLowerCase().includes(orderSearch.toLowerCase()) ||
                o.destinationCountry.toLowerCase().includes(orderSearch.toLowerCase()) ||
                o.hubs.some(h => h.toLowerCase().includes(orderSearch.toLowerCase()))
            );
        });
    }, [orders, orderSearch]);

    // Metrics
    const totalStock = useMemo(() => products.reduce((acc, p) => acc + p.totalStockOnHand, 0), [products]);
    const assignedProductsCount = useMemo(() => products.filter(p => p.originHub).length, [products]);
    const splitOrdersCount = useMemo(() => orders.filter(o => o.isMultiHub).length, [orders]);

    // Simulator calculation
    const calculatedSimPrice = useMemo(() => {
        const dest = simDestCountry.toUpperCase();
        const hubs = simSelectedHubs;
        if (hubs.length === 0) return 0;
        const isDomestic =
            hubs.length === 1 &&
            (hubs[0] === dest || hubs[0].startsWith(`${dest}_`) || hubs[0].includes(dest));
        if (isDomestic) {
            return 120; // 120 BDT/INR
        }
        return 2500 * hubs.length; // $25 per hub
    }, [simDestCountry, simSelectedHubs]);

    const getHubBadge = (code: string) => {
        switch (code.toUpperCase()) {
            case 'BD_HUB':
                return {
                    label: 'BD_HUB',
                    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
                };
            case 'IN_HUB':
                return {
                    label: 'IN_HUB',
                    color: 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400',
                };
            default:
                return {
                    label: code || 'GLOBAL_HUB',
                    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
                };
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 text-foreground">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Warehouse className="size-6 text-primary" /> Multi-Hub Fulfillment & Stock Locations
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Dual-hub warehouse routing, physical inventory dispatch, and split-shipment cross-border calculations.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        id="refresh-multi-hub-btn"
                        type="button"
                        onClick={loadData}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border bg-card hover:bg-muted text-foreground transition shadow-xs cursor-pointer"
                    >
                        <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                    <button
                        id="add-new-hub-btn"
                        type="button"
                        onClick={() => {
                            setEditingLocation(null);
                            setLocationFormName('');
                            setLocationFormDesc('');
                            setIsLocationModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-xs cursor-pointer"
                    >
                        <Plus className="size-4" /> New Physical Hub
                    </button>
                </div>
            </div>

            {/* Notification Toasts / Banners */}
            {successMessage && (
                <div className="flex items-center gap-2.5 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2.5 p-3 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Warehouses</span>
                        <div className="p-1.5 bg-primary/10 text-primary rounded-md">
                            <Warehouse className="size-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold mt-2 text-foreground">{locations.length}</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                        BD Hub (Narayanganj) & IN Hub (Varanasi)
                    </div>
                </div>

                <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Physical Inventory</span>
                        <div className="p-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md">
                            <Boxes className="size-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold mt-2 text-foreground">{totalStock.toLocaleString()} units</div>
                    <div className="text-xs text-muted-foreground mt-1">Across all stock locations</div>
                </div>

                <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Catalog Hub Mapping</span>
                        <div className="p-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md">
                            <Layers className="size-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold mt-2 text-foreground">
                        {assignedProductsCount} <span className="text-sm text-muted-foreground font-normal">/ {products.length}</span>
                    </div>
                    <div className={`text-xs mt-1 font-medium ${assignedProductsCount === products.length ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {assignedProductsCount === products.length ? '100% of products mapped' : `${products.length - assignedProductsCount} unassigned`}
                    </div>
                </div>

                <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Split-Hub Parcels</span>
                        <div className="p-1.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-md">
                            <Truck className="size-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold mt-2 text-foreground">{splitOrdersCount}</div>
                    <div className="text-xs text-muted-foreground mt-1">Cross-border dual-dispatch orders</div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/60 rounded-lg border border-border w-fit">
                <button
                    id="tab-hub-locations"
                    type="button"
                    onClick={() => setActiveTab('locations')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition cursor-pointer ${
                        activeTab === 'locations'
                            ? 'bg-card text-foreground shadow-xs font-semibold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                >
                    <Warehouse className="size-3.5" /> Physical Hubs & Warehouses ({locations.length})
                </button>
                <button
                    id="tab-hub-inventory"
                    type="button"
                    onClick={() => setActiveTab('inventory')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition cursor-pointer ${
                        activeTab === 'inventory'
                            ? 'bg-card text-foreground shadow-xs font-semibold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                >
                    <Boxes className="size-3.5" /> Catalog & Origin Hubs ({products.length})
                </button>
                <button
                    id="tab-hub-shipping"
                    type="button"
                    onClick={() => setActiveTab('shipping')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition cursor-pointer ${
                        activeTab === 'shipping'
                            ? 'bg-card text-foreground shadow-xs font-semibold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                >
                    <Calculator className="size-3.5" /> Split-Shipping Matrix & Simulator
                </button>
                <button
                    id="tab-hub-orders"
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition cursor-pointer ${
                        activeTab === 'orders'
                            ? 'bg-card text-foreground shadow-xs font-semibold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                >
                    <Truck className="size-3.5" /> Split-Order Auditor ({orders.length})
                </button>
            </div>

            {/* Tab 1: Locations */}
            {activeTab === 'locations' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {locations.map(loc => {
                        const isBD = loc.name.toLowerCase().includes('bangladesh') || loc.name.toLowerCase().includes('bd');
                        const isIN = loc.name.toLowerCase().includes('india') || loc.name.toLowerCase().includes('in');
                        const code = isBD ? 'BD_HUB' : isIN ? 'IN_HUB' : 'GLOBAL_HUB';
                        const courier = isBD ? 'Pathao Logistics (Domestic)' : isIN ? 'Delhivery Logistics (Domestic)' : 'DHL Express (Global)';
                        const currency = isBD ? 'BDT (৳)' : isIN ? 'INR (₹)' : 'USD ($)';
                        const hubBadge = getHubBadge(code);
                        const assignedCount = products.filter(p => p.originHub.toUpperCase() === code).length;

                        return (
                            <div
                                key={loc.id}
                                className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-primary/40 transition"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${hubBadge.color}`}>
                                            <MapPin className="size-3" />
                                            {code}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                title="Edit Location"
                                                onClick={() => {
                                                    setEditingLocation(loc);
                                                    setLocationFormName(loc.name);
                                                    setLocationFormDesc(loc.description || '');
                                                    setIsLocationModalOpen(true);
                                                }}
                                                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                                            >
                                                <Edit3 className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Delete Location"
                                                onClick={() => handleDeleteLocation(loc)}
                                                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-semibold text-foreground">
                                            {loc.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1 min-h-[32px] line-clamp-2">
                                            {loc.description || 'Primary physical dispatch warehouse center'}
                                        </p>
                                    </div>

                                    <div className="bg-muted/40 rounded-lg p-3 space-y-2 text-xs border border-border/50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Domestic Logistics:</span>
                                            <span className="font-medium text-foreground">{courier}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Base Currency:</span>
                                            <span className="font-medium text-foreground">{currency}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Assigned Catalog:</span>
                                            <span className="font-semibold text-primary">{assignedCount} products</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                                        <ShieldCheck className="size-3.5" /> Active Stock Strategy
                                    </div>
                                    <span className="text-muted-foreground/80 font-mono text-[11px]">ID: {loc.id}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Tab 2: Catalog & Inventory Allocation */}
            {activeTab === 'inventory' && (
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-lg border border-border">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative min-w-[260px]">
                                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="product-search-input"
                                    type="text"
                                    placeholder="Search products or slugs..."
                                    value={productSearch}
                                    onChange={e => setProductSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                                    <Filter className="size-3.5" /> Hub:
                                </span>
                                <select
                                    id="product-hub-filter-select"
                                    value={productHubFilter}
                                    onChange={e => setProductHubFilter(e.target.value)}
                                    className="px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                                >
                                    <option value="ALL">All Hubs</option>
                                    <option value="BD_HUB">Bangladesh Hub (BD_HUB)</option>
                                    <option value="IN_HUB">India Hub (IN_HUB)</option>
                                    <option value="UNASSIGNED">Unassigned</option>
                                </select>
                            </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                            Showing <strong className="text-foreground">{filteredProducts.length}</strong> of {products.length} products
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Product</th>
                                        <th className="px-4 py-3">Origin Supply Hub</th>
                                        <th className="px-4 py-3">Variants</th>
                                        <th className="px-4 py-3">Stock On Hand</th>
                                        <th className="px-4 py-3">Allocated</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredProducts.map(p => {
                                        const badge = getHubBadge(p.originHub);
                                        return (
                                            <tr key={p.id} className="hover:bg-muted/30 transition">
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        {p.preview ? (
                                                            <img
                                                                src={p.preview}
                                                                alt=""
                                                                className="size-9 rounded-md object-cover border border-border"
                                                            />
                                                        ) : (
                                                            <div className="size-9 rounded-md bg-muted flex items-center justify-center border border-border">
                                                                <Package className="size-4 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium text-foreground">{p.name}</div>
                                                            <div className="text-xs text-muted-foreground font-mono">/{p.slug}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    {p.originHub ? (
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}>
                                                            <MapPin className="size-3" />
                                                            {p.originHub}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
                                                            Unassigned
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3.5 text-xs text-muted-foreground">
                                                    {p.variantsCount} variants
                                                </td>
                                                <td className="px-4 py-3.5 font-semibold text-foreground text-xs">
                                                    {p.totalStockOnHand}
                                                </td>
                                                <td className="px-4 py-3.5 text-xs text-muted-foreground">
                                                    {p.totalStockAllocated}
                                                </td>
                                                <td className="px-4 py-3.5 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setAssigningProduct(p);
                                                            setSelectedOriginHub(p.originHub || 'BD_HUB');
                                                            setIsProductAssignOpen(true);
                                                        }}
                                                        className="px-2.5 py-1 text-xs font-medium rounded-md border border-border bg-card hover:bg-muted text-primary transition cursor-pointer"
                                                    >
                                                        Reassign Hub
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 3: Split-Shipping Matrix & Simulator */}
            {activeTab === 'shipping' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Architecture Rules */}
                    <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                            <div className="p-1.5 bg-primary/10 text-primary rounded-md">
                                <Calculator className="size-4" />
                            </div>
                            <h3 className="text-base font-semibold text-foreground">
                                Multi-Hub Split-Shipping Architecture
                            </h3>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Suisuto applies automatic fulfillment routing and split-hub delivery pricing based on where items physically reside:
                        </p>

                        <div className="space-y-3">
                            <div className="border border-border rounded-lg p-3.5 bg-muted/20 space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="size-4 shrink-0" />
                                    1. Single-Hub Domestic Orders
                                </div>
                                <div className="text-xs text-muted-foreground leading-normal pl-6">
                                    If destination matches origin (e.g. Bangladesh order with BD_HUB items, or India order with IN_HUB items), customer pays flat domestic fee:
                                    <div className="mt-1 font-semibold text-foreground">
                                        Domestic Rate: 120 minor units (৳120 BDT / ₹120 INR)
                                    </div>
                                    <div className="text-[11px] text-muted-foreground/80 mt-0.5">Couriers: Pathao (BD) / Delhivery (IN)</div>
                                </div>
                            </div>

                            <div className="border border-border rounded-lg p-3.5 bg-muted/20 space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                                    <Globe className="size-4 shrink-0" />
                                    2. Cross-Border / Split-Hub Orders
                                </div>
                                <div className="text-xs text-muted-foreground leading-normal pl-6">
                                    If items ship across borders or originate from multiple physical warehouses, rate is charged <strong>per originating supply hub</strong>:
                                    <div className="mt-1 font-semibold text-foreground">
                                        Rate = internationalRatePerHub (2,500 minor units = $25.00) × hubCount
                                    </div>
                                    <div className="text-[11px] text-muted-foreground/80 mt-0.5">Carrier: DHL Express (Split AWB Generated per Hub)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Shipping Simulator */}
                    <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                            <div className="p-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md">
                                <Truck className="size-4" />
                            </div>
                            <h3 className="text-base font-semibold text-foreground">
                                Live Shipping Calculator Simulator
                            </h3>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Simulate how the backend calculator prices orders based on customer address and item origin hubs:
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-foreground mb-1.5">
                                    Destination Country Code
                                </label>
                                <select
                                    id="sim-dest-country-select"
                                    value={simDestCountry}
                                    onChange={e => setSimDestCountry(e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                                >
                                    <option value="BD">Bangladesh (BD)</option>
                                    <option value="IN">India (IN)</option>
                                    <option value="US">United States (US)</option>
                                    <option value="GB">United Kingdom (GB)</option>
                                    <option value="AE">United Arab Emirates (AE)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-foreground mb-1.5">
                                    Products in Basket Originate From:
                                </label>
                                <div className="flex flex-wrap gap-4 pt-1">
                                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={simSelectedHubs.includes('BD_HUB')}
                                            onChange={e => {
                                                if (e.target.checked) setSimSelectedHubs([...simSelectedHubs, 'BD_HUB']);
                                                else setSimSelectedHubs(simSelectedHubs.filter(h => h !== 'BD_HUB'));
                                            }}
                                            className="rounded border-border text-primary focus:ring-primary/20"
                                        />
                                        <span className="font-medium text-foreground">BD_HUB (Narayanganj)</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={simSelectedHubs.includes('IN_HUB')}
                                            onChange={e => {
                                                if (e.target.checked) setSimSelectedHubs([...simSelectedHubs, 'IN_HUB']);
                                                else setSimSelectedHubs(simSelectedHubs.filter(h => h !== 'IN_HUB'));
                                            }}
                                            className="rounded border-border text-primary focus:ring-primary/20"
                                        />
                                        <span className="font-medium text-foreground">IN_HUB (Varanasi)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Calculation Output Box */}
                            <div className="bg-muted/40 rounded-lg p-4 border border-border space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Routing Classification:</span>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                            simSelectedHubs.length === 1 && simSelectedHubs[0].startsWith(simDestCountry)
                                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
                                                : 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400'
                                        }`}
                                    >
                                        {simSelectedHubs.length === 1 && simSelectedHubs[0].startsWith(simDestCountry)
                                            ? 'Domestic Flat Route'
                                            : simSelectedHubs.length > 1
                                            ? 'Split Cross-Border Route (2 Parcels)'
                                            : 'International Single Parcel'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                    <span className="text-sm font-medium text-foreground">Calculated Shipping Fee:</span>
                                    <span className="text-xl font-bold text-primary">
                                        {simSelectedHubs.length === 1 && simSelectedHubs[0].startsWith(simDestCountry)
                                            ? `${simDestCountry === 'BD' ? '৳' : '₹'}${calculatedSimPrice}`
                                            : `$${(calculatedSimPrice / 100).toFixed(2)} USD`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 4: Split-Order Auditor */}
            {activeTab === 'orders' && (
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-lg border border-border">
                        <div className="relative min-w-[300px]">
                            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                id="order-audit-search-input"
                                type="text"
                                placeholder="Search order code, destination, or hub..."
                                value={orderSearch}
                                onChange={e => setOrderSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="text-xs text-muted-foreground">
                            Showing <strong className="text-foreground">{filteredOrders.length}</strong> orders
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Order Code</th>
                                        <th className="px-4 py-3">Destination</th>
                                        <th className="px-4 py-3">Origin Hub(s)</th>
                                        <th className="px-4 py-3">Order Type</th>
                                        <th className="px-4 py-3">Indian KYC ID</th>
                                        <th className="px-4 py-3">Shipping Fee</th>
                                        <th className="px-4 py-3">Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">
                                                No order records found matching filter.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map(o => (
                                            <tr key={o.id} className="hover:bg-muted/30 transition">
                                                <td className="px-4 py-3.5 font-medium text-foreground text-xs">
                                                    {o.code}
                                                </td>
                                                <td className="px-4 py-3.5 text-xs font-semibold text-foreground">
                                                    {o.destinationCountry}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {o.hubs.map(h => {
                                                            const badge = getHubBadge(h);
                                                            return (
                                                                <span
                                                                    key={h}
                                                                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}
                                                                >
                                                                    {h}
                                                                </span>
                                                            );
                                                        })}
                                                        {o.hubs.length === 0 && <span className="text-muted-foreground text-xs">—</span>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    {o.isMultiHub ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400">
                                                            Split Multi-Hub
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                                                            Single Hub
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    {o.recipientKycId ? (
                                                        <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                                                            {o.recipientKycId}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3.5 text-xs text-muted-foreground">
                                                    {o.shippingFee !== undefined ? `${o.currencyCode} ${(o.shippingFee / 100).toFixed(2)}` : '—'}
                                                </td>
                                                <td className="px-4 py-3.5 text-xs font-semibold text-foreground">
                                                    {o.currencyCode} {(o.totalWithTax / 100).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Create/Edit Hub Location */}
            {isLocationModalOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 animate-in fade-in-0 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-base font-semibold text-foreground">
                                {editingLocation ? 'Edit Stock Location Hub' : 'Add Physical Stock Location Hub'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsLocationModalOpen(false)}
                                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveLocation} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-foreground mb-1.5">
                                    Location / Warehouse Name *
                                </label>
                                <input
                                    id="hub-name-input"
                                    type="text"
                                    required
                                    placeholder="e.g. Bangladesh Hub, India Hub, UAE Hub"
                                    value={locationFormName}
                                    onChange={e => setLocationFormName(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-foreground mb-1.5">
                                    Dispatch Center Description
                                </label>
                                <textarea
                                    id="hub-desc-textarea"
                                    rows={3}
                                    placeholder="Physical address, artisan weaving clusters, and domestic courier dispatch center"
                                    value={locationFormDesc}
                                    onChange={e => setLocationFormDesc(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setIsLocationModalOpen(false)}
                                    className="px-4 py-2 text-xs font-medium rounded-lg border border-border bg-card hover:bg-muted text-foreground transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    id="save-hub-location-btn"
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-xs cursor-pointer disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Save Hub'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Reassign Product Origin Hub */}
            {isProductAssignOpen && assigningProduct && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 animate-in fade-in-0 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-base font-semibold text-foreground">
                                Assign Origin Supply Hub
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsProductAssignOpen(false)}
                                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Product: <strong className="text-foreground">{assigningProduct.name}</strong>
                        </p>

                        <form onSubmit={handleSaveProductHub} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-foreground mb-1.5">
                                    Select Origin Hub Identifier
                                </label>
                                <select
                                    id="origin-hub-select"
                                    value={selectedOriginHub}
                                    onChange={e => setSelectedOriginHub(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                                >
                                    <option value="BD_HUB">BD_HUB — Bangladesh Hub (Dhaka / Jamdani)</option>
                                    <option value="IN_HUB">IN_HUB — India Hub (Varanasi / Banarasi)</option>
                                    <option value="GLOBAL">GLOBAL — Global Shared Warehouse</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setIsProductAssignOpen(false)}
                                    className="px-4 py-2 text-xs font-medium rounded-lg border border-border bg-card hover:bg-muted text-foreground transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    id="save-product-hub-btn"
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-xs cursor-pointer disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Update Origin Hub'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
