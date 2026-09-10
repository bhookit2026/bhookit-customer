// build_all_portals.js
// Generates standalone portals: customer.html, vendor.html, rider.html, admin.html, partner.html
// with complete Authentication Gates and Credential Management Center
const fs = require('fs');

const sourceHtml = fs.readFileSync('demo_all_in_one.html', 'utf8');
const allModals = fs.readFileSync('_extracted_modals.html', 'utf8');

// Section markers from demo_all_in_one.html
const restStart = sourceHtml.indexOf('<!-- 5. RESTAURANT PARTNER VENDOR PORTAL -->');
const riderStart = sourceHtml.indexOf('<!-- 6. DELIVERY RIDER PARTNER PORTAL -->');
const adminStart = sourceHtml.indexOf('<!-- 7. SUPER ADMIN EXECUTIVE COMMAND CENTER -->');
const partnerRegStart = sourceHtml.indexOf('<!-- PARTNER REGISTRATION PANEL -->');
const endOfMain = sourceHtml.indexOf('</main>', partnerRegStart);

let restaurantSection = sourceHtml.substring(restStart, riderStart).trim();
let riderSection = sourceHtml.substring(riderStart, adminStart).trim();
let adminSection = sourceHtml.substring(adminStart, partnerRegStart).trim();
let partnerRegSection = sourceHtml.substring(partnerRegStart, endOfMain).trim();

// Unhide the main panels for each standalone page
restaurantSection = restaurantSection.replace('id="restaurant" class="panel hidden"', 'id="restaurant" class="panel"');
riderSection = riderSection.replace('id="delivery" class="panel hidden"', 'id="delivery" class="panel"');
adminSection = adminSection.replace('id="admin" class="panel hidden"', 'id="admin" class="panel"');
partnerRegSection = partnerRegSection.replace('id="partnerRegistration" class="panel hidden"', 'id="partnerRegistration" class="panel"');

// Inject "Allocate Credentials" button into Admin's Restaurant Management header
adminSection = adminSection.replace(
  '<button class="btn-secondary" onclick="openInvitePartnerModal()" style="padding: 4px 12px; font-size: 11px;">+ Invite Partner</button>',
  '<button class="btn-primary" onclick="openCreateVendorCredsModal()" style="padding: 4px 12px; font-size: 11px; font-weight:700;">➕ Allocate Credentials</button>\n            <button class="btn-secondary" onclick="openInvitePartnerModal()" style="padding: 4px 12px; font-size: 11px;">+ Invite Partner</button>'
);

// Inject Rider Fleet Credential Center right below Restaurant Management in Admin
const riderFleetAdminCard = `
        <!-- Delivery Fleet & Rider Credential Management -->
        <div class="dashboard-card" style="border-left: 4px solid #3b82f6;">
          <div class="dashboard-card-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 20px;">🛵</span>
              <span>Delivery Fleet &amp; Rider Credentials Center</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-primary" onclick="openCreateRiderCredsModal()" style="padding: 4px 12px; font-size: 11px; font-weight: 700;">➕ Add Rider Credentials</button>
            </div>
          </div>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
            Allocate, edit, suspend, and delete login credentials for delivery partners on <a href="https://rider.parcelkar.com" target="_blank" style="color:var(--primary); font-weight:700;">rider.parcelkar.com</a>.
          </p>
          <div id="adminRidersTable">
            <!-- Injected dynamically -->
          </div>
        </div>
`;

if (!adminSection.includes('id="adminRidersTable"')) {
  adminSection = adminSection.replace(
    '<!-- Delivery Cities & Geofenced Service Zones Management (Admin Controlled) -->',
    riderFleetAdminCard + '\n        <!-- Delivery Cities & Geofenced Service Zones Management (Admin Controlled) -->'
  );
}

