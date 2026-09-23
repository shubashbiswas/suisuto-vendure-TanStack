# 07. Payments & Shipping Carrier Integrations

## 1. Payment Gateway Topology

Each channel uses localized payment methods to maximize checkout conversion while ensuring compliance with local banking regulations.

```
                  ┌─────────────────────────────────────┐
                  │           CHECKOUT ROUTER           │
                  └──────────────────┬──────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
   [BD Domestic]              [India Domestic]             [Global]
   • Gateway: SSLCOMMERZ      • Gateway: Razorpay          • Gateway: Stripe
   • Currency: BDT (৳)        • Currency: INR (₹)          • Currency: USD ($)
   • Methods:                 • Methods:                   • Methods:
     - bKash Direct Checkout    - UPI (GPay, PhonePe, Paytm) - Credit/Debit Cards
     - Nagad                    - Indian NetBanking          - Apple Pay / Google Pay
     - Local Credit/Debit Cards - Domestic Credit Cards      - PayPal
     - Cash on Delivery (COD)   - COD (optional)
```

---

## 2. Payment Gateway Configuration Matrix

| Region | Primary Gateway | Backup / Alternative | Supported Methods | Webhook Event Requirements |
| :--- | :--- | :--- | :--- | :--- |
| **Bangladesh** | **SSLCOMMERZ** | Direct bKash PGW | bKash, Nagad, Visa, Mastercard, Cash on Delivery | `VALIDATED`, `FAILED`, `CANCELLED` |
| **India** | **Razorpay** | Cashfree | UPI (QR & Intent), NetBanking, RuPay, Visa, Mastercard | `order.paid`, `payment.failed`, `refund.processed` |
| **Global** | **Stripe** | PayPal | International Cards, Apple Pay, Google Pay, Klarna | `payment_intent.succeeded`, `charge.refunded` |

---

## 3. Courier Logistics & Shipping Services

### 3.1 Domestic Bangladesh Courier Matrix
* **Primary Couriers**: Pathao Courier, Steadfast Courier, RedX.
* **Service Level**: Next-day delivery within Dhaka; 2–4 business days across other divisions.
* **Cash on Delivery (COD)**: Real-time collection status tracking and reconciliation against Vendure orders.

### 3.2 Domestic India Courier Matrix
* **Primary Couriers**: Delhivery, BlueDart, Shiprocket.
* **Service Level**: 1–2 days metro-to-metro; 3–5 days non-metro.
* **API Integration**: Automatic Airway Bill (AWB) generation upon fulfillment creation in Vendure.

### 3.3 Cross-Border & International Couriers
* **Primary Carriers**: **DHL Express**, **FedEx International Priority**, **Aramex**.
* **Service Level**: 3–6 business days worldwide.
* **Required Documentation**:
  * International Airway Bill (AWB)
  * Commercial Invoice (3 copies, signed with HS codes)
  * Receiver KYC attachment for shipments heading into India.

---

## 4. Shipping Rate Calculation Rules

Custom `ShippingCalculator` in Vendure:

1. **Single-Hub Domestic**:
   * Order contains only domestic items $\to$ Standard flat rate (e.g. ৳80 in BD, ₹120 in India, or Free over a qualifying threshold).
2. **Single-Hub Export**:
   * Order contains items from one hub to a foreign destination $\to$ International base tier (e.g. $25 for first 0.5kg + $10/kg additional).
3. **Multi-Hub Split Export**:
   * Order contains items from **both** India and BD hubs destined for an international address $\to$ Base rate calculated per parcel:
     $$\text{Total Shipping} = \text{Shipping}_{\text{India Hub}} + \text{Shipping}_{\text{BD Hub}}$$
   * Transparently broken down in the customer's cart so there are no surprises.
