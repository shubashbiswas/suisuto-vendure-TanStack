# 02. Catalog & Channel Management

## 1. Channel-Based Product Visibility

In Vendure, products and variants implement `ChannelAware`. This provides complete isolation of the product catalog per sales channel.

### The Channel Assignment Matrix
Merchandisers can assign any product to **1, 2, or all 3 channels**:

```
Product: Handwoven Jamdani
  ├── Channels Assigned: [ Bangladesh (BDT), Global (USD) ]
  └── Channels Excluded: [ India (INR) ]
         │
         ├── Bangladesh Storefront ──► VISIBLE (Price: ৳6,500)
         ├── Global Storefront     ──► VISIBLE (Price: $75.00)
         └── India Storefront      ──► 404 / NOT FOUND (Completely invisible)
```

### Visibility Rules
1. **Single-Channel Exclusive Drops**:
   * A regional festive piece (e.g., *Pahela Baishakh Saree*) can be assigned **only** to the `bangladesh` channel.
   * Customers browsing the India or Global storefronts cannot find, view, or purchase this product.
2. **Dual-Channel Domestic + Export Drops**:
   * Hand-embroidered garments crafted in India assigned to `india` and `global`.
   * Visible to Indian buyers in INR and to worldwide buyers in USD.
3. **Universal Drops**:
   * Core staples (e.g., *Organic Cotton Denim Jackets*) assigned to `bangladesh`, `india`, and `global`.
   * Priced independently in all three currencies.

---

## 2. Multi-Currency Pricing per Variant

Rather than using automated floating currency conversion that creates awkward price points (e.g., ৳6,500 becoming ₹5,047.83), Vendure allows **explicit psychological price setting per channel**:

| Product Title | Bangladesh Channel (BDT) | India Channel (INR) | Global Channel (USD) |
| :--- | :--- | :--- | :--- |
| **Pure Silk Banarasi Saree** | *Excluded* | **₹8,999** | **$120.00** |
| **Handloom Muslin Tunic** | **৳7,500** | *Excluded* | **$85.00** |
| **Relaxed Raw Denim Overcoat** | **৳4,200** | **₹3,499** | **$55.00** |

---

## 3. Fashion Catalog Schema & Custom Fields

Fashion e-commerce requires richer specifications than generic retail. The following custom fields are configured on the `Product` entity:

| Field Name | Type | Options / Format | Purpose |
| :--- | :--- | :--- | :--- |
| **`originHub`** | String Enum | `BD_HUB`, `IN_HUB`, `DUAL_HUB` | Defines physical origin studio for shipping calculations and badge display |
| **`fabricCareGuide`** | Rich Text | Markdown / HTML | Washing, dry-cleaning, and iron temperature instructions |
| **`modelSpecs`** | String | Short string (e.g. *"5'10, bust 32, wearing S"*) | Provides fit reference for customers |
| **`hsCode`** | String | 6–8 digit HS Code (e.g. `6204.42.00`) | Garment customs classification for international airway bills |

---

## 4. Fashion Option Groups & Variants

Every garment is modeled with standard option groups:
1. **Size**: `XS`, `S`, `M`, `L`, `XL`, `Custom Fit`
2. **Color**: Visual swatch + Hex code (e.g., `#1E293B` Navy)
3. **Inseam / Length** *(optional)*: `Petite (28")`, `Regular (30")`, `Tall (32")`

Vendure automatically generates the variant matrix ($Color \times Size$) while allowing per-variant barcode/SKU tracking.