// Inject Platform Managers Card right below Rider Fleet Card in Admin
const managersAdminCard = `
        <!-- Platform Managers & Role-Based Access Control (RBAC) -->
        <div class="dashboard-card" style="border-left: 4px solid #8b5cf6;">
          <div class="dashboard-card-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 20px;">👥</span>
              <span>Platform Managers &amp; Role-Based Access Control (RBAC)</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-primary" onclick="openCreateManagerModal()" style="padding: 4px 12px; font-size: 11px; font-weight: 700; background: #8b5cf6; border-color: #7c3aed;">➕ Add New Manager</button>
            </div>
          </div>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
            Super Admin Power: Allocate manager accounts and assign specific roles (Operations, Fleet Dispatch, Customer Support, Finance).
          </p>
          <div id="adminManagersTable">
            <!-- Injected dynamically -->
          </div>
        </div>
`;

if (!adminSection.includes('id="adminManagersTable"')) {
  adminSection = adminSection.replace(
    '<!-- Delivery Cities & Geofenced Service Zones Management (Admin Controlled) -->',
    managersAdminCard + '\n        <!-- Delivery Cities & Geofenced Service Zones Management (Admin Controlled) -->'
  );
}

// Inject Change Master Password button in Admin Header area
adminSection = adminSection.replace(
  '<button class="btn-secondary" onclick="exportPlatformAuditLog()" style="padding: 8px 14px; color: #fff; border-color: rgba(255,255,255,0.3);">📋 System Audit</button>',
  '<button class="btn-secondary" onclick="openChangeAdminPassModal()" style="padding: 8px 14px; color: #fff; border-color: rgba(255,255,255,0.3);">🔐 Change Master Password</button>\n            <button class="btn-secondary" onclick="exportPlatformAuditLog()" style="padding: 8px 14px; color: #fff; border-color: rgba(255,255,255,0.3);">📋 System Audit</button>'
);

const BUILD_VER = Date.now();

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
  <link rel="stylesheet" href="style.css?v=${BUILD_VER}">
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
  </style>
</head>`;

const scriptsCommon = (activeInitRole) => `
  <!-- Toast Notification Area -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- Firebase SDKs -->
  <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js"></script>
  <script src="firebase-config.js"></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="app.js?v=${BUILD_VER}"></script>
  <script src="translations.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize Auth Gate per portal
      if ('${activeInitRole}' === 'admin') {
        if (typeof checkAdminAuth === 'function') {
          const ok = checkAdminAuth();
          if (ok && typeof renderAdminView === 'function') renderAdminView();
        }
      } else if ('${activeInitRole}' === 'restaurant') {
        if (typeof checkVendorAuth === 'function') {
          const ok = checkVendorAuth();
          if (ok && typeof initVendorApp === 'function') initVendorApp();
        }
      } else if ('${activeInitRole}' === 'delivery') {
        if (typeof checkRiderAuth === 'function') {
          const ok = checkRiderAuth();
          if (ok && typeof renderRiderApp === 'function') renderRiderApp();
        }
      } else {
        if (typeof show === 'function') show('${activeInitRole}');
      }
    });
  </script>
