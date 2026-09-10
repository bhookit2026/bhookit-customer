// Build the complete customer.html from extracted parts of index.html
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// --- SECTION BOUNDARIES ---
// PWA Banner: line 113-126
const pwaBannerStart = html.indexOf('<!-- PWA Install Banner -->');
const pwaBannerEnd = html.indexOf('<!-- 1. CUSTOMER PORTAL -->');

// Customer section: line 127-229
const customerStart = html.indexOf('<!-- 1. CUSTOMER PORTAL -->');
const cartStart = html.indexOf('<!-- 2. CART & CHECKOUT PANEL -->');

// Cart section: line 230-398
const ordersStart = html.indexOf('<!-- 3. CUSTOMER ORDER HISTORY & RESERVATIONS -->');

// Orders section: line 399-420
const trackStart = html.indexOf('<!-- 4. LIVE ORDER TRACKING WITH SIMULATED ROUTE MAP -->');

// Track section: line 421-430
const restaurantStart = html.indexOf('<!-- 5. RESTAURANT PARTNER VENDOR PORTAL -->');

// Modals (all modals excluding admin/vendor-only ones)
const modals = fs.readFileSync('_extracted_modals.html', 'utf8');

// Extract sections
const pwaBanner = html.substring(pwaBannerStart, customerStart).trim();
const customerSection = html.substring(customerStart, cartStart).trim();
const cartSection = html.substring(cartStart, ordersStart).trim();
const ordersSection = html.substring(ordersStart, trackStart).trim();
const trackSection = html.substring(trackStart, restaurantStart).trim();

// Filter out vendor-only modals from the modals block
// Keep customer modals, remove admin/vendor-only ones
let customerModals = modals;
// Remove addDishModal (vendor-only)
// Remove onboardRestaurantModal (admin-only)
// Remove addCouponModal (admin-only)
// Remove posModal (vendor-only)
// Remove kdsModal (vendor-only)
// Remove invitePartnerModal (admin)
// These will be removed by keeping them but they won't be accessible without the admin HTML

