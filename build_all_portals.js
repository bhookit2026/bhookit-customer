// build_all_portals.js
// Generates standalone portals: customer.html, vendor.html, rider.html, admin.html, partner.html
const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const allModals = fs.readFileSync('_extracted_modals.html', 'utf8');

// Section markers
const restStart = indexHtml.indexOf('<!-- 5. RESTAURANT PARTNER VENDOR PORTAL -->');
const riderStart = indexHtml.indexOf('<!-- 6. DELIVERY RIDER PARTNER PORTAL -->');
const adminStart = indexHtml.indexOf('<section id="admin"');
const partnerRegStart = indexHtml.indexOf('<section id="partnerRegistration"');
const modalsStart = indexHtml.indexOf('<!-- MODAL:');

let restaurantSection = indexHtml.substring(restStart, riderStart).trim();
let riderSection = indexHtml.substring(riderStart, adminStart).trim();
let adminSection = indexHtml.substring(adminStart, partnerRegStart).trim();
let partnerRegSection = indexHtml.substring(partnerRegStart, modalsStart).trim();

// Unhide the main panels for each standalone page
restaurantSection = restaurantSection.replace('id="restaurant" class="panel hidden"', 'id="restaurant" class="panel"');
riderSection = riderSection.replace('id="delivery" class="panel hidden"', 'id="delivery" class="panel"');
adminSection = adminSection.replace('id="admin" class="panel hidden"', 'id="admin" class="panel"');