</body>
</html>`;

// ============================================================
// CREDENTIAL MODALS FOR ADMIN
// ============================================================
const adminModalsHtml = `
  <!-- MODAL: Allocate / Edit Restaurant Vendor Credentials -->
  <div id="createVendorCredsModal" class="modal-overlay hidden">
    <div class="modal-content" style="max-width: 520px;">
      <button class="modal-close-btn" onclick="closeModal('createVendorCredsModal')">✕</button>
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
        <span style="font-size: 26px;">🔑</span>
        <div>
          <h3 class="modal-title" style="margin: 0; font-size: 18px; font-weight: 900;">Allocate / Edit Vendor Credentials</h3>
          <span style="font-size: 12px; color: var(--text-muted);">Set up restaurant credentials for vendor.parcelkar.com access</span>
        </div>
      </div>

      <form onsubmit="saveVendorCredentials(event)">
        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">Select Outlet Target</label>
          <select id="vcredRestSelect" class="input-field" onchange="onVcredSelectChange(this.value)" style="font-weight: 700;">
            <!-- Populated dynamically -->
          </select>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">Restaurant Name</label>
            <input type="text" id="vcredRestName" class="input-field" placeholder="e.g. Sakoli Food Corner" required>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">Owner / Manager Name</label>
            <input type="text" id="vcredOwnerName" class="input-field" placeholder="e.g. Ramesh Patil">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">Login ID (or Mobile)</label>
            <input type="text" id="vcredLoginId" class="input-field" placeholder="e.g. sakoli or 9822334455" required>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Terminal PIN</span>
              <a href="javascript:void(0)" onclick="document.getElementById('vcredPin').value = Math.floor(1000 + Math.random()*9000)" style="font-size: 11px; color: var(--primary); font-weight: 700;">🎲 Auto-Generate</a>
            </label>
            <input type="text" id="vcredPin" class="input-field" placeholder="4-digit PIN (e.g. 1234)" required maxlength="8">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">Platform Commission (%)</label>
            <input type="number" id="vcredCommission" class="input-field" min="0" max="50" value="10" required>
          </div>
          <div style="display: flex; align-items: center; padding-top: 18px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; font-weight: 700;">
              <input type="checkbox" id="vcredApproved" checked style="width: 18px; height: 18px;">
              <span>Account Active &amp; Approved</span>
            </label>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="btn-secondary" onclick="closeModal('createVendorCredsModal')">Cancel</button>
          <button type="submit" class="btn-primary" style="font-weight: 800;">💾 Save &amp; Allocate Credentials</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: Allocate / Edit Delivery Rider Credentials -->
  <div id="createRiderCredsModal" class="modal-overlay hidden">
    <div class="modal-content" style="max-width: 500px;">
      <button class="modal-close-btn" onclick="closeModal('createRiderCredsModal')">✕</button>
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
        <span style="font-size: 26px;">🛵</span>
        <div>
          <h3 class="modal-title" style="margin: 0; font-size: 18px; font-weight: 900;">Allocate / Edit Rider Credentials</h3>
          <span style="font-size: 12px; color: var(--text-muted);">Configure mobile login for rider.parcelkar.com</span>
        </div>
      </div>

      <form onsubmit="saveRiderCredentials(event)">
        <input type="hidden" id="rcredId">
        <div style="margin-bottom: 12px;">
          <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">Rider Full Name</label>
          <input type="text" id="rcredName" class="input-field" placeholder="e.g. Vikram Patil" required>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">Mobile Number (Login ID)</label>
            <input type="text" id="rcredPhone" class="input-field" placeholder="+91 9988771122" required>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Terminal PIN</span>
              <a href="javascript:void(0)" onclick="document.getElementById('rcredPin').value = Math.floor(1000 + Math.random()*9000)" style="font-size: 11px; color: var(--primary); font-weight: 700;">🎲 Auto-Generate</a>
            </label>
            <input type="text" id="rcredPin" class="input-field" placeholder="4-digit PIN" required maxlength="8">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">Vehicle Type</label>
            <select id="rcredVehicle" class="input-field">
              <option value="🛵 Motorcycle">🛵 Motorcycle</option>
              <option value="⚡ Electric Scooter">⚡ Electric Scooter</option>
              <option value="🚲 Bicycle">🚲 Bicycle</option>
            </select>
          </div>
          <div style="display: flex; align-items: center; padding-top: 18px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; font-weight: 700;">
              <input type="checkbox" id="rcredApproved" checked style="width: 18px; height: 18px;">
              <span>Active &amp; Authorized</span>
            </label>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="btn-secondary" onclick="closeModal('createRiderCredsModal')">Cancel</button>
          <button type="submit" class="btn-primary" style="font-weight: 800;">💾 Save Rider Credentials</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: Change Master Admin Password -->
  <div id="changeAdminPassModal" class="modal-overlay hidden">
    <div class="modal-content" style="max-width: 460px;">
      <button class="modal-close-btn" onclick="closeModal('changeAdminPassModal')">✕</button>
      <div style="text-align: center; margin-bottom: 16px;">
        <span style="font-size: 36px;">🔐</span>
        <h3 class="modal-title" style="margin-top: 6px; font-size: 18px; font-weight: 900;">Change / Reset Master Admin Password</h3>
        <p style="font-size: 12px; color: var(--text-muted); margin: 0;">Update or reset the executive password for parcelkar.com/admin</p>
      </div>

      <div id="changeAdminPassError" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1.5px solid #ef4444; color: #dc2626; font-size: 12px; font-weight: 700; padding: 10px 14px; border-radius: 8px; margin-bottom: 14px;"></div>

      <form onsubmit="submitChangeAdminPass(event)">
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <label style="font-size: 12px; font-weight: 700;">Current Master Password (चालू पासवर्ड)</label>
            <button type="button" onclick="toggleInputVisibility('oldAdminPass')" style="background:none; border:none; color:var(--primary); font-size:12px; font-weight:700; cursor:pointer;">👁️ Show/Hide</button>
          </div>
          <input type="password" id="oldAdminPass" class="input-field" placeholder="Enter current password or leave pre-filled" style="width: 100%;">
        </div>

        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <label style="font-size: 12px; font-weight: 700;">New Master Password (नवीन पासवर्ड)</label>
            <div style="display: flex; gap: 8px;">
              <a href="javascript:void(0)" onclick="document.getElementById('newAdminPass').value = document.getElementById('confirmAdminPass').value = 'admin' + Math.floor(100 + Math.random()*900)" style="font-size: 11px; color: var(--primary); font-weight: 700;">🎲 Auto-Generate</a>
              <button type="button" onclick="toggleInputVisibility('newAdminPass')" style="background:none; border:none; color:var(--primary); font-size:12px; font-weight:700; cursor:pointer;">👁️</button>
            </div>
          </div>
          <input type="password" id="newAdminPass" class="input-field" placeholder="Enter new strong password (min 4 chars)" required minlength="4" style="width: 100%;">
        </div>

        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <label style="font-size: 12px; font-weight: 700;">Confirm New Password (पुन्हा टाका)</label>
            <button type="button" onclick="toggleInputVisibility('confirmAdminPass')" style="background:none; border:none; color:var(--primary); font-size:12px; font-weight:700; cursor:pointer;">👁️ Show/Hide</button>
          </div>
          <input type="password" id="confirmAdminPass" class="input-field" placeholder="Re-enter new password" required minlength="4" style="width: 100%;">
        </div>

        <div style="display: flex; justify-content: flex-end; align-items: center; gap: 8px; margin-bottom: 16px;">
          <button type="button" class="btn-secondary" onclick="closeModal('changeAdminPassModal')">Cancel</button>
          <button type="submit" class="btn-primary" style="font-weight: 800;">💾 Save Password</button>
        </div>
      </form>
    </div>
  </div>
