# 08. Standard Operating Procedures (SOPs)

## 1. Merchandising: Creating & Publishing a New Product

### Step-by-Step Guide:
1. **Access Vendure Admin**: Navigate to `https://admin.yourbrand.com` (or local `http://localhost:3000/admin`).
2. **Create Product**:
   * Go to **Catalog** $\to$ **Products** $\to$ **Create Product**.
   * Fill in **Title**, **Slug**, and **Description**.
   * Upload high-resolution model photography and fabric close-ups.
3. **Set Custom Fields**:
   * `Origin Hub`: Select `BD_HUB`, `IN_HUB`, or `DUAL_HUB`.
   * `Fabric Care Guide`: Add washing instructions (e.g., *"Dry clean only. Cool iron on reverse."*).
   * `Model Specs`: Enter sizing reference (e.g., *"Model is 5'9\" wearing size S"*).
   * `HS Code`: Enter the 6-digit apparel HS code (e.g., `6204.49` for silk dresses).
4. **Assign Channels**:
   * In the top-right **Channels** widget, select where this garment will be sold:
     * Check `[x] India` to sell in India.
     * Check `[x] Global` to sell internationally.
     * Leave `[ ] Bangladesh` unchecked if not retailing domestically in BD.
5. **Configure Channel Pricing & Stock**:
   * Switch active channel view to **India Channel** $\to$ enter price in **INR** (e.g., `₹5,499`).
   * Switch active channel view to **Global Channel** $\to$ enter price in **USD** (e.g., `$75.00`).
   * Under **Stock Locations**, assign units to the physical hub (e.g., `India Hub: 40 units`).
6. **Publish**: Toggle status to **Published** and click **Save**.

---

## 2. Regional Agent SOP: Daily Fulfillment & Dispatch

### Scenario A: Domestic Order (e.g., India Agent fulfilling an Indian order)
1. In Vendure Admin, filter orders: `Channel: India`, `Fulfillment Status: Pending`.
2. Click on the order $\to$ click **Create Fulfillment**.
3. Select domestic courier partner (e.g., **Delhivery**).
4. Print picking list and packing slip.
5. Pack the garment in brand packaging.
6. Attach the domestic shipping label with barcode.
7. Input the AWB tracking number in Vendure and mark as **Shipped**.

---

### Scenario B: International Export Order (e.g., BD Agent fulfilling a US order)
1. In Vendure Admin, filter orders: `Channel: Global`, `Fulfillment Status: Pending`.
2. Open the order assigned to **Bangladesh Hub**.
3. Print:
   * **DHL International Airway Bill (AWB)**.
   * **Commercial Export Invoice** (3 copies, signed with HS Code and company BIN/TIN).
4. Pack the garment in protective moisture-resistant packaging.
5. Place commercial invoices in the clear courier pouch on the outside of the box.
6. Input DHL tracking code into Vendure and mark as **Shipped**.
7. The system automatically emails the customer with their direct DHL tracking link.

---

## 3. Inventory Restocking SOP

When local weavers or workshops deliver new batches:
1. Agent opens **Catalog** $\to$ **Products** $\to$ selects product variant.
2. Under **Stock Levels**, locate their assigned hub (`India Hub` or `Bangladesh Hub`).
3. Enter additional units into **Stock on Hand**.
4. Click **Save**. The new quantity is immediately purchasable on all assigned channels.
