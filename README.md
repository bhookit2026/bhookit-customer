# BhookIt V1.4 — Multi-Restaurant Food Ordering & Management System

Enterprise-grade multi-vendor food delivery and restaurant orchestration platform featuring real-world GPS tracking, Dine-in Table Reservations, Customer Loyalty Wallet with 5% Cashback, Pure Veg Filter, Razorpay/UPI payment simulation, Delivery OTP verification, PWA mobile suite, Saved Address manager, in-app notifications drawer, 24/7 support assistant, and sleek Dark/Light theme switching.

---

## 🚀 Complete Platform Capabilities

1. **Multi-Restaurant Marketplace**:
   - Multi-vendor directory with restaurant profiles, cuisines, prep times, and minimum order values.
   - Food Safety Compliance: **FSSAI License Badge** (e.g. `11524012000101`) & **Hygiene Score** (⭐ 4.8 - 4.9).
   - Cuisine filters: Fast Food, North Indian, South Indian, Pizza & Burger, Chinese, Desserts.
   - Real-time search across dishes and restaurant names.
   - Veg / Non-Veg indicators on every food item.

2. **Food Customizer & Add-ons**:
   - Portion selection (Regular / Large).
   - Extra add-on ingredients (Extra cheese, Peri-peri dip, Drinks).

3. **Customer Saved Addresses & Address Book**:
   - Multiple saved destinations: 🏠 Home, 🏢 Work, 📍 Other.
   - 1-click address selector at checkout with "+ Add New Address" modal.

4. **Real-World Live GPS Tracking (OpenStreetMap & Leaflet)**:
   - Real-world map with animated courier marker moving through streets with live route simulation.
   - Real-time ETA updates and direct WhatsApp / phone contact.
   - Stepper: *Placed -> Confirmed -> Kitchen Preparing -> Ready -> Out for Delivery -> Delivered*.

5. **Proof of Delivery (POD) via 4-Digit Secure OTP**:
   - Unique 4-digit code generated for each order (e.g. `4829`) displayed securely on customer's order and live tracking cards.
   - Delivery partner must enter this OTP in the Rider App to confirm arrival and complete delivery, preventing fraudulent deliveries.

6. **In-App Activity & Push Notification Drawer**:
   - Header notification bell with unread badge counter (🔔 `3`).
   - Dropdown notification list detailing order status changes, kitchen dispatch, and promotional offers.

7. **Live Order Support Concierge**:
   - Interactive support modal with smart inquiry chips (*Where is my order? ⏱️*, *Call Rider 🚴*, *Cooking Instructions 👨‍🍳*, *Bill & Taxes 💳*).
   - Instant response simulator for customer satisfaction.

8. **Dark / Light Mode Theme Engine**:
   - Modern dark slate theme (`data-theme="dark"`) with seamless CSS variable switching and persistent `localStorage` preference.

9. **Multi-Channel Payments (Razorpay & UPI Simulation)**:
   - Backend REST endpoints (`/api/payment/create-order`, `/api/payment/verify`).
   - Interactive payment gateway modal supporting UPI (GPay, PhonePe, Paytm, BHIM), Cards, and Netbanking.
   - HMAC-SHA256 signature verification and transaction ID logging (`pay_live_...`).

10. **Progressive Web App (PWA) Mobile Suite**:
    - Android, iOS, and Desktop installable (`manifest.json` with shortcuts, icons, and categories).
    - Service Worker (`sw.js`) with stale-while-revalidate offline caching and API network bypass.
    - In-app install banner and header install button.

11. **Web Audio Sound Effects Synthesizer & Voice Announcer**:
    - Built-in Web Audio API sound synthesizer: Order Placed chime, Kitchen Alert double bell, Delivered fanfare, and Star twinkle.
    - Top bar audio toggle (`🔊 Sound: ON / OFF`).
    - Web Speech API kitchen voice announcements in English, Marathi, or Hindi.

12. **Financial Reports & CSV Data Export**:
    - **Super Admin**: Export all platform orders to CSV with complete breakdown of Subtotal, 5% GST, Delivery fees, Discounts, and Payment modes.
    - **Super Admin**: Export vendor payout and commission settlement ledger to CSV.
    - **Vendor Terminal**: Download store sales CSV for local Tally/accounting.

13. **Customer Post-Delivery Rating & Reviews**:
    - Interactive 5-star rating for Food Quality and Delivery Partner on delivered orders.
    - Quick feedback chips (*Super Fast Delivery ⚡*, *Hot & Fresh 🍲*, *Neat Packaging 📦*, *Polite Rider 🚴*).
    - Dynamic restaurant rating recalculation and persistence.

14. **Dine-In Table Reservation System (BhookIt Table Pass)**:
    - Dedicated `[🍽️ Book Table]` button on all partner restaurant profiles.
    - Customizable booking form: Date, Time slot chips (Lunch/Dinner), Guest counter (1-10+), Seating zone (AC Family, Window side, Rooftop, Garden), and occasion notes.
    - Printable VIP Table Confirmation Pass with Booking ID (`TB-XXXXX`).
    - Customer Orders subtab (`[🍽️ Table Reservations]`) and Vendor Terminal seating management.

15. **Customer Loyalty Wallet & 5% Cashback Engine**:
    - Interactive `💳 ₹250` header wallet balance with click-to-open recharge modal.
    - Quick recharge via UPI chips (+₹100, +₹200, +₹500, +₹1,000) and real-time transaction ledger.
    - 1-click cart checkout redemption discount (`[x] Redeem Wallet Cash`).
    - Automatic 5% cashback on every order credited straight to wallet with instant alert.

16. **Pure Veg Filter, Advanced Sorting & Wishlist (❤️)**:
    - 1-tap `[🌱 Pure Veg Only]` toggle button in the customer search strip.
    - Sorting by Featured, Rating (4.8+), Prep Speed, and Price (Low/High).
    - Dish favorites heart (`🤍` / `❤️`) with dedicated `❤️ Favorites` category pill.

---

## 🛠️ Running the Platform

Run the built-in Node.js server:

```bash
node server.js
```

Open `http://localhost:8080/` in your browser.

---

## 🔑 Demo Accounts & Credentials

Use the top Quick Role Switcher bar or these credentials:
- **Customer**: `rakesh.user@demo.com`
- **Restaurant Vendors**:
  - *Sakoli Food Corner* (`sakoli@bhookit.com`)
  - *Aapla Bhojanalay* (`aapla@bhookit.com`)
  - *Royal Biryani & Rolls* (`biryani@bhookit.com`)
  - *Sweet Treats & Shakes* (`sweets@bhookit.com`)
- **Delivery Partner**: `Vikram Rider`
- **Coupons**: `BHOOKIT20` (20% OFF), `JB10` (10% OFF), `WELCOME50` (Flat ₹50 OFF)