`;

// ============================================================
// 1. VENDOR PORTAL (vendor.html)
// ============================================================
const vendorAuthGateHtml = `
  <!-- VENDOR AUTHENTICATION GATE -->
  <div id="vendorAuthGate" class="portal-auth-gate">
    <div class="portal-auth-card">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="parcelkar-logo.png" alt="Parcelकर" style="height: 48px; margin-bottom: 8px; filter: drop-shadow(0 2px 8px rgba(255,71,34,0.3));">
        <div style="display: inline-block; background: rgba(255,71,34,0.15); border: 1px solid rgba(255,71,34,0.3); color: #ff6b4a; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
          🏪 Restaurant Partner Terminal
        </div>
        <h2 style="font-size: 22px; font-weight: 900; margin: 0 0 6px 0; color: #fff;">Chef &amp; Kitchen Login</h2>
        <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">
          Enter your restaurant Login ID and Terminal PIN allocated by Parcelकर Super Admin.
        </p>
      </div>

      <div id="vendorAuthError" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1.5px solid #ef4444; color: #fca5a5; font-size: 12px; font-weight: 600; padding: 10px 14px; border-radius: 10px; margin-bottom: 16px;"></div>

      <form onsubmit="submitVendorLogin(event)">
        <label style="font-size: 12px; font-weight: 700; color: #cbd5e1; display: block; margin-bottom: 6px;">
          Restaurant Login ID / Mobile
        </label>
        <input type="text" id="vendorAuthLoginInput" placeholder="e.g. sakoli or 9822334455" required autocomplete="username">

        <label style="font-size: 12px; font-weight: 700; color: #cbd5e1; display: block; margin-bottom: 6px;">
          Terminal PIN / Password
        </label>
        <input type="password" id="vendorAuthPinInput" placeholder="4-digit PIN (e.g. 1234)" required autocomplete="current-password">

        <button type="submit" class="btn-primary" style="width: 100%; padding: 12px; font-size: 14px; font-weight: 800; border-radius: 10px; margin-top: 6px; box-shadow: 0 4px 14px rgba(255,71,34,0.35);">
          🔑 Log In to Kitchen Terminal
        </button>
      </form>

      <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.1);">
        <div style="font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
          ⚡ Quick Demo Accounts (One-Click Test):
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div class="demo-login-chip" onclick="demoVendorLogin(1, '1234')">
            <span>🍔</span>
            <span style="flex: 1;">Sakoli Food Corner (PIN: 1234)</span>
            <span style="font-size: 10px; opacity: 0.7;">Click to Login →</span>
          </div>
          <div class="demo-login-chip" onclick="demoVendorLogin(2, '1234')">
            <span>🍛</span>
            <span style="flex: 1;">Aapla Bhojanalay (PIN: 1234)</span>
            <span style="font-size: 10px; opacity: 0.7;">Click to Login →</span>
          </div>
          <div class="demo-login-chip" onclick="demoVendorLogin(3, '1234')">
            <span>🍗</span>
            <span style="flex: 1;">Royal Biryani &amp; Rolls (PIN: 1234)</span>
            <span style="font-size: 10px; opacity: 0.7;">Click to Login →</span>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 18px; font-size: 11px; color: #64748b; line-height: 1.4;">
        🛡️ Credentials allocated &amp; managed by Super Admin.<br>
        Need credentials? Contact Admin at <a href="/admin" target="_blank" style="color: var(--primary); text-decoration: underline;">parcelkar.com/admin</a>
      </div>
    </div>
  </div>
