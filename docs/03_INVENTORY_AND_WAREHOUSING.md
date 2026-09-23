# 03. Inventory & Multi-Hub Warehousing

## 1. Physical Stock Locations

Vendure manages physical stock through the `StockLocation` entity. Two primary hubs are configured:

1. **`StockLocation: Bangladesh Hub`** (Located in Dhaka, managed by BD Agent)
2. **`StockLocation: India Hub`** (Located in Delhi/Mumbai, managed by India Agent)

```
                       ┌─────────────────────────────┐
                       │   Product Variant (SKU)     │
                       └──────────────┬──────────────┘
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
    [Stock Location: BD Hub]                      [Stock Location: IN Hub]
    • stockOnHand: 50 units                       • stockOnHand: 0 units
    • stockAllocated: 2 units                     • stockAllocated: 0 units
    • stockAvailable: 48 units                    • stockAvailable: 0 units
```

---

## 2. Stock Allocation & Reservation Lifecycle

Vendure strictly tracks stock states to avoid overselling during high-traffic drops:

1. **Browsing / Cart State:**
   * Available stock is computed as: `stockOnHand - stockAllocated`.
   * If available stock reaches 0, the variant shows as *"Out of Stock"*.

2. **Order Placement (`PaymentSettled`):**
   * Stock is reserved by incrementing `stockAllocated` in the assigned hub.
   * `stockOnHand` remains untouched until physical dispatch.

3. **Physical Dispatch (`Fulfillment Created`):**
   * The regional agent packs the parcel and creates a fulfillment.
   * `stockAllocated` is decremented by the ordered quantity.
   * `stockOnHand` is decremented by the ordered quantity.

4. **Cancellation / Refund (`OrderCancelled`):**
   * If an order is canceled before dispatch, `stockAllocated` is released back to available inventory immediately.

---

## 3. Stock Location Isolation & Regional Agent Scoping

Each physical hub operates autonomously:
* **India Agent Admin Account**: Restricted to `India Hub`. They can update quantities, conduct stock takes, and manage inventory only for products stocked in India.
* **Bangladesh Agent Admin Account**: Restricted to `Bangladesh Hub`.
* **Central Merchandiser / SuperAdmin**: Full cross-hub visibility to rebalance stock or adjust channel allocations.

---

## 4. Multi-Hub Safety Stock & Low-Stock Alerts

Vendure triggers automated notifications when stock drops below threshold:
* Default threshold: **5 units per variant per hub**.
* Notification sent via email or webhook to the respective regional sourcing agent to initiate restocking from local artisan weavers or workshops.