const headCommon = (title, desc) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#ff4722">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="manifest" href="manifest.json">
  <link rel="icon" type="image/png" href="favicon.png">
  <link rel="apple-touch-icon" href="icon-192.png">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="stylesheet" href="style.css">
  <style>
    /* Standalone Portal Specialized Accents */
    .portal-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .badge-vendor { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .badge-rider { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .badge-admin { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-hub { background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }
    .portal-quick-link {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .portal-quick-link:hover {
      background: var(--bg-surface-alt, #f1f5f9);
      color: var(--primary);
    }
  </style>
</head>`;

const scriptsCommon = (activeInitRole) => `
  <!-- Firebase SDKs -->
  <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js"></script>
  <script src="firebase-config.js"></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="app.js"></script>
  <script src="translations.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Ensure the standalone portal is active
      if (typeof show === 'function') {
        show('${activeInitRole}');
      }
      if ('${activeInitRole}' === 'restaurant' && typeof quickRole === 'function') {
        quickRole('restaurant', 1);
      } else if ('${activeInitRole}' === 'delivery' && typeof quickRole === 'function') {
        quickRole('delivery');
      } else if ('${activeInitRole}' === 'admin' && typeof quickRole === 'function') {
        quickRole('admin');
      }
    });
  </script>
</body>
</html>`;

// ============================================================
// 1. VENDOR PORTAL (vendor.html / partner.bhookit.com/vendor)
// ============================================================
const vendorHtml = `${headCommon('BhookIt Partner — Restaurant Vendor Portal & Kitchen POS', 'Manage orders, digital menu, kitchen KDS, POS billing and daily settlements for your restaurant on BhookIt.')}
<body>
  <!-- Header: Restaurant Partner Dedicated Header -->
  <header>
    <div class="logo-area" onclick="location.href='/vendor'" style="cursor: pointer;" title="BhookIt Restaurant Partner">
      <img src="bhookit-logo.png" alt="BhookIt Partner" class="brand-logo-img">
      <span class="portal-badge badge-vendor">🏪 Vendor Portal</span>
    </div>

    <!-- Restaurant Switcher / Active Outlet Selector -->
    <div style="display: flex; align-items: center; gap: 8px; background: var(--bg-surface-alt, #f8fafc); padding: 4px 12px; border-radius: 8px; border: 1px solid var(--border-color, #e2e8f0);">
      <span style="font-size: 13px; font-weight: 600;">Outlet:</span>
      <select id="vendorOutletSelector" onchange="quickRole('restaurant', parseInt(this.value))" style="border: none; background: transparent; font-weight: 700; color: var(--text-color); cursor: pointer; outline: none; font-size: 13px;">
        <option value="1">Sakoli Corner (Main Market)</option>
        <option value="2">Aapla Bhojanalay (Highway Express)</option>
      </select>
    </div>

    <!-- Center Navigation Actions for Vendor -->
    <nav class="nav-center">
      <button class="nav-item-btn active" onclick="show('restaurant')">📋 Kitchen Orders</button>
      <button class="nav-item-btn" onclick="openKdsModal()" style="background: rgba(234, 88, 12, 0.1); color: #ea580c; border: 1px solid rgba(234, 88, 12, 0.2);">👨‍🍳 Live KDS</button>
      <button class="nav-item-btn" onclick="openPosModal()" style="background: rgba(79, 70, 229, 0.1); color: #4f46e5; border: 1px solid rgba(79, 70, 229, 0.2);">📠 Quick POS</button>
      <button class="nav-item-btn" onclick="openAddDishModal()">➕ Add Dish</button>
    </nav>

    <div class="nav-right">
      <!-- Audio Chime Toggle -->
      <button id="audioToggleBtn" class="role-pill" onclick="toggleSystemAudio()" style="margin: 0;">🔊 Sound: ON</button>
      
      <!-- Theme & Lang -->
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
        <button class="notification-btn" onclick="toggleNotificationDrawer()" title="Order Alerts">
          <span>🔔</span>
          <span class="notif-badge" id="notifBadge">0</span>
        </button>
        <div id="notificationDrawer" class="notification-drawer hidden">
          <div class="notif-header">
            <span style="font-weight: 700; font-size: 13px;">🔔 Store Notifications</span>
            <button class="btn-secondary" onclick="markAllNotificationsRead()" style="padding: 2px 8px; font-size: 11px;">Clear</button>
          </div>
          <div id="notificationList" class="notif-list"></div>
        </div>
      </div>

      <!-- User Profile -->
      <div class="user-profile-badge" id="userProfileArea">
        <span>🏪</span>
        <span id="userLabel">Restaurant Manager</span>
      </div>
      <button class="btn-secondary" onclick="location.href='/partner'" style="padding: 5px 10px; font-size: 12px;" title="Switch to Partner Hub">Hub ➔</button>
    </div>
  </header>

  <main class="container">
    ${restaurantSection}
  </main>

  ${allModals}

  ${scriptsCommon('restaurant')}
`;

fs.writeFileSync('vendor.html', vendorHtml, 'utf8');
console.log('vendor.html generated!');

// ============================================================
// 2. RIDER PORTAL (rider.html / partner.bhookit.com/rider)
// ============================================================
const riderHtml = `${headCommon('BhookIt Delivery — Rider & Courier Dispatch Partner Portal', 'Delivery partner app for live order pickup, GPS route navigation, proof of delivery and instant daily earnings.')}
<body>
  <!-- Header: Delivery Partner Dedicated Header -->
  <header>
    <div class="logo-area" onclick="location.href='/rider'" style="cursor: pointer;" title="BhookIt Delivery Hero">
      <img src="bhookit-logo.png" alt="BhookIt Rider" class="brand-logo-img">
      <span class="portal-badge badge-rider">🛵 Delivery Hero</span>
    </div>

    <!-- Duty Status Switcher -->
    <div style="display: flex; align-items: center; gap: 10px; background: var(--bg-surface-alt, #f8fafc); padding: 5px 14px; border-radius: 999px; border: 1px solid var(--border-color, #e2e8f0);">
      <span style="font-size: 13px; font-weight: 700; color: #059669;">● Duty Active</span>
      <button class="btn-secondary" onclick="toggleRiderDuty()" style="padding: 2px 8px; font-size: 11px; margin: 0;">Toggle Duty</button>
    </div>

    <nav class="nav-center">
      <button class="nav-item-btn active" onclick="show('delivery')">🛵 Active Orders</button>
      <button class="nav-item-btn" onclick="openPodModal('FB-MOCK')">📸 POD Verification</button>
      <button class="nav-item-btn" onclick="openRiderSosModal()" style="background: rgba(220, 38, 38, 0.1); color: #dc2626; border: 1px solid rgba(220, 38, 38, 0.2);">🚨 SOS Help</button>
    </nav>

    <div class="nav-right">
      <!-- Sound & Theme -->
      <button id="audioToggleBtn" class="role-pill" onclick="toggleSystemAudio()" style="margin: 0;">🔊 Sound: ON</button>
      <button id="themeToggleBtnNav" class="theme-toggle-btn" onclick="toggleTheme()" title="Switch Theme">
        <span>🌙</span>
        <span>Dark</span>
      </button>
      <select id="langSelect" class="lang-selector" onchange="setLanguage(this.value)">
        <option value="en">🇬🇧 English</option>
        <option value="mr">🇮🇳 मराठी</option>
        <option value="hi">🇮🇳 हिन्दी</option>
      </select>

      <!-- Rider Profile -->
      <div class="user-profile-badge" id="userProfileArea">
        <span>🛵</span>
        <span id="userLabel">Rider: Rajesh Patil (ID #R-402)</span>
      </div>
      <button class="btn-secondary" onclick="location.href='/partner'" style="padding: 5px 10px; font-size: 12px;" title="Switch to Partner Hub">Hub ➔</button>
    </div>
  </header>

  <main class="container">
    ${riderSection}
  </main>

  ${allModals}

  ${scriptsCommon('delivery')}
`;

fs.writeFileSync('rider.html', riderHtml, 'utf8');
console.log('rider.html generated!');

// ============================================================
// 3. ADMIN PORTAL (admin.html / partner.bhookit.com/admin)
// ============================================================
const adminHtml = `${headCommon('BhookIt Master Admin — Platform Operations & System Dashboard', 'Master control dashboard for BhookIt platform: restaurant onboarding, rider telemetry, zone configuration, commission and analytics.')}
<body>
  <!-- Header: Master Super Admin Dedicated Header -->
  <header>
    <div class="logo-area" onclick="location.href='/admin'" style="cursor: pointer;" title="BhookIt Master Admin">
      <img src="bhookit-logo.png" alt="BhookIt Admin" class="brand-logo-img">
      <span class="portal-badge badge-admin">🛡️ Master Admin</span>
    </div>

    <!-- Admin Status Banner -->
    <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: #059669; background: #ecfdf5; padding: 4px 12px; border-radius: 999px; border: 1px solid #a7f3d0;">
      <span style="display: inline-block; width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></span>
      <span>Live System: All 5 Delivery Zones Online</span>
    </div>

    <nav class="nav-center">
      <button class="nav-item-btn active" onclick="show('admin')">📊 Platform Metrics</button>
      <button class="nav-item-btn" onclick="openOnboardModal()">➕ Onboard Restaurant</button>
      <button class="nav-item-btn" onclick="openAddCouponModal()">🏷️ Add Coupon</button>
      <button class="nav-item-btn" onclick="openAdminZoneModal()">📍 Delivery Zones</button>
    </nav>

    <div class="nav-right">
      <button id="themeToggleBtnNav" class="theme-toggle-btn" onclick="toggleTheme()" title="Switch Theme">
        <span>🌙</span>
        <span>Dark</span>
      </button>
      <select id="langSelect" class="lang-selector" onchange="setLanguage(this.value)">
        <option value="en">🇬🇧 English</option>
        <option value="mr">🇮🇳 मराठी</option>
        <option value="hi">🇮🇳 हिन्दी</option>
      </select>

      <div class="user-profile-badge" id="userProfileArea">
        <span>🛡️</span>
        <span id="userLabel">Super Admin</span>
      </div>
      <button class="btn-secondary" onclick="location.href='/partner'" style="padding: 5px 10px; font-size: 12px;" title="Switch to Partner Hub">Hub ➔</button>
    </div>
  </header>

  <main class="container">
    ${adminSection}
  </main>

  ${allModals}

  ${scriptsCommon('admin')}
`;

fs.writeFileSync('admin.html', adminHtml, 'utf8');
console.log('admin.html generated!');

// ============================================================
// 4. PARTNER HUB (partner.html / partner.bhookit.com)
// ============================================================
const partnerHtml = `${headCommon('BhookIt Partner Hub — Restaurant & Delivery Fleet Ecosystem', 'Join BhookIt partner network. Dedicated portals for restaurants, delivery riders, and operations management in Maharashtra.')}
<body>
  <!-- Partner Hub Header -->
  <header>
    <div class="logo-area" onclick="location.href='/partner'" style="cursor: pointer;" title="BhookIt Partner Gateway">
      <img src="bhookit-logo.png" alt="BhookIt Partner" class="brand-logo-img">
      <span class="portal-badge badge-hub">🤝 Partner Hub</span>
    </div>

    <nav class="nav-center">
      <a href="/vendor" class="portal-quick-link">🏪 Restaurant Vendor</a>
      <a href="/rider" class="portal-quick-link">🛵 Delivery Hero</a>
      <a href="/admin" class="portal-quick-link">🛡️ Master Admin</a>
    </nav>

    <div class="nav-right">
      <button id="themeToggleBtnNav" class="theme-toggle-btn" onclick="toggleTheme()" title="Switch Theme">
        <span>🌙</span>
        <span>Dark</span>
      </button>
      <select id="langSelect" class="lang-selector" onchange="setLanguage(this.value)">
        <option value="en">🇬🇧 English</option>
        <option value="mr">🇮🇳 मराठी</option>
        <option value="hi">🇮🇳 हिन्दी</option>
      </select>
      <button class="btn-primary" onclick="location.href='/'" style="padding: 6px 14px; font-size: 12px;">🍔 Customer App ➔</button>
    </div>
  </header>

  <main class="container" style="max-width: 1100px; margin: 30px auto; padding: 0 16px;">
    <!-- Hero Banner -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #fff; border-radius: 20px; padding: 40px 32px; margin-bottom: 36px; box-shadow: var(--shadow-lg); text-align: center;">
      <span class="portal-badge badge-vendor" style="margin-bottom: 12px;">🚀 BhookIt Partner Ecosystem</span>
      <h1 style="font-size: 32px; font-weight: 800; margin: 12px 0; letter-spacing: -0.5px;">Grow Your Food Business with BhookIt</h1>
      <p style="font-size: 15px; opacity: 0.85; max-width: 680px; margin: 0 auto 24px;">Dedicated tools, kitchen management POS, automated rider dispatch, and transparent settlements for local restaurants and courier partners.</p>
      <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
        <button class="btn-primary" onclick="show('partnerRegistration')" style="font-size: 14px; padding: 10px 22px;">📝 Register Your Restaurant</button>
        <button class="btn-secondary" onclick="location.href='/vendor'" style="font-size: 14px; padding: 10px 22px; color: #fff; border-color: rgba(255,255,255,0.3);">🏪 Access Vendor Portal</button>
        <button class="btn-secondary" onclick="location.href='/rider'" style="font-size: 14px; padding: 10px 22px; color: #fff; border-color: rgba(255,255,255,0.3);">🛵 Access Rider Portal</button>
      </div>
    </div>

    <!-- 3 Role Portals Grid -->
    <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 20px; text-align: center;">Select Your Portal to Continue</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 40px;">
      
      <!-- Card 1: Restaurant Vendor -->
      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
        <div>
          <div style="font-size: 36px; margin-bottom: 12px;">🏪</div>
          <span class="portal-badge badge-vendor">For Food Outlets</span>
          <h3 style="font-size: 20px; font-weight: 700; margin: 10px 0 8px;">Restaurant Partner Portal</h3>
          <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">
            Manage your daily incoming customer orders, digital menu items, live kitchen display (KDS), GST-compliant POS billing, and daily sales settlements.
          </p>
          <ul style="font-size: 12px; color: var(--text-muted); line-height: 1.8; margin-bottom: 20px; padding-left: 18px;">
            <li>✓ Live order chime sound & notifications</li>
            <li>✓ Built-in POS for dine-in & takeaway</li>
            <li>✓ Instant out-of-stock item toggling</li>
            <li>✓ Next-day direct bank payouts</li>
          </ul>
        </div>
        <div>
          <a href="/vendor" class="btn-primary" style="display: block; text-align: center; text-decoration: none; padding: 10px; font-size: 13px;">Open Vendor Portal ➔</a>
          <button class="btn-secondary" onclick="show('partnerRegistration')" style="width: 100%; margin-top: 8px; padding: 8px; font-size: 12px;">New Partner Sign Up</button>
        </div>
      </div>

      <!-- Card 2: Delivery Rider -->
      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
        <div>
          <div style="font-size: 36px; margin-bottom: 12px;">🛵</div>
          <span class="portal-badge badge-rider">For Delivery Fleet</span>
          <h3 style="font-size: 20px; font-weight: 700; margin: 10px 0 8px;">Delivery Hero Portal</h3>
          <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">
            Turn your bike into earnings. Receive delivery tasks, navigate to restaurant and customer locations with simulated GPS, and collect cash on delivery.
          </p>
          <ul style="font-size: 12px; color: var(--text-muted); line-height: 1.8; margin-bottom: 20px; padding-left: 18px;">
            <li>✓ Flexible duty hours (Online / Offline switch)</li>
            <li>✓ ₹50 - ₹80 per delivery trip + tips</li>
            <li>✓ Proof of delivery (POD) & OTP protection</li>
            <li>✓ Weekly automated rider payouts</li>
          </ul>
        </div>
        <div>
          <a href="/rider" class="btn-primary" style="display: block; text-align: center; text-decoration: none; padding: 10px; font-size: 13px; background: #2563eb; border-color: #2563eb;">Open Rider Portal ➔</a>
        </div>
      </div>

      <!-- Card 3: Master Admin -->
      <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-sm); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
        <div>
          <div style="font-size: 36px; margin-bottom: 12px;">🛡️</div>
          <span class="portal-badge badge-admin">Operations & Super Admin</span>
          <h3 style="font-size: 20px; font-weight: 700; margin: 10px 0 8px;">Master Admin Dashboard</h3>
          <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">
            Real-time platform command center. Onboard restaurants, inspect rider telemetry, set weather/surge pricing, manage delivery zones, and resolve customer disputes.
          </p>
          <ul style="font-size: 12px; color: var(--text-muted); line-height: 1.8; margin-bottom: 20px; padding-left: 18px;">
            <li>✓ Platform GMV & commission telemetry</li>
            <li>✓ Delivery zone & surge pricing control</li>
            <li>✓ Restaurant KYC & menu approvals</li>
            <li>✓ AI dispute refund resolution system</li>
          </ul>
        </div>
        <div>
          <a href="/admin" class="btn-primary" style="display: block; text-align: center; text-decoration: none; padding: 10px; font-size: 13px; background: #dc2626; border-color: #dc2626;">Access Admin Center ➔</a>
        </div>
      </div>

    </div>

    <!-- Partner Registration Section (Embedded) -->
    ${partnerRegSection}

  </main>

  ${allModals}

  <!-- Scripts -->
  <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js"></script>
  <script src="firebase-config.js"></script>
  <script src="app.js"></script>
  <script src="translations.js"></script>
</body>
</html>`;

fs.writeFileSync('partner.html', partnerHtml, 'utf8');
console.log('partner.html generated!');