`;

const vendorHtml = `${headCommon('Parcelकर Partner — Restaurant Vendor Portal & Kitchen POS', 'Manage orders, digital menu, kitchen KDS, POS billing and daily settlements for your restaurant on Parcelकर.')}
<body>
  ${vendorAuthGateHtml}

  <div id="vendorDashboardContainer" style="display: none;">
    <!-- Header: Restaurant Partner Dedicated Header -->
    <header>
      <div class="logo-area" onclick="location.href='/vendor'" style="cursor: pointer;" title="Parcelकर Restaurant Partner">
        <img src="parcelkar-logo.png" alt="Parcelकर Partner" class="brand-logo-img">
        <span class="brand-name-text">Parcel<span class="brand-highlight">कर</span></span>
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

        <!-- User Profile -->
        <div class="user-profile-badge" id="userProfileArea">
          <span>🏪</span>
          <span id="userLabel">Restaurant Manager</span>
        </div>
        <button class="btn-danger" onclick="vendorLogout()" style="padding: 5px 10px; font-size: 12px;" title="Log out of Terminal">🚪 Logout</button>
      </div>
    </header>

    <main class="container">
      ${restaurantSection}
    </main>
  </div>

  ${allModals}

  ${scriptsCommon('restaurant')}
`;

fs.writeFileSync('vendor.html', vendorHtml, 'utf8');
console.log('vendor.html generated!');

// ============================================================
// 2. RIDER PORTAL (rider.html)
// ============================================================
const riderAuthGateHtml = `
  <!-- RIDER AUTHENTICATION GATE -->
  <div id="riderAuthGate" class="portal-auth-gate">
    <div class="portal-auth-card">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="parcelkar-logo.png" alt="Parcelकर" style="height: 48px; margin-bottom: 8px; filter: drop-shadow(0 2px 8px rgba(255,71,34,0.3));">
        <div style="display: inline-block; background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
          🛵 Delivery Fleet Partner
        </div>
        <h2 style="font-size: 22px; font-weight: 900; margin: 0 0 6px 0; color: #fff;">Delivery Hero Login</h2>
        <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">
          Enter your registered Rider Mobile Number and Terminal PIN allocated by Super Admin.
        </p>
      </div>

      <div id="riderAuthError" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1.5px solid #ef4444; color: #fca5a5; font-size: 12px; font-weight: 600; padding: 10px 14px; border-radius: 10px; margin-bottom: 16px;"></div>

      <form onsubmit="submitRiderLogin(event)">
        <label style="font-size: 12px; font-weight: 700; color: #cbd5e1; display: block; margin-bottom: 6px;">
          Rider Mobile Number / Login ID
        </label>
        <input type="text" id="riderAuthPhoneInput" placeholder="e.g. 9988771122 or vikram" required autocomplete="username">

        <label style="font-size: 12px; font-weight: 700; color: #cbd5e1; display: block; margin-bottom: 6px;">
          Terminal PIN
        </label>
        <input type="password" id="riderAuthPinInput" placeholder="4-digit PIN (Default: 1234)" required autocomplete="current-password">

        <button type="submit" class="btn-primary" style="width: 100%; padding: 12px; font-size: 14px; font-weight: 800; border-radius: 10px; margin-top: 6px; box-shadow: 0 4px 14px rgba(255,71,34,0.35);">
          🚀 Log In as Delivery Hero
        </button>
      </form>

      <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.1);">
        <div style="font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
          ⚡ Quick Demo Accounts:
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div class="demo-login-chip" onclick="demoRiderLogin('rider_1', '1234')">
            <span>🛵</span>
            <span style="flex: 1;">Vikram Rider (PIN: 1234)</span>
            <span style="font-size: 10px; opacity: 0.7;">Click to Login →</span>
          </div>
          <div class="demo-login-chip" onclick="demoRiderLogin('rider_2', '1234')">
            <span>⚡</span>
            <span style="flex: 1;">Speedy Rahul (PIN: 1234)</span>
            <span style="font-size: 10px; opacity: 0.7;">Click to Login →</span>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 18px; font-size: 11px; color: #64748b; line-height: 1.4;">
        🛡️ Credentials managed by Super Admin.<br>
        Need credentials? Contact Admin at <a href="/admin" target="_blank" style="color: var(--primary); text-decoration: underline;">parcelkar.com/admin</a>
      </div>
    </div>
  </div>
