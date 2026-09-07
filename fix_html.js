const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let lines = html.split('\n');
console.log("Total lines:", lines.length);

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="navCustomer"')) {
        console.log("Found navCustomer at line", i);
        lines[i] = '      <button class="nav-item-btn active" id="navCustomer" onclick="show(\'customer\')">🍔 Explore Food</button>';
    }
    else if (lines[i].includes('id="navOrders"')) {
        lines[i] = '      <button class="nav-item-btn" id="navOrders" onclick="show(\'orders\')">🛒 My Orders</button>';
    }
    else if (lines[i].includes('id="navTrack"')) {
        lines[i] = '      <button class="nav-item-btn" id="navTrack" onclick="show(\'track\')">📍 Live Track</button>';
    }
    else if (lines[i].includes('id="navRestaurant"')) {
        lines[i] = '      <button class="nav-item-btn" id="navRestaurant" onclick="show(\'restaurant\')">🏪 Vendor Portal</button>';
    }
    else if (lines[i].includes('id="navDelivery"')) {
        lines[i] = '      <button class="nav-item-btn" id="navDelivery" onclick="show(\'delivery\')">🛵 Rider App</button>';
    }
    else if (lines[i].includes('id="navAdmin"')) {
        lines[i] = '      <button class="nav-item-btn" id="navAdmin" onclick="show(\'admin\')">🛡️ Admin Center</button>';
    }
    else if (lines[i].includes('id="themeToggleBtnNav"')) {
        lines[i] = '      <button id="themeToggleBtnNav" class="theme-toggle-btn" onclick="toggleTheme()" title="Switch Theme (Dark/Light)">\n        <span>🌙</span>\n        <span>Dark</span>\n      </button>';
        lines[i+1] = '';
        lines[i+2] = '';
        lines[i+3] = '';
    }
    else if (lines[i].includes('class="logo-icon"')) {
        lines[i] = '      <div class="logo-icon">🍔</div>';
    }
    else if (lines[i].includes('class="loc-pin"')) {
        lines[i] = '      <span class="loc-pin">📍</span>';
    }
    else if (lines[i].includes('class="loc-arrow"')) {
        lines[i] = '        <span class="loc-title">Deliver to <span class="loc-arrow">▼</span></span>';
    }
    else if (lines[i].includes('value="en"')) {
        lines[i] = '        <option value="en">🇬🇧 English</option>';
    }
    else if (lines[i].includes('value="mr"')) {
        lines[i] = '        <option value="mr">🇮🇳 मराठी</option>';
    }
    else if (lines[i].includes('value="hi"')) {
        lines[i] = '        <option value="hi">🇮🇳 हिन्दी</option>';
    }
    else if (lines[i].includes('<title>')) {
        lines[i] = '  <title>FoodBank V11 — Multi-Restaurant Food Ordering & Management System</title>';
    }
    else if (lines[i].includes('id="audioToggleBtn"')) {
        lines[i] = '      <button id="audioToggleBtn" class="role-pill" onclick="toggleSystemAudio()" style="margin-left: 8px;">🔊 Sound: ON</button>';
    }
    else if (lines[i].includes('id="themeToggleBtn"')) {
        lines[i] = '      <button id="themeToggleBtn" class="role-pill" onclick="toggleTheme()" style="margin-left: 6px;">🌙 Dark</button>';
    }
    else if (lines[i].includes('id="pwaInstallPill"')) {
        lines[i] = '      <button id="pwaInstallPill" class="role-pill" onclick="triggerPwaInstall()" style="display: none; background: #05a760; color: #fff; border-color: #05a760;">📱 Install App</button>';
    }
    else if (lines[i].includes('openKdsModal()')) {
        lines[i] = '      <button class="role-pill" onclick="openKdsModal()" style="background: #ea580c; color: #fff; border-color: #ea580c;">👨‍🍳 Kitchen KDS</button>';
    }
    else if (lines[i].includes('openGamificationModal()')) {
        // Only replace if it's the role pill
        if (lines[i].includes('role-pill')) {
            lines[i] = '      <button class="role-pill" onclick="openGamificationModal()" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; border-color: #ec4899;">🎰 Lucky Spin</button>';
        } else if (lines[i].includes('lucky-spin-nav-btn')) {
            lines[i+1] = '        <span>🎰</span>';
        }
    }
    else if (lines[i].includes('openPosModal()')) {
        lines[i] = '      <button class="role-pill" onclick="openPosModal()" style="background: #4f46e5; color: #fff; border-color: #4f46e5;">📠 Restaurant POS</button>';
    }
    else if (lines[i].includes('quickRole(\'restaurant\', 1)')) {
        lines[i] = '      <button class="role-pill" onclick="quickRole(\'restaurant\', 1)">🏪 Sakoli Corner (Vendor)</button>';
    }
    else if (lines[i].includes('quickRole(\'restaurant\', 2)')) {
        lines[i] = '      <button class="role-pill" onclick="quickRole(\'restaurant\', 2)">🏪 Aapla Bhojanalay (Vendor)</button>';
    }
    else if (lines[i].includes('quickRole(\'delivery\')')) {
        lines[i] = '      <button class="role-pill" onclick="quickRole(\'delivery\')">🛵 Delivery Partner</button>';
    }
    else if (lines[i].includes('quickRole(\'admin\')')) {
        lines[i] = '      <button class="role-pill" onclick="quickRole(\'admin\')">🛡️ Super Admin</button>';
    }
    else if (lines[i].includes('class="notification-btn"')) {
        lines[i+1] = '          <span>🔔</span>';
    }
    else if (lines[i].includes('Activity Updates</span>')) {
        lines[i] = '            <span style="font-weight: 700; font-size: 13px;">🔔 Activity Updates</span>';
    }
    else if (lines[i].includes('id="weatherSurgeIcon"')) {
        lines[i] = '        <span id="weatherSurgeIcon">☀️</span>';
    }
    else if (lines[i].includes('id="weatherSurgeLabel"')) {
        lines[i] = '        <span id="weatherSurgeLabel">Weather: Clear (₹10 Surge)</span>';
    }
    else if (lines[i].includes('Explore Perks')) {
        // Simple replace for the âž” or other broken bytes
        lines[i] = lines[i].replace(/Explore Perks.*?"/, 'Explore Perks ➔"');
    }
}

html = lines.filter(l => l !== '').join('\n');
fs.writeFileSync('index.html', html, 'utf8');
console.log("DONE!");