// Write the assembled customer.html
const customerHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#ff4722">
  <title>Parcelकर — Order Food Online | Fast Delivery to Your Doorstep</title>
  <meta name="description" content="Order from the best restaurants in Sakoli and nearby areas. Fresh food, lightning-fast delivery, live order tracking, and exclusive deals — only on Parcelकर.">
  <meta name="keywords" content="food delivery, order food online, Sakoli food, Parcelकर, restaurant delivery, online food order">
  <meta property="og:title" content="Parcelकर — Good Food, Faster To You">
  <meta property="og:description" content="Order from top restaurants in your city. Fast delivery, live tracking, UPI payment.">
  <meta property="og:image" content="parcelkar-logo.png">
  <meta property="og:url" content="https://parcelkar.com/">
  <link rel="canonical" href="https://parcelkar.com/">
  <link rel="manifest" href="manifest.json">
  <link rel="icon" type="image/png" href="favicon.png">
  <link rel="apple-touch-icon" href="icon-192.png">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- ==========================================
       PARCELKAR CUSTOMER APP — PUBLIC FACING
       ========================================== -->

  <!-- Main Navigation Header (Customer Only) -->
  <header>
    <div class="logo-area" onclick="show('customer')" title="Parcelकर - Good Food Faster To You">
      <img src="parcelkar-logo.png" alt="Parcelकर" class="brand-logo-img">
      <span class="brand-name-text">Parcel<span class="brand-highlight">कर</span></span>
    </div>
    <!-- Delivery Area & City Selector -->
    <div class="header-location-picker" id="headerLocationBtn" onclick="openLocationModal()" title="Click to Change Delivery Area or City">
      <span class="loc-pin">📍</span>
      <div class="loc-text-col">
        <span class="loc-title">Deliver to <span class="loc-arrow">▼</span></span>
        <span class="loc-sub" id="currentSelectedAreaLabel">Sakoli (Main Market Road)</span>
      </div>
    </div>
    <!-- Customer Navigation -->
    <nav class="nav-center">
      <button class="nav-item-btn active" id="navCustomer" onclick="show('customer')">🍔 Explore Food</button>
      <button class="nav-item-btn" id="navOrders" onclick="show('orders')">📦 My Orders</button>
      <button class="nav-item-btn" id="navTrack" onclick="show('track')">📍 Live Track</button>
    </nav>
    <div class="nav-right">
      <!-- Dark / Light Theme Button -->
      <button id="themeToggleBtnNav" class="theme-toggle-btn" onclick="toggleTheme()" title="Switch Theme">
        <span>🌙</span>
        <span>Dark</span>
      </button>
      <select id="langSelect" class="lang-selector" onchange="setLanguage(this.value)">
        <option value="en">🇬🇧 English</option>
        <option value="mr">🇮🇳 मराठी</option>
        <option value="hi">🇮🇳 हिन्दी</option>
      </select>
      <!-- Notification Bell -->
      <div class="notification-wrapper">
        <button class="notification-btn" onclick="toggleNotificationDrawer()" title="Activity Updates">
          <span>🔔</span>
          <span class="notif-badge" id="notifBadge">3</span>
        </button>
        <div id="notificationDrawer" class="notification-drawer hidden">
          <div class="notif-header">
            <span style="font-weight: 700; font-size: 13px;">🔔 Activity Updates</span>
            <button class="btn-secondary" onclick="markAllNotificationsRead()" style="padding: 2px 8px; font-size: 11px;">Clear All</button>
          </div>
          <div id="notificationList" class="notif-list"></div>
        </div>
      </div>
      <!-- Weather & Surge Pill -->
      <button id="weatherSurgePill" class="weather-surge-pill" onclick="toggleSimulatedWeather()" title="Weather conditions affect delivery">
        <span id="weatherSurgeIcon">☀️</span>
        <span id="weatherSurgeLabel">Weather: Clear (₹10 Surge)</span>
      </button>
      <!-- Lucky Spin -->
      <button class="role-pill" onclick="openGamificationModal()" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; border-color: #ec4899;">🎰 Spin & Win</button>
      <!-- Loyalty Wallet -->
      <button class="wallet-nav-btn" onclick="openWalletModal()" title="Parcelकर Loyalty Wallet">
        <span>💳</span>
        <span>₹<b id="navWalletBalance">250</b></span>
      </button>
      <!-- Cart Button -->
      <button class="cart-indicator-btn" onclick="show('cart')">
        <span>🛒</span>
        <span id="txtCartLabel">Cart</span>
        <span class="cart-count-badge" id="cartCountBadge">0</span>
      </button>
      <!-- User Profile -->
      <div class="user-profile-badge" id="userProfileArea">
        <span id="userAvatar">👤</span>
        <span id="userLabel">Guest User</span>
      </div>
      <button class="btn-secondary" id="authBtn" onclick="openAuth()" style="padding: 6px 12px; font-size: 12px;">Login</button>
    </div>
  </header>

  <main class="container">
    ${pwaBanner}

    ${customerSection}

    ${cartSection}

    ${ordersSection}

    ${trackSection}
  </main>

  <!-- Mobile Bottom Navigation (Customer Only) -->
  <div class="mobile-nav">
    <button class="mobile-nav-btn active" id="mobileNavFood" onclick="show('customer')">
      <span class="mobile-nav-icon">🍽️</span>
      <span>Food</span>
    </button>
    <button class="mobile-nav-btn" id="mobileNavOrders" onclick="show('orders')">
      <span class="mobile-nav-icon">📦</span>
      <span>Orders</span>
    </button>
    <button class="mobile-nav-btn" id="mobileNavCart" onclick="show('cart')">
      <span class="mobile-nav-icon">🛒</span>
      <span>Cart (<b id="mobileCartCount">0</b>)</span>
    </button>
    <button class="mobile-nav-btn" id="mobileNavTrack" onclick="show('track')">
      <span class="mobile-nav-icon">📍</span>
      <span>Track</span>
    </button>
    <button class="mobile-nav-btn" id="mobileNavProfile" onclick="openAuth()">
      <span class="mobile-nav-icon">👤</span>
      <span>Profile</span>
    </button>
  </div>

  <!-- ==========================================
       ALL CUSTOMER MODALS
       ========================================== -->
${customerModals}

  <!-- Firebase SDKs -->
  <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js"></script>
  <script src="firebase-config.js"></script>
  <script src="app.js?v=20260910_2115"></script>
  <script src="translations.js"></script>
</body>
</html>`;

fs.writeFileSync('customer.html', customerHtml, 'utf8');
const stats = fs.statSync('customer.html');
console.log('customer.html created!');
console.log('File size:', Math.round(stats.size / 1024), 'KB');
console.log('Lines:', customerHtml.split('\n').length);