`;

const riderHtml = `${headCommon('Parcelकर Delivery — Rider & Courier Dispatch Partner Portal', 'Delivery partner app for live order pickup, GPS route navigation, proof of delivery and instant daily earnings.')}
<body>
  ${riderAuthGateHtml}

  <div id="riderDashboardContainer" style="display: none;">
    <!-- Header: Delivery Partner Dedicated Header -->
    <header>
      <div class="logo-area" onclick="location.href='/rider'" style="cursor: pointer;" title="Parcelकर Delivery Hero">
        <img src="parcelkar-logo.png" alt="Parcelकर Rider" class="brand-logo-img">
        <span class="brand-name-text">Parcel<span class="brand-highlight">कर</span></span>
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
          <span id="userLabel">Rider: Vikram</span>
        </div>
        <button class="btn-danger" onclick="riderLogout()" style="padding: 5px 10px; font-size: 12px;" title="Log out of Terminal">🚪 Logout</button>
      </div>
    </header>

    <main class="container">
      ${riderSection}
    </main>
  </div>

  ${allModals}

  ${scriptsCommon('delivery')}
`;

fs.writeFileSync('rider.html', riderHtml, 'utf8');
console.log('rider.html generated!');

// ============================================================
// 3. ADMIN PORTAL (admin.html)
// ============================================================
const adminAuthGateHtml = `
  <!-- MASTER ADMIN AUTHENTICATION GATE -->
  <div id="adminAuthGate" class="portal-auth-gate">
    <div class="portal-auth-card">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="parcelkar-logo.png" alt="Parcelकर" style="height: 48px; margin-bottom: 8px; filter: drop-shadow(0 2px 8px rgba(255,71,34,0.3));">
        <div style="display: inline-block; background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.3); color: #f87171; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
          🛡️ Master Super Admin Portal
        </div>
        <h2 style="font-size: 22px; font-weight: 900; margin: 0 0 6px 0; color: #fff;">Executive Login Gate</h2>
        <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">
          Restricted access. Enter your Super Admin credentials to manage platform operations, credentials, and financials.
        </p>
      </div>

      <div id="adminAuthError" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1.5px solid #ef4444; color: #fca5a5; font-size: 12px; font-weight: 600; padding: 10px 14px; border-radius: 10px; margin-bottom: 16px;"></div>

      <form onsubmit="submitAdminLogin(event); return false;">
        <label style="font-size: 12px; font-weight: 700; color: #cbd5e1; display: block; margin-bottom: 6px;">
          Super Admin / Manager Username or Email
        </label>
        <input type="text" id="adminAuthLoginInput" placeholder="Enter Username (e.g. admin@parcelkar.com)" required autocomplete="username">

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; margin-bottom: 6px;">
          <label style="font-size: 12px; font-weight: 700; color: #cbd5e1;">
            Password / PIN
          </label>
          <button type="button" onclick="toggleInputVisibility('adminAuthPassInput')" style="background: none; border: none; color: #f87171; font-size: 11px; font-weight: 700; cursor: pointer;">
            👁️ Show/Hide
          </button>
        </div>
        <input type="password" id="adminAuthPassInput" placeholder="Enter your secret password" required autocomplete="current-password">

        <button type="button" onclick="submitAdminLogin(event)" class="btn-primary" style="width: 100%; padding: 12px; font-size: 14px; font-weight: 800; border-radius: 10px; margin-top: 12px; box-shadow: 0 4px 14px rgba(255,71,34,0.35); cursor: pointer;">
          🔓 Unlock Executive Admin Center
        </button>
      </form>

      <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: center; align-items: center;">
        <span style="font-size: 11px; color: #94a3b8;">
          🔒 High Security: End-to-End Encrypted Session
        </span>
      </div>

      <div style="text-align: center; margin-top: 14px; font-size: 11px; color: #64748b; line-height: 1.4;">
        🛡️ Authorized Executive Personnel Only. Unauthorized access attempts are monitored and logged.
      </div>
    </div>
  </div>
`;

const adminHtml = `${headCommon('Parcelकर Master Admin — Platform Operations & System Dashboard', 'Master control dashboard for Parcelकर platform: restaurant onboarding, rider telemetry, zone configuration, commission and analytics.')}
<body>
  ${adminAuthGateHtml}

  <div id="adminDashboardContainer" style="display: none;">
    <!-- Header: Master Super Admin Dedicated Header -->
    <header>
      <div class="logo-area" onclick="location.href='/admin'" style="cursor: pointer;" title="Parcelकर Master Admin">
        <img src="parcelkar-logo.png" alt="Parcelकर Admin" class="brand-logo-img">
        <span class="brand-name-text">Parcel<span class="brand-highlight">कर</span></span>
        <span class="portal-badge badge-admin">🛡️ Master Admin</span>
      </div>

      <!-- Admin Status Banner -->
      <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: #059669; background: #ecfdf5; padding: 4px 12px; border-radius: 999px; border: 1px solid #a7f3d0;">
        <span style="display: inline-block; width: 8px; height: 8px; background: #10b981; border-radius: 50%;"></span>
        <span>Live System: All 5 Delivery Zones Online</span>
      </div>

      <nav class="nav-center">
        <button class="nav-item-btn active" onclick="show('admin')">📊 Platform Metrics</button>
        <button class="nav-item-btn" onclick="openCreateVendorCredsModal()">➕ Allocate Credentials</button>
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
        <button class="btn-danger" onclick="adminLogout()" style="padding: 5px 10px; font-size: 12px;" title="Log out of Super Admin">🚪 Logout</button>
      </div>
    </header>

    <main class="container">
      ${adminSection}
    </main>
  </div>

  ${allModals}
  ${adminModalsHtml}

  <!-- MODAL: Add / Edit Platform Manager (RBAC) -->
  <div id="createManagerModal" class="modal-overlay hidden">
    <div class="modal-content" style="max-width: 520px;">
      <button class="modal-close-btn" onclick="closeModal('createManagerModal')">✕</button>
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
        <span style="font-size: 26px;">👥</span>
        <div>
          <h3 class="modal-title" style="margin: 0; font-size: 18px; font-weight: 900;" id="mgrModalTitle">Add New Manager &amp; Allocate Role</h3>
          <span style="font-size: 12px; color: var(--text-muted);">Assign roles &amp; permissions for parcelkar.com/admin access</span>
        </div>
      </div>

      <form onsubmit="saveManagerCredentials(event)">
        <input type="hidden" id="mgrTargetId">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">Manager Full Name</label>
            <input type="text" id="mgrName" class="input-field" placeholder="e.g. Pooja Deshmukh" required>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">Official Email</label>
            <input type="email" id="mgrEmail" class="input-field" placeholder="pooja@parcelkar.com">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">Login ID / Username</label>
            <input type="text" id="mgrLoginId" class="input-field" placeholder="e.g. pooja" required>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Login Password</span>
              <a href="javascript:void(0)" onclick="document.getElementById('mgrPassword').value = 'mgr' + Math.floor(100 + Math.random()*900)" style="font-size: 11px; color: var(--primary); font-weight: 700;">🎲 Auto-Generate</a>
            </label>
            <input type="text" id="mgrPassword" class="input-field" placeholder="Password (min 4 chars)" required minlength="4">
          </div>
        </div>

        <div style="margin-bottom: 14px;">
          <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 4px;">👑 Assign Role &amp; Power</label>
          <select id="mgrRoleSelect" class="input-field" style="font-weight: 700; font-size: 13px;">
            <option value="operations">📋 Operations &amp; Restaurant Manager (KYC, Menu, Outlets, Orders)</option>
            <option value="dispatch">🛵 Fleet &amp; Dispatch Manager (Riders, GPS, Dispatch, Telemetry)</option>
            <option value="support">💬 Customer Support &amp; Disputes Manager (Refunds, Chat, Reviews)</option>
            <option value="finance">💰 Finance &amp; Accounts Manager (Commissions, Settlements, Ledger)</option>
            <option value="coadmin">👑 Executive Co-Admin (Full platform operational authority)</option>
          </select>
        </div>

        <div style="margin-bottom: 16px; padding: 10px 12px; background: var(--bg-surface-alt, #f8fafc); border-radius: 8px; border: 1px solid var(--border-color, #e2e8f0);">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; font-weight: 700;">
            <input type="checkbox" id="mgrActive" checked style="width: 18px; height: 18px;">
            <span>Manager Authorized &amp; Active (Uncheck to immediately suspend access)</span>
          </label>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="btn-secondary" onclick="closeModal('createManagerModal')">Cancel</button>
          <button type="submit" class="btn-primary" style="font-weight: 800; background: #8b5cf6; border-color: #7c3aed;">💾 Save Manager &amp; Assign Role</button>
        </div>
      </form>
    </div>
  </div>


  ${scriptsCommon('admin')}
`;

fs.writeFileSync('admin.html', adminHtml, 'utf8');
console.log('admin.html generated!');

// ============================================================
// 4. PARTNER HUB (partner.html)
// ============================================================
const partnerHtml = `${headCommon('Parcelकर Partner Hub — Restaurant & Delivery Fleet Ecosystem', 'Join Parcelकर partner network. Dedicated portals for restaurants, delivery riders, and operations management in Maharashtra.')}
<body>
  <!-- Header: Partner Ecosystem Hub Header -->
  <header>
    <div class="logo-area" onclick="location.href='/partner'" style="cursor: pointer;" title="Parcelकर Partner Ecosystem">
      <img src="parcelkar-logo.png" alt="Parcelकर Partner" class="brand-logo-img">
      <span class="brand-name-text">Parcel<span class="brand-highlight">कर</span></span>
      <span class="portal-badge badge-hub">🚀 Partner Hub</span>
    </div>

    <!-- Quick Navigation to Portals -->
    <div style="display: flex; align-items: center; gap: 8px;">
      <a href="/vendor" class="portal-quick-link" style="color: #ea580c;">🏪 Vendor Terminal ➔</a>
      <a href="/rider" class="portal-quick-link" style="color: #2563eb;">🛵 Rider App ➔</a>
      <a href="/admin" class="portal-quick-link" style="color: #dc2626;">🛡️ Operations Admin ➔</a>
    </div>

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

      <a href="/" class="btn-primary" style="padding: 6px 14px; font-size: 12px; text-decoration: none;">🛍️ Order Food</a>
    </div>
  </header>

  <main class="container">
    ${partnerRegSection}
  </main>

  ${allModals}

  ${scriptsCommon('partnerRegistration')}
`;

fs.writeFileSync('partner.html', partnerHtml, 'utf8');
console.log('partner.html generated!');
