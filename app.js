/**
 * BhookIt V1 — Multi-Restaurant Food Ordering & Management System
 * Phase 1 & Phase 2 Integrated Engine
 * Features: Multi-vendor, Live Route Tracking, GST Invoices,
 * WhatsApp Notifications, Voice Kitchen Alerts, & Multi-Language (EN/MR/HI)
 */

// Storage Key & Default Seed Data
const STORAGE_KEY = 'bhookit_v11_data_v2';

// -------------------------------------------------------------
// MULTI-LANGUAGE TRANSLATION DICTIONARY
// -------------------------------------------------------------
const TRANSLATIONS = {
  en: {
    systemTitle: 'BhookIt V1 System',
    demoMode: 'Interactive Demo Mode',
    navExplore: '🍔 Explore Food',
    navOrders: '📦 My Orders',
    navTrack: '📍 Live Track',
    navVendor: '🏪 Vendor Portal',
    navRider: '🛵 Rider App',
    navAdmin: '👑 Admin Center',
    cart: 'Cart',
    guest: 'Guest User',
    login: 'Login',
    logout: 'Logout',
    heroBadge: '⚡ Instant 30-Min Delivery',
    heroTitle: 'Hungry? Order from the best restaurants nearby.',
    heroDesc: 'Discover top-rated cuisines, fast local delivery, and live route tracking right to your doorstep.',
    searchPlaceholder: 'Search for dishes, restaurants, or cuisines (e.g. Pizza, Thali, Biryani)...',
    all: '✨ All Items',
    fastFood: '🍔 Fast Food',
    northIndian: '🥘 North Indian',
    southIndian: '🥞 South Indian',
    pizzaBurger: '🍕 Pizza & Italian',
    chinese: '🍜 Chinese & Momos',
    desserts: '🍨 Desserts & Shakes',
    featuredRest: 'Featured Restaurants',
    addToOrder: '+ Add',
    soldOut: 'Sold Out',
    emptyCart: 'Your cart is empty',
    browseRest: 'Browse Restaurants',
    placeOrderBtn: 'Place Order Now 🚀',
    orderPlacedSuccess: 'Order placed successfully! Order ID:',
    orderCancelled: 'Order cancelled.',
    trackTitle: 'Live Delivery Tracking',
    estimatedTime: 'Estimated Time',
    deliveryPartner: 'Delivery Partner',
    voiceOn: '🔊 Voice: ON',
    voiceOff: '🔇 Voice: OFF',
    voiceTestAlert: 'Attention chefs! New food order received for preparation.',
    bookTable: '🍽️ Book Table',
    pureVeg: 'Pure Veg',
    wallet: 'Wallet',
    favorites: 'Favorites',
    tableBookings: 'Table Reservations',
    redeemWallet: 'Redeem Wallet'
  },
  mr: {
    systemTitle: 'भूकीट सिस्टीम',
    demoMode: 'डेमो मोड सक्रिय',
    navExplore: '🍔 मेनू शोधा',
    navOrders: '📦 माझ्या ऑर्डर्स',
    navTrack: '📍 लाईव्ह ट्रॅक',
    navVendor: '🏪 रेस्टॉरंट पॅनेल',
    navRider: '🛵 डिलिव्हरी रायडर',
    navAdmin: '👑 ॲडमिन केंद्र',
    cart: 'कार्ट',
    guest: 'अतिथी ग्राहक',
    login: 'लॉगिन',
    logout: 'बाहेर पडा',
    heroBadge: '⚡ 30 मिनिटांत जलद डिलिव्हरी',
    heroTitle: 'Food तुमच्या दारात! सर्वोत्तम रेस्टॉरंट्समधून ऑर्डर करा.',
    heroDesc: 'स्थानिक रेस्टॉरंट्समधून ताजे आणि चविष्ट जेवण घरपोच मिळवा. लाईव्ह ट्रॅकिंगसह!',
    searchPlaceholder: 'पदार्थ, रेस्टॉरंट किंवा प्रकार शोधा (उदा. पिझ्झा, थाळी)...',
    all: '✨ सर्व पदार्थ',
    fastFood: '🍔 फास्ट फूड',
    northIndian: '🥘 उत्तर भारतीय',
    southIndian: '🥞 दक्षिण भारतीय',
    pizzaBurger: '🍕 पिझ्झा आणि बर्गर',
    chinese: '🍜 चायनीज आणि मोमोज',
    desserts: '🍨 गोड पदार्थ आणि मिल्कशेक',
    featuredRest: 'प्रसिद्ध रेस्टॉरंट्स',
    addToOrder: '+ कार्टमध्ये टाका',
    soldOut: 'संपले',
    emptyCart: 'कार्ट रिकामी आहे',
    browseRest: 'रेस्टॉरंट्स पाहा',
    placeOrderBtn: 'ऑर्डर करा 🚀',
    orderPlacedSuccess: 'ऑर्डर यशस्वीपणे नोंदवली! आयडी:',
    orderCancelled: 'ऑर्डर रद्द केली.',
    trackTitle: 'ऑर्डर ट्रॅकिंग',
    estimatedTime: 'अंदाजे वेळ',
    deliveryPartner: 'डिलिव्हरी पार्टनर',
    voiceOn: '🔊 आवाज: सुरू',
    voiceOff: '🔇 आवाज: बंद',
    voiceTestAlert: 'शेफ्स लक्ष द्या! नवीन ऑर्डर आली आहे.',
    bookTable: '🍽️ टेबल बुक करा',
    pureVeg: 'शुद्ध शाकाहारी',
    wallet: 'पाकीट',
    favorites: 'आवडते',
    tableBookings: 'टेबल बुकिंग',
    redeemWallet: 'वॉलेट वापरा'
  },
  hi: {
    systemTitle: 'भूकीट सिस्टम',
    demoMode: 'डेमो मोड सक्रिय',
    navExplore: '🍔 मेन्यू खोजें',
    navOrders: '📦 मेरे ऑर्डर्स',
    navTrack: '📍 लाइव ट्रैक',
    navVendor: '🏪 वेंडर पोर्टल',
    navRider: '🛵 राइडर ऐप',
    navAdmin: '👑 एडमिन सेंटर',
    cart: 'कार्ट',
    guest: 'अतिथि ग्राहक',
    login: 'लॉगिन',
    logout: 'लॉग आउट',
    heroBadge: '⚡ 30 मिनट में फास्ट डिलीवरी',
    heroTitle: 'भूख लगी है? आसपास के बेहतरीन रेस्टोरेंट्स से ऑर्डर करें।',
    heroDesc: 'स्वादिष्ट व्यंजन, तेज डिलीवरी और लाइव ट्रैकिंग का आनंद लें।',
    searchPlaceholder: 'व्यंजन, रेस्टोरेंट या कुजीन खोजें (जैसे: पिज्जा, बिरयानी)...',
    all: '✨ सभी डिश',
    fastFood: '🍔 फास्ट फूड',
    northIndian: '🥘 नॉर्थ इंडियन',
    southIndian: '🥞 साउथ इंडियन',
    pizzaBurger: '🍕 पिज्जा और बर्गर',
    chinese: '🍜 चाइनीज',
    desserts: '🍨 मिठाइयां और शेक',
    featuredRest: 'लोकप्रिय रेस्टोरेंट्स',
    addToOrder: '+ ऑर्डर में जोड़ें',
    soldOut: 'खत्म हो गया',
    emptyCart: 'आपकी कार्ट खाली है',
    browseRest: 'रेस्टोरेंट्स ब्राउज़ करें',
    placeOrderBtn: 'अभी ऑर्डर करें 🚀',
    orderPlacedSuccess: 'ऑर्डर सफलतापूर्वक रखा गया! आईडी:',
    orderCancelled: 'ऑर्डर रद्द कर दिया गया है।',
    trackTitle: 'लाइव डिलीवरी ट्रैकिंग',
    estimatedTime: 'अनुमानित समय',
    deliveryPartner: 'डिलीवरी पार्टनर',
    voiceOn: '🔊 आवाज़: चालू',
    voiceOff: '🔇 आवाज़: बंद',
    voiceTestAlert: 'ध्यान दें शेफ्स! नया ऑर्डर तैयार करने के लिए प्राप्त हुआ है।',
    bookTable: '🍽️ टेबल बुक करें',
    pureVeg: 'शुद्ध शाकाहारी',
    wallet: 'वॉलेट',
    favorites: 'पसंदीदा',
    tableBookings: 'टेबल आरक्षण',
    redeemWallet: 'वॉलेट रिडीम करें'
  }
};

let currentLanguage = localStorage.getItem('bhookit_lang') || 'en';

function t(key) {
  return (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key]) || TRANSLATIONS.en[key] || key;
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('bhookit_lang', lang);
  const langSel = document.getElementById('langSelect');
  if (langSel) langSel.value = lang;
  applyLanguageTranslations();
  showToast(`Language set to ${lang === 'mr' ? 'à¤®à¤°à¤¾à¤ à¥€' : lang === 'hi' ? 'à¤¹à¤¿à¤‚à¤¦à¥€' : 'English'}`, 'info');
}

function applyLanguageTranslations() {
  const map = {
    txtCartLabel: 'cart',
    navCustomer: 'navExplore',
    navOrders: 'navOrders',
    navTrack: 'navTrack',
    navRestaurant: 'navVendor',
    navDelivery: 'navRider',
    navAdmin: 'navAdmin',
    txtPureVegLabel: 'pureVeg'
  };
  for (const [id, key] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = t(key);
    }
  }

  const searchInput = document.getElementById('foodSearchInput');
  if (searchInput) searchInput.placeholder = t('searchPlaceholder');

  renderCustomerView();
}

// -------------------------------------------------------------
// SEED DATA
// -------------------------------------------------------------
const SEED_DATA = {
  settings: {
    deliveryBase: 30,
    perKm: 8,
    gstRate: 5,
    platformFee: 5,
    defaultCommission: 10,
    coupons: {
      BHOOKIT20: { type: 'percent', value: 20, min: 200, label: '20% OFF up to ₹100' },
      JB10: { type: 'percent', value: 10, min: 150, label: '10% OFF on all orders' },
      WELCOME50: { type: 'flat', value: 50, min: 250, label: 'Flat ₹50 OFF' }
    }
  },
  currentUser: {
    id: 'user_demo_1',
    name: 'Rakesh Sharma',
    email: 'rakesh.user@demo.com',
    phone: '9876543210',
    address: 'Flat 402, Green Avenue, Main Road, Sakoli',
    savedAddresses: [
      { id: 'addr_home', type: 'Home', label: 'ðŸ  Home', address: 'Flat 402, Green Avenue, Main Road, Sakoli', isDefault: true },
      { id: 'addr_work', type: 'Work', label: 'ðŸ¢ Office', address: 'Cabin 14, Commercial Complex, Station Road, Sakoli', isDefault: false }
    ]
  },
  notifications: [
    { id: 'notif_1', icon: '🛵', text: 'Order #FB-98210 is Out for Delivery with Vikram Rider!', time: '10m ago', unread: true },
    { id: 'notif_2', icon: '🎉', text: 'Use coupon BHOOKIT20 to get 20% discount on today\'s lunch.', time: '1h ago', unread: true },
    { id: 'notif_3', icon: '🍲', text: 'Sakoli Food Corner just added new dishes to their menu.', time: '3h ago', unread: false }
  ],
  restaurants: [
    {
      id: 1,
      name: 'Sakoli Food Corner',
      email: 'sakoli@bhookit.com',
      phone: '+91 9822334455',
      category: 'Fast Food',
      rating: 4.8,
      prepTime: '20-25 mins',
      minOrder: 100,
      commissionRate: 10,
      approved: true,
      open: true,
      coverImg: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80',
      foods: [
        { id: 101, name: 'Crispy Veg Supreme Burger', price: 99, category: 'Fast Food', veg: true, inStock: true, desc: 'Fresh patty with lettuce, tomatoes, and secret sauce.' },
        { id: 102, name: 'Farmhouse Cheese Pizza (7 inch)', price: 189, category: 'Pizza & Burger', veg: true, inStock: true, desc: 'Loaded with bell peppers, sweet corn, and mozzarella.' },
        { id: 103, name: 'Peri-Peri French Fries', price: 79, category: 'Fast Food', veg: true, inStock: true, desc: 'Crispy golden potato fries tossed in fiery African peri-peri.' },
        { id: 104, name: 'Hakka Noodles & Manchurian Combo', price: 159, category: 'Chinese', veg: true, inStock: true, desc: 'Wok tossed noodles paired with crispy veg Manchurian balls.' }
      ]
    },
    {
      id: 2,
      name: 'Aapla Bhojanalay',
      email: 'aapla@bhookit.com',
      phone: '+91 9822112233',
      category: 'North Indian',
      rating: 4.9,
      prepTime: '25-30 mins',
      minOrder: 150,
      commissionRate: 10,
      approved: true,
      open: true,
      coverImg: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      foods: [
        { id: 201, name: 'Special Maharashtrian Veg Thali', price: 160, category: 'North Indian', veg: true, inStock: true, desc: '3 Chapatis, 2 Veg Curries, Dal Tadka, Jeera Rice, Sweet Gulab Jamun.' },
        { id: 202, name: 'Paneer Butter Masala', price: 190, category: 'North Indian', veg: true, inStock: true, desc: 'Rich and creamy tomato gravy cooked with fresh cottage cheese.' },
        { id: 203, name: 'Dal Khichdi Tadka', price: 120, category: 'North Indian', veg: true, inStock: true, desc: 'Comfort food prepared with rice and lentils tempered with garlic and cumin.' },
        { id: 204, name: 'Butter Tandoori Roti (2 Pcs)', price: 40, category: 'North Indian', veg: true, inStock: true, desc: 'Freshly baked whole wheat flatbread brushed with fresh butter.' }
      ]
    },
    {
      id: 3,
      name: 'Royal Biryani & Rolls',
      email: 'biryani@bhookit.com',
      phone: '+91 9899887766',
      category: 'North Indian',
      rating: 4.7,
      prepTime: '30-35 mins',
      minOrder: 200,
      commissionRate: 12,
      approved: true,
      open: true,
      coverImg: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
      foods: [
        { id: 301, name: 'Dum Veg Biryani Handi', price: 199, category: 'North Indian', veg: true, inStock: true, desc: 'Aromatic long-grain basmati rice cooked with fresh seasonal vegetables and saffron.' },
        { id: 302, name: 'Paneer Tikka Kathi Roll', price: 110, category: 'Fast Food', veg: true, inStock: true, desc: 'Charcoal grilled cottage cheese wrapped in a crispy flaky paratha.' },
        { id: 303, name: 'Hyderabadi Mirchi Ka Salan', price: 60, category: 'North Indian', veg: true, inStock: true, desc: 'Spicy and tangy peanut sesame gravy best paired with biryani.' }
      ]
    },
    {
      id: 4,
      name: 'Sweet Treats & Shakes',
      email: 'sweets@bhookit.com',
      phone: '+91 9877665544',
      category: 'Desserts',
      rating: 4.9,
      prepTime: '15-20 mins',
      minOrder: 80,
      commissionRate: 10,
      approved: true,
      open: true,
      coverImg: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
      foods: [
        { id: 401, name: 'Belgium Chocolate Waffle', price: 140, category: 'Desserts', veg: true, inStock: true, desc: 'Freshly baked crispy waffle smothered in warm melted dark chocolate.' },
        { id: 402, name: 'Thick Oreo Shake (400ml)', price: 110, category: 'Desserts', veg: true, inStock: true, desc: 'Blended with premium vanilla ice cream, whole milk, and crushed Oreo cookies.' },
        { id: 403, name: 'Sizzling Brownie with Ice Cream', price: 150, category: 'Desserts', veg: true, inStock: true, desc: 'Gooey chocolate brownie served on a hot skillet with vanilla ice cream.' }
      ]
    }
  ],
  riders: [
    { id: 'rider_1', name: 'Vikram Rider', email: 'rider@jbfood.local', phone: '+91 9988771122', active: true, lat: 21.0825, lng: 79.9854, totalTrips: 18, earnings: 940, tips: 120 },
    { id: 'rider_2', name: 'Speedy Rahul', email: 'rahul@bhookit.com', phone: '+91 9988773344', active: true, lat: 21.0860, lng: 79.9910, totalTrips: 14, earnings: 780, tips: 90 }
  ],
  orders: [
    {
      id: 'FB-98210',
      invoiceNo: 'JBINV-20260907-001',
      userId: 'user_demo_1',
      restaurantId: 1,
      restaurantName: 'Sakoli Food Corner',
      customer: {
        name: 'Rakesh Sharma',
        phone: '9876543210',
        address: 'Flat 402, Green Avenue, Sakoli'
      },
      items: [
        { restaurant: 'Sakoli Food Corner', restaurantId: 1, foodId: 101, name: 'Crispy Veg Supreme Burger', price: 99, qty: 2, addons: ['Regular', 'Extra Cheese'] },
        { restaurant: 'Sakoli Food Corner', restaurantId: 1, foodId: 103, name: 'Peri-Peri French Fries', price: 79, qty: 1, addons: ['Regular'] }
      ],
      subtotal: 277,
      deliveryFee: 30,
      taxes: 14,
      discount: 40,
      total: 281,
      status: 'Out for Delivery',
      deliveryBoy: 'Vikram Rider',
      riderPhone: '+91 9988771122',
      payment: 'UPI',
      paymentStatus: 'Paid',
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      etaMinutes: 12,
      deliveryProgress: 75
    },
    {
      id: 'FB-98205',
      invoiceNo: 'JBINV-20260907-002',
      userId: 'user_demo_1',
      restaurantId: 2,
      restaurantName: 'Aapla Bhojanalay',
      customer: {
        name: 'Rakesh Sharma',
        phone: '9876543210',
        address: 'Flat 402, Green Avenue, Sakoli'
      },
      items: [
        { restaurant: 'Aapla Bhojanalay', restaurantId: 2, foodId: 201, name: 'Special Maharashtrian Veg Thali', price: 160, qty: 1, addons: ['Regular'] },
        { restaurant: 'Aapla Bhojanalay', restaurantId: 2, foodId: 204, name: 'Butter Tandoori Roti (2 Pcs)', price: 40, qty: 2, addons: ['Regular'] }
      ],
      subtotal: 240,
      deliveryFee: 30,
      taxes: 12,
      discount: 0,
      total: 282,
      status: 'Preparing',
      deliveryBoy: '',
      riderPhone: '',
      payment: 'COD',
      paymentStatus: 'Pending',
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
      etaMinutes: 24,
      deliveryProgress: 40
    }
  ]
};

// Application State
let appData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || SEED_DATA;

// Ensure KYC & FSSAI attributes exist on all restaurants
if (appData && appData.restaurants) {
  appData.restaurants.forEach(r => {
    if (!r.fssai) r.fssai = '11524012000' + (100 + r.id);
    if (!r.hygiene) r.hygiene = 4.8;
    if (!r.gstin) r.gstin = '27AAACF' + (1000 + r.id) + 'F1Z' + r.id;
  });
}

// Ensure savedAddresses, notifications, deliveryOtps, wallet, favorites, and tableBookings exist
if (appData) {
  if (!appData.notifications || !appData.notifications.length) {
    appData.notifications = [
      { id: 'notif_1', icon: '🛵', text: 'Order #FB-98210 is Out for Delivery with Vikram Rider!', time: '10m ago', unread: true },
      { id: 'notif_2', icon: '🎉', text: 'Use coupon BHOOKIT20 to get 20% discount on today\'s lunch.', time: '1h ago', unread: true },
      { id: 'notif_3', icon: '🍲', text: 'Sakoli Food Corner just added new dishes to their menu.', time: '3h ago', unread: false }
    ];
  }
  if (appData.currentUser) {
    if (!appData.currentUser.savedAddresses || !appData.currentUser.savedAddresses.length) {
      appData.currentUser.savedAddresses = [
        { id: 'addr_home', type: 'Home', label: 'ðŸ  Home', address: 'Flat 402, Green Avenue, Main Road, Sakoli', isDefault: true },
        { id: 'addr_work', type: 'Work', label: 'ðŸ¢ Office', address: 'Cabin 14, Commercial Complex, Station Road, Sakoli', isDefault: false }
      ];
    }
    if (typeof appData.currentUser.walletBalance !== 'number') {
      appData.currentUser.walletBalance = 250;
    }
    if (!appData.currentUser.walletLedger || !appData.currentUser.walletLedger.length) {
      appData.currentUser.walletLedger = [
        { id: 'tx_1', type: 'credit', title: '🎉 Welcome Loyalty Bonus', amount: 200, date: '01-Sep-2026' },
        { id: 'tx_2', type: 'credit', title: 'ðŸŽ App Sign-up Reward', amount: 50, date: '05-Sep-2026' }
      ];
    }
    if (!Array.isArray(appData.currentUser.favorites)) {
      appData.currentUser.favorites = [101, 201];
    }
  }
  if (!Array.isArray(appData.tableBookings)) {
    appData.tableBookings = [
      {
        id: 'TB-89102',
        restaurantId: 1,
        restaurantName: 'Sakoli Food Corner',
        customerName: 'Rakesh Sharma',
        customerPhone: '9876543210',
        date: new Date().toISOString().slice(0, 10),
        timeSlot: '07:30 PM (Dinner)',
        guests: 4,
        seatingZone: 'Indoor AC Family Section',
        specialNotes: 'Birthday Celebration 🎂',
        status: 'Confirmed',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }
  if (!Array.isArray(appData.inventory) || !appData.inventory.length) {
    appData.inventory = [
      { id: 'inv_1', name: 'Fresh Burger Buns', unit: 'Pcs', stock: 45, max: 100, lowThreshold: 20, icon: '🍔', cost: 12 },
      { id: 'inv_2', name: 'Mozzarella & Cheddar Cheese', unit: 'Kg', stock: 8.5, max: 20, lowThreshold: 4, icon: '🧀', cost: 420 },
      { id: 'inv_3', name: 'Fresh Malai Paneer', unit: 'Kg', stock: 12, max: 25, lowThreshold: 5, icon: 'ðŸ§ˆ', cost: 360 },
      { id: 'inv_4', name: 'Royal Basmati Biryani Rice', unit: 'Kg', stock: 28, max: 50, lowThreshold: 10, icon: 'ðŸš', cost: 110 },
      { id: 'inv_5', name: 'Food Grade Eco Meal Boxes', unit: 'Units', stock: 85, max: 150, lowThreshold: 30, icon: '📦', cost: 8 },
      { id: 'inv_6', name: 'Refined Cooking Oil & Ghee', unit: 'Liters', stock: 14, max: 30, lowThreshold: 6, icon: 'ðŸ›¢ï¸', cost: 140 }
    ];
  }
  if (!Array.isArray(appData.disputes)) {
    appData.disputes = [
      {
        id: 'DSP-78901',
        orderId: 'FB-98210',
        customerName: 'Rakesh Sharma',
        restaurantName: 'Sakoli Food Corner',
        amount: 80,
        reason: 'Missing Extra Butter Naan',
        status: 'Approved & Refunded',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  }
  if (!appData.surgeSettings) {
    appData.surgeSettings = {
      rainSurge: false,
      rainFee: 25,
      peakSurge: false,
      peakMultiplier: 1.25,
      lateNightSurge: false,
      lateNightFee: 20
    };
  }
  if (!appData.batchRoute) {
    appData.batchRoute = {
      id: 'BATCH-SKL-409',
      active: true,
      corridor: 'Main Road ➔ Station Road ➔ Green Avenue Corridor',
      currentStep: 0,
      payout: 85,
      distanceSavings: '4.2 km',
      timeSavings: '18 mins',
      waypoints: [
        { type: 'pickup', title: 'Pickup from Sakoli Food Corner', address: 'Main Road, Sakoli', orderId: 'FB-98210', items: 'Paneer Butter Masala (1), Butter Naan (2)', done: false },
        { type: 'pickup', title: 'Pickup from Aapla Bhojanalay', address: 'Station Road, Sakoli', orderId: 'FB-98211', items: 'Special Veg Thali (1), Butter Roti (2)', done: false },
        { type: 'drop', title: 'Drop to Rakesh Sharma', address: 'Flat 402, Green Avenue, Sakoli', orderId: 'FB-98210', otp: '5821', done: false },
        { type: 'drop', title: 'Drop to Amit Patil', address: 'Cabin 14, Station Road, Sakoli', orderId: 'FB-98211', otp: '7419', done: false }
      ]
    };
  }
  (appData.orders || []).forEach(o => {
    if (!o.deliveryOtp) o.deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();
  });
  if (!Array.isArray(appData.deliveryZones) || !appData.deliveryZones.length) {
    appData.deliveryZones = [
      { id: 'zone_sakoli_1', city: 'Sakoli', name: 'Main Market & Station Road', eta: '20-25 mins', baseFee: 30, active: true },
      { id: 'zone_sakoli_2', city: 'Sakoli', name: 'Ward 3, 4 & Green Avenue', eta: '20 mins', baseFee: 30, active: true },
      { id: 'zone_sakoli_3', city: 'Sakoli', name: 'College Campus & Bypass Chowk', eta: '25-30 mins', baseFee: 35, active: true },
      { id: 'zone_sakoli_4', city: 'Sakoli', name: 'Sendurwafa Flyover Corridor', eta: '30-35 mins', baseFee: 40, active: true },
      { id: 'zone_sakoli_5', city: 'Sakoli', name: 'Bus Depot & Civil Hospital Area', eta: '20-25 mins', baseFee: 30, active: true },
      { id: 'zone_lakhani_1', city: 'Lakhani', name: 'Lakhani Town Hub & Main Chowk', eta: '35-45 mins', baseFee: 50, active: true },
      { id: 'zone_bhandara_1', city: 'Bhandara', name: 'Bhandara City Central & Gandhi Chowk', eta: '45-55 mins', baseFee: 70, active: true }
    ];
  }
}

let currentCart = [];
let selectedCategory = 'All';
let currentActiveVendorId = 1;
let currentRole = 'customer';
let pendingCustomizeDish = null;
let appliedDiscount = 0;
let appliedCouponCode = '';
let isVoiceAlertsActive = true;
let isAudioActive = true;
let currentTrackedOrderId = null;
let isPureVegOnly = false;
let currentSortMode = 'default';
let isWalletRedeemedInCart = false;
let selectedTbTimeSlot = '07:30 PM (Dinner)';
let selectedTbGuests = 2;
let selectedTbOccasions = ['🎂 Birthday Celebration'];
let currentOrderSubtab = 'delivery';

// Save state to localStorage
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

// -------------------------------------------------------------
// WEB AUDIO & SPEECH SYNTHESIS VOICE ANNOUNCER
// -------------------------------------------------------------
function toggleSystemAudio() {
  isAudioActive = !isAudioActive;
  const btn = document.getElementById('audioToggleBtn');
  if (btn) {
    btn.textContent = isAudioActive ? '🔊 Sound: ON' : '🔇 Sound: OFF';
    btn.style.opacity = isAudioActive ? '1' : '0.6';
  }
  showToast(isAudioActive ? 'System Sound Effects Enabled 🔊' : 'System Sound Muted 🔇', 'info');
  if (isAudioActive) playSound('chime');
}

let kitchenAudioSettings = {
  chimeTone: 'modern_chime',
  voiceSpeed: 1.0
};

function playSound(type = 'chime') {
  if (!isAudioActive) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const selectedKitchenTone = (type === 'chime' || type === 'kitchen_alert' || type === 'order_placed')
      ? kitchenAudioSettings.chimeTone
      : type;

    if (selectedKitchenTone === 'modern_chime' || selectedKitchenTone === 'chime' || selectedKitchenTone === 'order_placed') {
      // Harmonic 3-tone arpeggio (C5 -> E5 -> G5)
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const startTime = ctx.currentTime + (idx * 0.08);
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } else if (selectedKitchenTone === 'classic_bell' || selectedKitchenTone === 'alert' || selectedKitchenTone === 'kitchen_alert') {
      // Bright double chime bell ping
      [784, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.connect(gain);
        gain.connect(ctx.destination);
        const startTime = ctx.currentTime + (idx * 0.12);
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } else if (selectedKitchenTone === 'rush_siren') {
      // High-Priority Rush Siren alternating bursts
      [880, 1174.66, 880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.connect(gain);
        gain.connect(ctx.destination);
        const startTime = ctx.currentTime + (idx * 0.09);
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
        osc.start(startTime);
        osc.stop(startTime + 0.18);
      });
    } else if (selectedKitchenTone === 'pleasant_harp') {
      // Pentatonic Ambient Harp Glissando (C5, D5, E5, G5, A5)
      [523.25, 587.33, 659.25, 783.99, 880.00].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);
        const startTime = ctx.currentTime + (idx * 0.06);
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.14, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } else if (type === 'delivered') {
      // Celebratory major chord fanfare
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const startTime = ctx.currentTime + (idx * 0.1);
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } else if (type === 'rating') {
      // Gentle star sparkle
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(987.77, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {}
}

function speakVoiceAlert(text) {
  if (!isVoiceAlertsActive || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = kitchenAudioSettings.voiceSpeed || 1.0;
  utterance.pitch = 1.05;
  utterance.lang = currentLanguage === 'mr' ? 'mr-IN' : currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
  window.speechSynthesis.speak(utterance);
}

function setKitchenChimeTone(tone) {
  kitchenAudioSettings.chimeTone = tone;
  saveState();
  showToast(`Kitchen chime tone set to: ${tone.replace(/_/g, ' ').toUpperCase()}`, 'info');
  testKitchenChimeTone();
}

function setKitchenVoiceSpeed(speed) {
  kitchenAudioSettings.voiceSpeed = parseFloat(speed) || 1.0;
  saveState();
  showToast(`Kitchen speech rate set to: ${kitchenAudioSettings.voiceSpeed}x`, 'info');
}

function testKitchenChimeTone() {
  playSound(kitchenAudioSettings.chimeTone);
}

function testKitchenVoiceAnnouncement() {
  const sample = currentLanguage === 'mr' 
    ? 'à¤²à¤•à¥à¤· à¤¦à¥à¤¯à¤¾ à¤¸à¥à¤µà¤¯à¤‚à¤ªà¤¾à¤•à¤˜à¤°! à¤Ÿà¥‡à¤¬à¤² à¤•à¥à¤°à¤®à¤¾à¤‚à¤• à¥ª à¤¸à¤¾à¤ à¥€ à¤¨à¤µà¥€à¤¨ à¤‘à¤°à¥à¤¡à¤° à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤à¤¾à¤²à¥€.' 
    : currentLanguage === 'hi' 
    ? 'à¤§à¥à¤¯à¤¾à¤¨ à¤¦à¥‡à¤‚ à¤°à¤¸à¥‹à¤ˆ! à¤Ÿà¥‡à¤¬à¤² à¤¨à¤‚à¤¬à¤° à¥ª à¤•à¥‡ à¤²à¤¿à¤ à¤¨à¤¯à¤¾ à¤‘à¤°à¥à¤¡à¤° à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤¹à¥à¤†à¥¤' 
    : 'Attention Kitchen! New priority order received for 3 items.';
  speakVoiceAlert(sample);
}

function toggleVoiceAlerts() {
  isVoiceAlertsActive = !isVoiceAlertsActive;
  const btn = document.getElementById('voiceAlertToggleBtn');
  if (btn) {
    btn.textContent = isVoiceAlertsActive ? t('voiceOn') : t('voiceOff');
    btn.className = isVoiceAlertsActive ? 'btn-accent' : 'btn-danger';
  }
  showToast(isVoiceAlertsActive ? 'Voice Kitchen Alerts Enabled' : 'Voice Kitchen Alerts Muted', 'info');
}

function testVoiceAlert() {
  speakVoiceAlert(t('voiceTestAlert'));
}

// -------------------------------------------------------------
// WHATSAPP NOTIFICATIONS ENGINE
// -------------------------------------------------------------
function shareOrderWhatsApp(orderId) {
  openWhatsAppBotModal(orderId);
}

function sendKitchenWhatsApp(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;

  const itemList = order.items.map(i => `• ${i.qty}x ${i.name} ${i.addons ? `[${i.addons.join(', ')}]` : ''}`).join('%0A');
  const message = `ðŸ‘¨â€ðŸ³ *KITCHEN TICKET - NEW ORDER ALERT*%0A%0A` +
    `ðŸ›Žï¸ *Order #${order.id}* for ${order.restaurantName}%0A` +
    `⏰ *Received:* ${new Date(order.createdAt).toLocaleTimeString()}%0A%0A` +
    `📋 *Kitchen Items Checklist:*%0A${itemList}%0A%0A` +
    `👤 *Customer:* ${order.customer.name} (${order.customer.phone})%0A` +
    `⏱️ *Preparation Target:* ~15-20 mins%0A` +
    `Please prepare and pack for courier pickup!`;

  window.open(`https://wa.me/?text=${message}`, '_blank');
}

function sendRiderWhatsApp(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;

  const message = `🛵 *BHOOKIT DISPATCH - DELIVERY TASK*%0A%0A` +
    `📦 *Order #${order.id}*%0A` +
    `ðŸª *Pickup Store:* ${order.restaurantName}%0A` +
    `📍 *Drop Destination:* ${order.customer.address}%0A` +
    `👤 *Customer:* ${order.customer.name}%0A` +
    `📞 *Phone:* ${order.customer.phone}%0A` +
    `💵 *Collect Cash:* ${order.payment === 'COD' ? `₹${order.total}` : '₹0 (Prepaid Online)'}%0A%0A` +
    `🗑ºï¸ *Navigation:* https://maps.google.com/?q=${encodeURIComponent(order.customer.address)}`;

  window.open(`https://wa.me/?text=${message}`, '_blank');
}

function sendSettlementWhatsApp(restaurantId) {
  const rest = appData.restaurants.find(r => r.id === restaurantId);
  if (!rest) return;

  const rOrders = appData.orders.filter(o => o.restaurantId === rest.id && o.status !== 'Cancelled');
  const gross = rOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const comm = Math.round(gross * (rest.commissionRate / 100));
  const payable = gross - comm;

  const message = `💰 *BHOOKIT SETTLEMENT STATEMENT*%0A%0A` +
    `ðŸª *Restaurant Partner:* ${rest.name}%0A` +
    `📅 *Statement Date:* ${new Date().toLocaleDateString()}%0A%0A` +
    `📈 *Total Gross Orders:* ₹${gross}%0A` +
    `📉 *Platform Commission (${rest.commissionRate}%):* -₹${comm}%0A` +
    `💵 *Net Payout Balance Due:* *₹${payable}*%0A%0A` +
    `Payout transfer has been scheduled. For queries, reply to this message.`;

  window.open(`https://wa.me/?text=${message}`, '_blank');
}

// -------------------------------------------------------------
// TOAST HELPER
// -------------------------------------------------------------
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : type === 'warning' ? 'âš ï¸' : 'â„¹ï¸'}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// -------------------------------------------------------------
// CSV EXPORT ENGINE
// -------------------------------------------------------------
function exportOrdersCSV(vendorId = null) {
  let orders = appData.orders;
  let filenamePrefix = 'bhookit-all-orders';

  if (vendorId !== null) {
    orders = orders.filter(o => o.restaurantId === Number(vendorId));
    const rest = appData.restaurants.find(r => r.id === Number(vendorId));
    filenamePrefix = `bhookit-${(rest?.name || 'vendor').toLowerCase().replace(/\s+/g, '-')}-orders`;
  }

  if (!orders.length) {
    showToast('No orders found to export', 'warning');
    return;
  }

  const headers = [
    'Order ID',
    'Invoice No',
    'Date',
    'Time',
    'Customer Name',
    'Customer Phone',
    'Delivery Address',
    'Restaurant',
    'Items Summary',
    'Subtotal (INR)',
    'GST 5% (INR)',
    'Delivery Fee (INR)',
    'Discount (INR)',
    'Final Paid (INR)',
    'Payment Mode',
    'Payment Status',
    'Order Status',
    'Delivery Partner',
    'Food Rating',
    'Rider Rating'
  ];

  const rows = orders.map(o => {
    const d = new Date(o.createdAt);
    const dateStr = d.toLocaleDateString('en-IN');
    const timeStr = d.toLocaleTimeString('en-IN');
    const itemsSummary = (o.items || []).map(i => `${i.qty}x ${i.name} (Rs.${i.price})`).join('; ');
    const foodRating = o.review ? o.review.foodRating : 'Unrated';
    const riderRating = o.review ? o.review.riderRating : 'Unrated';

    return [
      `"${o.id}"`,
      `"${o.invoiceNo || ''}"`,
      `"${dateStr}"`,
      `"${timeStr}"`,
      `"${(o.customer?.name || '').replace(/"/g, '""')}"`,
      `"${(o.customer?.phone || '').replace(/"/g, '""')}"`,
      `"${(o.customer?.address || '').replace(/"/g, '""')}"`,
      `"${(o.restaurantName || '').replace(/"/g, '""')}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      o.subtotal || 0,
      o.taxes || 0,
      o.deliveryFee || 0,
      o.discount || 0,
      o.total || 0,
      `"${o.payment || 'COD'}"`,
      `"${o.paymentStatus || 'Pending'}"`,
      `"${o.status || 'New'}"`,
      `"${(o.deliveryBoy || 'Unassigned').replace(/"/g, '""')}"`,
      `"${foodRating}"`,
      `"${riderRating}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  playSound('order_placed');
  showToast(`✅ Exported ${orders.length} orders to CSV successfully!`, 'success');
}

function exportSettlementCSV() {
  const headers = [
    'Restaurant ID',
    'Restaurant Name',
    'FSSAI License',
    'GSTIN',
    'Contact Phone',
    'Total Orders',
    'Gross GMV (INR)',
    'Commission Rate (%)',
    'Platform Commission (INR)',
    'Net Payout Due (INR)',
    'Settlement Status'
  ];

  const rows = appData.restaurants.map(r => {
    const orders = appData.orders.filter(o => o.restaurantId === r.id && o.status !== 'Cancelled');
    const gmv = orders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
    const commRate = r.commissionRate || 10;
    const commission = Math.round(gmv * (commRate / 100));
    const netPayout = gmv - commission;

    return [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.fssai || '11524012000341'}"`,
      `"${r.gstin || '27AAACF1234F1Z5'}"`,
      `"${r.phone || ''}"`,
      orders.length,
      gmv,
      commRate,
      commission,
      netPayout,
      orders.length > 0 ? '"Ready for Transfer"' : '"Nil Balance"'
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `bhookit-vendor-settlement-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  playSound('order_placed');
  showToast('✅ Financial Settlement Ledger exported to CSV!', 'success');
}

// -------------------------------------------------------------
// PWA INSTALLATION ENGINE
// -------------------------------------------------------------
let deferredPwaPrompt = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('ServiceWorker registered:', reg.scope))
      .catch(err => console.log('ServiceWorker registration error:', err));
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPwaPrompt = e;
  const pwaPill = document.getElementById('pwaInstallPill');
  const pwaBanner = document.getElementById('pwaBanner');
  if (pwaPill) pwaPill.style.display = 'inline-block';
  if (pwaBanner && !sessionStorage.getItem('bhookit_pwa_dismissed')) {
    pwaBanner.classList.remove('hidden');
  }
});

function triggerPwaInstall() {
  if (deferredPwaPrompt) {
    deferredPwaPrompt.prompt();
    deferredPwaPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        showToast('🎉 BhookIt App installed successfully!', 'success');
        dismissPwaBanner();
      }
      deferredPwaPrompt = null;
    });
  } else {
    showToast('To install BhookIt: tap browser menu (⋮) and choose "Add to Home screen" or "Install" 📲', 'info');
  }
}

function dismissPwaBanner() {
  const pwaBanner = document.getElementById('pwaBanner');
  if (pwaBanner) pwaBanner.classList.add('hidden');
  sessionStorage.setItem('bhookit_pwa_dismissed', 'true');
}

// -------------------------------------------------------------
// CUSTOMER POST-DELIVERY RATING ENGINE
// -------------------------------------------------------------
let currentReviewFoodRating = 5;
let currentReviewRiderRating = 5;

function openRatingModal(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;

  document.getElementById('ratingOrderId').value = order.id;
  document.getElementById('ratingRestaurantName').textContent = order.restaurantName;
  document.getElementById('ratingCommentInput').value = '';
  setStarRating('food', 5);
  setStarRating('rider', 5);
  openModal('ratingModal');
}

function setStarRating(type, rating) {
  if (type === 'food') {
    currentReviewFoodRating = rating;
    const box = document.getElementById('foodStarRatingBox');
    if (box) {
      const stars = box.querySelectorAll('.star-btn');
      stars.forEach((btn, i) => {
        btn.classList.toggle('active', i < rating);
      });
      document.getElementById('foodRatingVal').textContent = `${rating}.0`;
    }
  } else {
    currentReviewRiderRating = rating;
    const box = document.getElementById('riderStarRatingBox');
    if (box) {
      const stars = box.querySelectorAll('.star-btn');
      stars.forEach((btn, i) => {
        btn.classList.toggle('active', i < rating);
      });
      document.getElementById('riderRatingVal').textContent = `${rating}.0`;
    }
  }
  playSound('rating');
}

function toggleFeedbackChip(el) {
  el.classList.toggle('selected');
}

function submitOrderReview() {
  const orderId = document.getElementById('ratingOrderId').value;
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;

  const selectedChips = Array.from(document.querySelectorAll('#feedbackChips .feedback-chip.selected')).map(c => c.textContent.trim());
  const comment = (document.getElementById('ratingCommentInput').value || '').trim();

  order.review = {
    foodRating: currentReviewFoodRating,
    riderRating: currentReviewRiderRating,
    tags: selectedChips,
    comment: comment,
    createdAt: new Date().toISOString()
  };

  // Dynamically recalculate restaurant rating
  const rest = appData.restaurants.find(r => r.id === order.restaurantId);
  if (rest) {
    const prevRating = rest.rating || 4.5;
    rest.rating = Math.round(((prevRating * 10) + currentReviewFoodRating) / 11 * 10) / 10;
  }

  saveState();
  closeModal('ratingModal');
  playSound('delivered');
  showToast('⭐ Thank you for your review! Your rating has been recorded.', 'success');
  renderOrdersView();
  renderTrackingView();
}

// -------------------------------------------------------------
// DARK / LIGHT THEME ENGINE
// -------------------------------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem('bhookit_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('bhookit_theme', next);
  updateThemeButton(next);
  showToast(`Switched to ${next === 'dark' ? '🌙 Dark Mode' : 'â˜€ï¸ Light Mode'}`, 'info');
  playSound('chime');
}

function updateThemeButton(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = theme === 'dark' ? 'â˜€ï¸ Light' : '🌙 Dark';
  const btnNav = document.getElementById('themeToggleBtnNav');
  if (btnNav) {
    btnNav.innerHTML = theme === 'dark' ? '<span>â˜€ï¸</span> <span>Light</span>' : '<span>🌙</span> <span>Dark</span>';
  }
}

// -------------------------------------------------------------
// SAVED ADDRESSES ENGINE
// -------------------------------------------------------------
let selectedNewAddressType = 'Home';

function renderSavedAddresses() {
  const container = document.getElementById('savedAddressesContainer');
  if (!container) return;

  const addresses = appData.currentUser?.savedAddresses || [];
  if (!addresses.length) {
    container.innerHTML = '<p style="font-size: 12px; color: var(--text-muted); padding: 6px 0;">No saved addresses yet. Click "+ Add New Address" above.</p>';
    return;
  }

  container.innerHTML = addresses.map((addr, idx) => `
    <div class="address-card ${addr.isDefault ? 'selected' : ''}" onclick="selectSavedAddress(${idx})">
      <div class="address-card-header">
        <span>${addr.label}</span>
        ${addr.isDefault ? '<span style="color: var(--accent); font-size: 11px;">🟢 Selected</span>' : ''}
      </div>
      <div class="address-card-text">${addr.address}</div>
    </div>
  `).join('');
}

function selectSavedAddress(index) {
  const addresses = appData.currentUser?.savedAddresses || [];
  addresses.forEach((a, i) => a.isDefault = (i === index));
  saveState();
  renderSavedAddresses();
  const addrInput = document.getElementById('custAddress');
  if (addrInput && addresses[index]) {
    addrInput.value = addresses[index].address;
    playSound('rating');
  }
}

function openAddressModal() {
  selectedNewAddressType = 'Home';
  selectAddressType('Home');
  const flatInput = document.getElementById('newAddrFlat');
  const streetInput = document.getElementById('newAddrStreet');
  if (flatInput) flatInput.value = '';
  if (streetInput) streetInput.value = '';
  openModal('newAddressModal');
}

function selectAddressType(type) {
  selectedNewAddressType = type;
  ['Home', 'Work', 'Other'].forEach(t => {
    const el = document.getElementById(`addrType${t}`);
    if (el) el.classList.toggle('active', t === type);
  });
}

function saveNewAddress() {
  const flat = document.getElementById('newAddrFlat')?.value.trim();
  const street = document.getElementById('newAddrStreet')?.value.trim();

  if (!street) {
    showToast('Please enter complete street address & landmark', 'warning');
    return;
  }

  const fullAddr = `${flat ? flat + ', ' : ''}${street}`;
  const icon = selectedNewAddressType === 'Home' ? 'ðŸ ' : selectedNewAddressType === 'Work' ? 'ðŸ¢' : '📍';
  const newEntry = {
    id: 'addr_' + Date.now(),
    type: selectedNewAddressType,
    label: `${icon} ${selectedNewAddressType}`,
    address: fullAddr,
    isDefault: true
  };

  if (!appData.currentUser.savedAddresses) appData.currentUser.savedAddresses = [];
  appData.currentUser.savedAddresses.forEach(a => a.isDefault = false);
  appData.currentUser.savedAddresses.push(newEntry);
  appData.currentUser.address = fullAddr;
  saveState();

  closeModal('newAddressModal');
  renderSavedAddresses();
  const addrInput = document.getElementById('custAddress');
  if (addrInput) addrInput.value = fullAddr;

  playSound('order_placed');
  showToast(`✅ Saved and selected ${newEntry.label}`, 'success');
}

// -------------------------------------------------------------
// NOTIFICATIONS DRAWER ENGINE
// -------------------------------------------------------------
function toggleNotificationDrawer() {
  const drawer = document.getElementById('notificationDrawer');
  if (!drawer) return;
  drawer.classList.toggle('hidden');
  if (!drawer.classList.contains('hidden')) {
    renderNotifications();
  }
}

function renderNotifications() {
  const listEl = document.getElementById('notificationList');
  const badge = document.getElementById('notifBadge');
  if (!listEl) return;

  const notifs = appData.notifications || [];
  const unreadCount = notifs.filter(n => n.unread).length;
  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }

  if (!notifs.length) {
    listEl.innerHTML = '<p style="font-size: 12px; color: var(--text-muted); padding: 18px; text-align: center;">No activity updates.</p>';
    return;
  }

  listEl.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="markNotificationRead('${n.id}')">
      <span class="notif-icon">${n.icon}</span>
      <div style="flex: 1;">
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

function markNotificationRead(notifId) {
  const notif = (appData.notifications || []).find(n => n.id === notifId);
  if (notif) notif.unread = false;
  saveState();
  renderNotifications();
}

function markAllNotificationsRead() {
  (appData.notifications || []).forEach(n => n.unread = false);
  saveState();
  renderNotifications();
  showToast('All notifications marked as read', 'info');
}

function pushNotification(icon, text) {
  if (!appData.notifications) appData.notifications = [];
  appData.notifications.unshift({
    id: 'notif_' + Date.now(),
    icon: icon,
    text: text,
    time: 'Just now',
    unread: true
  });
  if (appData.notifications.length > 20) appData.notifications.pop();
  saveState();
  renderNotifications();
}

// -------------------------------------------------------------
// LIVE ORDER SUPPORT ASSISTANT
// -------------------------------------------------------------
function openSupportChat() {
  openModal('supportChatModal');
}

function handleSupportQuery(topic) {
  const history = document.getElementById('supportChatHistory');
  if (!history) return;

  const activeOrder = appData.orders.find(o => o.id === currentTrackedOrderId) || appData.orders[0];

  let userText = '';
  let botReply = '';

  if (topic === 'eta') {
    userText = 'Where is my courier right now?';
    if (!activeOrder || activeOrder.status === 'Delivered') {
      botReply = 'Your meal has already been delivered! Please enjoy your food and remember to leave a review.';
    } else {
      botReply = `Order #${activeOrder.id} is currently *${activeOrder.status}* with ${activeOrder.deliveryBoy || 'Vikram Rider'}. ETA is ~${activeOrder.etaMinutes || 12} mins!`;
    }
  } else if (topic === 'rider') {
    userText = 'How do I call my courier partner?';
    botReply = `Assigned rider: *${activeOrder?.deliveryBoy || 'Vikram Rider'}* (📞 ${activeOrder?.riderPhone || '+91 9988771122'}). Tap "WhatsApp Receipt" to connect directly.`;
  } else if (topic === 'kitchen') {
    userText = 'Please inform the kitchen: make it mild spicy.';
    botReply = `Your special kitchen request for ${activeOrder?.restaurantName || 'the kitchen'} has been recorded: "Mild spice & hygienic packaging". ðŸ‘¨â€ðŸ³`;
  } else if (topic === 'bill') {
    userText = 'Can I get my GST Tax Invoice?';
    botReply = `Yes! Click the 📄 "GST Invoice" button on your order card to view or print the official tax invoice with HSN and GST breakdowns.`;
  }

  appendChatMessage(userText, 'user');
  setTimeout(() => {
    appendChatMessage(botReply, 'bot');
    playSound('chime');
  }, 400);
}

function sendSupportMessage() {
  const input = document.getElementById('supportChatInput');
  const text = (input?.value || '').trim();
  if (!text) return;

  appendChatMessage(text, 'user');
  input.value = '';

  setTimeout(() => {
    appendChatMessage(`Thank you for reaching out! Our Sakoli dispatch center has received your note: "${text}". A concierge is monitoring your order.`, 'bot');
    playSound('chime');
  }, 500);
}

function appendChatMessage(text, sender) {
  const history = document.getElementById('supportChatHistory');
  if (!history) return;
  const msgEl = document.createElement('div');
  msgEl.className = `chat-msg ${sender}`;
  msgEl.textContent = text;
  history.appendChild(msgEl);
  history.scrollTop = history.scrollHeight;
}

// -------------------------------------------------------------
// DELIVERY OTP VERIFICATION
// -------------------------------------------------------------
function verifyRiderDeliveryOtp(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;
  const inputEl = document.getElementById(`riderOtpInput_${orderId}`);
  const enteredOtp = (inputEl?.value || '').trim();

  if (!enteredOtp) {
    showToast('Please enter the 4-digit OTP provided by customer', 'warning');
    return;
  }

  if (enteredOtp !== order.deliveryOtp) {
    showToast('âŒ Invalid OTP! Please check the code displayed on customer screen.', 'danger');
    return;
  }

  riderCompleteDelivery(orderId);
}



// -------------------------------------------------------------
// QUICK ROLE SWITCHER
// -------------------------------------------------------------
function quickRole(role, vendorId = 1) {
  currentRole = role;
  document.querySelectorAll('.role-pill').forEach(el => el.classList.remove('active'));
  event?.target?.classList.add('active');

  if (role === 'restaurant') {
    currentActiveVendorId = vendorId;
    const vendorSelect = document.getElementById('vendorSelect');
    if (vendorSelect) vendorSelect.value = vendorId;
  }

  show(role);
  showToast(`Switched view to ${role.toUpperCase()} mode`, 'info');
}

// -------------------------------------------------------------
// PANEL NAVIGATION
// -------------------------------------------------------------
function show(panelId) {
  document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
  const activePanel = document.getElementById(panelId);
  if (activePanel) {
    activePanel.classList.remove('hidden');
    // Scroll to the top of the page so the user sees the new section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('.nav-item-btn').forEach(btn => btn.classList.remove('active'));
  const navMap = {
    customer: 'navCustomer',
    orders: 'navOrders',
    track: 'navTrack',
    restaurant: 'navRestaurant',
    delivery: 'navDelivery',
    admin: 'navAdmin'
  };
  if (navMap[panelId]) {
    const navBtn = document.getElementById(navMap[panelId]);
    if (navBtn) navBtn.classList.add('active');
  }

  // Update mobile bottom nav buttons active state
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => btn.classList.remove('active'));
  const mobNavMap = {
    customer: 'mobNavCustomer',
    orders: 'mobNavOrders',
    track: 'mobNavTrack',
    restaurant: 'mobNavRestaurant',
    cart: 'mobNavCart'
  };
  if (mobNavMap[panelId]) {
    const mobBtn = document.getElementById(mobNavMap[panelId]);
    if (mobBtn) mobBtn.classList.add('active');
  }

  // Auto scroll to top smoothly on view change
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (panelId === 'customer') renderCustomerView();
  if (panelId === 'cart') renderCartView();
  if (panelId === 'orders') renderOrdersView();
  if (panelId === 'track') renderTrackingView();
  if (panelId === 'restaurant') renderRestaurantView();
  if (panelId === 'delivery') renderDeliveryView();
  if (panelId === 'admin') renderAdminView();
}

// -------------------------------------------------------------
// 1. CUSTOMER PORTAL & SEARCH/FILTER ENGINE
// -------------------------------------------------------------
function togglePureVegFilter() {
  isPureVegOnly = !isPureVegOnly;
  const btn = document.getElementById('pureVegFilterBtn');
  if (btn) btn.classList.toggle('active', isPureVegOnly);
  showToast(isPureVegOnly ? '🌱 Pure Veg Filter Applied' : 'Showing All Diets (Veg & Non-Veg)', 'info');
  playSound('chime');
  renderCustomerView();
}

function applySorting(mode) {
  currentSortMode = mode;
  renderCustomerView();
  playSound('rating');
}

function toggleFavoriteDish(restId, foodId, event) {
  if (event) event.stopPropagation();
  if (!appData.currentUser) {
    showToast('Please login to save favorite dishes', 'warning');
    return;
  }

  if (!Array.isArray(appData.currentUser.favorites)) {
    appData.currentUser.favorites = [];
  }

  const idx = appData.currentUser.favorites.indexOf(foodId);
  const isAdding = idx === -1;

  if (isAdding) {
    appData.currentUser.favorites.push(foodId);
    showToast('❤️ Added to your Favorites!', 'success');
  } else {
    appData.currentUser.favorites.splice(idx, 1);
    showToast('Removed from Favorites', 'info');
  }

  saveState();
  playSound('rating');
  renderCustomerView();
}

function renderCustomerView() {
  renderCombosCarousel();
  updateVipBannerUI();

  const query = (document.getElementById('foodSearchInput')?.value || '').trim().toLowerCase();
  const grid = document.getElementById('restaurantGrid');
  if (!grid) return;

  grid.innerHTML = '';
  let visibleCount = 0;

  const favList = appData.currentUser?.favorites || [];
  const favBadge = document.getElementById('favCountBadge');
  if (favBadge) favBadge.textContent = favList.length;

  let restList = appData.restaurants.filter(r => r.approved);

  // Sorting at Restaurant level
  if (currentSortMode === 'rating') {
    restList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (currentSortMode === 'prepTime') {
    restList.sort((a, b) => parseInt(a.prepTime || '30') - parseInt(b.prepTime || '30'));
  }

  restList.forEach(r => {
    let foods = [...r.foods];

    // Filter by Pure Veg
    if (isPureVegOnly) {
      foods = foods.filter(f => f.veg);
    }

    // Filter by Category or Favorites
    if (selectedCategory === 'Favorites') {
      foods = foods.filter(f => favList.includes(f.id));
    } else if (selectedCategory !== 'All') {
      foods = foods.filter(f => f.category === selectedCategory);
    }

    // Filter by Search Query
    if (query) {
      foods = foods.filter(f => 
        f.name.toLowerCase().includes(query) || 
        r.name.toLowerCase().includes(query) || 
        f.category.toLowerCase().includes(query)
      );
    }

    // Price Sorting on food items
    if (currentSortMode === 'priceLow') {
      foods.sort((a, b) => a.price - b.price);
    } else if (currentSortMode === 'priceHigh') {
      foods.sort((a, b) => b.price - a.price);
    }

    if (!foods.length) return;
    visibleCount++;

    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.innerHTML = `
      <div class="restaurant-banner-box">
        <img src="${r.coverImg}" class="restaurant-banner-img" alt="${r.name}">
        <span class="restaurant-status-tag ${r.open ? 'open' : ''}">${r.open ? '🟢 Open Now' : '🟢 Closed'}</span>
        <span class="restaurant-rating-tag">⭐ ${r.rating}</span>
      </div>
      <div class="restaurant-info">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
          <div>
            <h3 class="restaurant-name">${r.name}</h3>
            <div class="restaurant-meta" style="margin-bottom: 6px;">
              <span>⏱️  ${r.prepTime}</span>
              <span>•</span>
              <span>ðŸ·ï¸ ${r.category}</span>
              <span>•</span>
              <span>Min ₹${r.minOrder}</span>
            </div>
          </div>
          <button class="btn-book-table" onclick="openTableBookingModal(${r.id})" title="Book a dine-in table at ${r.name}">
            ${t('bookTable')}
          </button>
        </div>

        <div style="display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap;">
          <span class="fssai-pill">🛡️ FSSAI #${r.fssai || '11524012000341'}</span>
          <span class="hygiene-badge">⭐ Hygiene ${r.hygiene || '4.8'}</span>
        </div>

        <div class="food-list">
          ${foods.map(f => {
            const isFav = favList.includes(f.id);
            return `
              <div class="food-row">
                <div class="food-details">
                  <span class="food-title">
                    <span class="${f.veg ? 'veg-indicator' : 'nonveg-indicator'}"></span>
                    ${f.name}
                  </span>
                  <span class="food-price">₹${f.price}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <button class="btn-fav-dish ${isFav ? 'active' : ''}" onclick="toggleFavoriteDish(${r.id}, ${f.id}, event)" title="${isFav ? 'Remove Favorite' : 'Add to Favorites'}">
                    ${isFav ? '❤️' : '🤍'}
                  </button>
                  <button class="btn-add-food" onclick="openCustomizeModal(${r.id}, ${f.id})" ${!r.open || !f.inStock ? 'disabled style="opacity:0.5;"' : ''}>
                    ${!f.inStock ? t('soldOut') : t('addToOrder')}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  const countBadge = document.getElementById('restaurantCountBadge');
  if (countBadge) {
    if (selectedCategory === 'Favorites' && visibleCount === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border);">
          <div style="font-size: 48px; margin-bottom: 8px;">❤️</div>
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 6px;">No Favorites Saved Yet</h3>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">Tap the heart (🤍) icon on any dish to save it here for fast ordering!</p>
          <button class="btn-primary" onclick="filterCategory('All')" style="width: auto; padding: 8px 18px;">Browse All Dishes</button>
        </div>
      `;
      countBadge.textContent = '0 favorites saved';
    } else {
      countBadge.textContent = `Showing ${visibleCount} available restaurants`;
    }
  }
}

function filterCategory(cat) {
  selectedCategory = cat;
  document.querySelectorAll('.category-pill').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.includes(cat));
  });
  renderCustomerView();
}

function resetFilters() {
  const search = document.getElementById('foodSearchInput');
  if (search) search.value = '';
  isPureVegOnly = false;
  currentSortMode = 'default';
  const vegBtn = document.getElementById('pureVegFilterBtn');
  if (vegBtn) vegBtn.classList.remove('active');
  const sortSel = document.getElementById('foodSortSelect');
  if (sortSel) sortSel.value = 'default';
  selectedCategory = 'All';
  filterCategory('All');
}

let selectedAllergyTags = [];

function toggleAllergyChip(btn) {
  const tag = btn.textContent.trim();
  const idx = selectedAllergyTags.indexOf(tag);
  if (idx > -1) {
    selectedAllergyTags.splice(idx, 1);
    btn.classList.remove('selected');
  } else {
    selectedAllergyTags.push(tag);
    btn.classList.add('selected');
  }
  playSound('chime');
}

function openCustomizeModal(restId, foodId) {
  const rest = appData.restaurants.find(r => r.id === restId);
  const food = rest?.foods.find(f => f.id === foodId);
  if (!rest || !food) return;

  pendingCustomizeDish = { rest, food };
  document.getElementById('customizerFoodName').textContent = food.name;
  document.getElementById('customizerRestaurantName').textContent = `From ${rest.name} • ₹${food.price}`;

  document.getElementById('addonExtraCheese').checked = false;
  document.getElementById('addonSpicyDip').checked = false;
  document.getElementById('addonCoke').checked = false;

  selectedAllergyTags = [];
  document.querySelectorAll('.allergy-chip').forEach(c => c.classList.remove('selected'));
  const chefNotes = document.getElementById('customizerChefNotes');
  if (chefNotes) chefNotes.value = '';

  openModal('foodCustomizerModal');
}

function confirmAddToCart() {
  if (!pendingCustomizeDish) return;
  const { rest, food } = pendingCustomizeDish;

  const portionEl = document.querySelector('input[name="portionSize"]:checked');
  const portion = portionEl ? portionEl.value : 'Regular';
  const portionExtra = portion.includes('+₹50') ? 50 : 0;

  const addons = [portion];
  let extraCost = portionExtra;

  const cheese = document.getElementById('addonExtraCheese');
  if (cheese?.checked) { addons.push('Extra Cheese (+₹30)'); extraCost += 30; }

  const dip = document.getElementById('addonSpicyDip');
  if (dip?.checked) { addons.push('Peri-Peri Dip (+₹20)'); extraCost += 20; }

  const coke = document.getElementById('addonCoke');
  if (coke?.checked) { addons.push('Coke Can (+₹35)'); extraCost += 35; }

  const chefNotes = document.getElementById('customizerChefNotes')?.value.trim() || '';
  const allergies = [...selectedAllergyTags];

  const unitPrice = food.price + extraCost;

  const existing = currentCart.find(i => 
    i.foodId === food.id && 
    JSON.stringify(i.addons) === JSON.stringify(addons) &&
    JSON.stringify(i.allergies || []) === JSON.stringify(allergies) &&
    (i.chefNotes || '') === chefNotes
  );
  if (existing) {
    existing.qty++;
  } else {
    currentCart.push({
      restaurantId: rest.id,
      restaurantName: rest.name,
      foodId: food.id,
      name: food.name,
      basePrice: food.price,
      price: unitPrice,
      qty: 1,
      addons,
      allergies,
      chefNotes
    });
  }

  closeModal('foodCustomizerModal');
  updateCartBadge();
  playSound('chime');
  showToast(`Added ${food.name} to cart!`, 'success');
}

function updateCartBadge() {
  const count = currentCart.reduce((sum, item) => sum + item.qty, 0);
  const badge1 = document.getElementById('cartCountBadge');
  const badge2 = document.getElementById('mobileCartCount');
  const badge3 = document.getElementById('mobCartCountBadge');
  if (badge1) badge1.textContent = count;
  if (badge2) badge2.textContent = count;
  if (badge3) badge3.textContent = count;
}

// -------------------------------------------------------------
// 2. CART & CHECKOUT (MULTI-VENDOR FOOD COURT DISPATCH)
// -------------------------------------------------------------
function renderCartView() {
  const container = document.getElementById('cartItemsList');
  if (!container) return;

  if (!currentCart.length) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <div style="font-size: 50px; margin-bottom: 10px;">🛒</div>
        <h4 style="font-size: 18px; margin-bottom: 6px; color: var(--text-main);">${t('emptyCart')}</h4>
        <p style="font-size: 14px; margin-bottom: 16px;">Explore our top restaurants and add delicious dishes.</p>
        <button class="btn-primary" onclick="show('customer')" style="width: auto; padding: 10px 24px;">${t('browseRest')}</button>
      </div>
    `;
    updateBillTotals();
    return;
  }

  // Group items by vendor for Multi-Restaurant Split Dispatch
  const vendorGroups = {};
  currentCart.forEach((item, idx) => {
    const vId = item.restaurantId || 1;
    if (!vendorGroups[vId]) {
      vendorGroups[vId] = {
        name: item.restaurantName,
        items: []
      };
    }
    vendorGroups[vId].items.push({ item, idx });
  });

  const isMultiVendor = Object.keys(vendorGroups).length > 1;

  container.innerHTML = Object.keys(vendorGroups).map(vId => {
    const group = vendorGroups[vId];
    return `
      <div class="cart-vendor-group">
        <div class="cart-vendor-header">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span>ðŸª ${group.name}</span>
            ${isMultiVendor ? `<span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:10px;">Multi-Vendor Hub</span>` : ''}
          </div>
          <span style="font-size: 11px; color: var(--text-muted);">${group.items.length} ${group.items.length === 1 ? 'Item' : 'Items'}</span>
        </div>
        ${group.items.map(({ item, idx }) => `
          <div class="cart-item-row" style="border: none; border-bottom: 1px solid var(--border); border-radius: 0;">
            <div class="cart-item-left">
              <span class="cart-item-name">${item.name}</span>
              <span class="cart-item-addons">${item.addons.join(' • ')}</span>
              ${item.allergies && item.allergies.length ? `
                <div style="margin-top: 2px;">
                  <span style="font-size: 10px; font-weight: 700; color: #b91c1c; background: #fee2e2; padding: 1px 6px; border-radius: 4px;">âš ï¸ ${item.allergies.join(', ')}</span>
                </div>
              ` : ''}
              ${item.chefNotes ? `
                <div style="font-size: 11px; color: var(--text-muted); font-style: italic; margin-top: 2px;">
                  ðŸ‘¨â€ðŸ³ Note: "${item.chefNotes}"
                </div>
              ` : ''}
              <span style="font-weight: 700; font-size: 13px; margin-top: 4px; color: var(--text-main);">₹${item.price} each</span>
            </div>
            <div class="cart-qty-controls">
              <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');

  const nameInput = document.getElementById('custName');
  const phoneInput = document.getElementById('custPhone');
  const addrInput = document.getElementById('custAddress');
  if (nameInput && !nameInput.value) nameInput.value = appData.currentUser.name;
  if (phoneInput && !phoneInput.value) phoneInput.value = appData.currentUser.phone;
  if (addrInput && !addrInput.value) addrInput.value = appData.currentUser.address;

  renderSavedAddresses();
  updateBillTotals();
}

function changeQty(index, delta) {
  currentCart[index].qty += delta;
  if (currentCart[index].qty <= 0) {
    currentCart.splice(index, 1);
  }
  updateCartBadge();
  renderCartView();
}

// -------------------------------------------------------------
// LOYALTY WALLET ENGINE
// -------------------------------------------------------------
function updateWalletUI() {
  const balance = appData.currentUser ? (appData.currentUser.walletBalance || 0) : 0;
  const navBal = document.getElementById('navWalletBalance');
  const modalBal = document.getElementById('walletModalBalance');
  const cartBal = document.getElementById('cartWalletBalance');
  if (navBal) navBal.textContent = balance;
  if (modalBal) modalBal.textContent = balance;
  if (cartBal) cartBal.textContent = balance;

  const ledgerList = document.getElementById('walletLedgerList');
  if (ledgerList && appData.currentUser) {
    const ledger = appData.currentUser.walletLedger || [];
    if (!ledger.length) {
      ledgerList.innerHTML = '<p style="font-size:12px; color:var(--text-muted); text-align:center; padding:12px;">No activity yet. Earn cashback on every order!</p>';
    } else {
      ledgerList.innerHTML = ledger.slice(0, 10).map(item => `
        <div class="wallet-ledger-item">
          <div>
            <div class="wallet-ledger-title">${item.title}</div>
            <div class="wallet-ledger-date">${item.date}</div>
          </div>
          <span class="wallet-amount ${item.type}">${item.type === 'credit' ? '+' : '-'}₹${item.amount}</span>
        </div>
      `).join('');
    }
  }
}

function openWalletModal() {
  updateWalletUI();
  openModal('walletModal');
}

function selectTopupAmount(amt) {
  const input = document.getElementById('customTopupInput');
  if (input) input.value = amt;
  document.querySelectorAll('.topup-chip').forEach(c => {
    c.classList.toggle('selected', c.textContent.includes(amt.toString()));
  });
}

function processWalletTopup() {
  const input = document.getElementById('customTopupInput');
  const amt = parseInt(input?.value || '0', 10);
  if (isNaN(amt) || amt < 10) {
    showToast('Please enter an amount of at least ₹10 to recharge', 'warning');
    return;
  }

  if (!appData.currentUser) {
    showToast('Please login to manage your wallet', 'warning');
    return;
  }

  appData.currentUser.walletBalance = (appData.currentUser.walletBalance || 0) + amt;
  if (!Array.isArray(appData.currentUser.walletLedger)) {
    appData.currentUser.walletLedger = [];
  }

  appData.currentUser.walletLedger.unshift({
    id: 'tx_' + Date.now(),
    type: 'credit',
    title: '⚡ Instant UPI Wallet Top-up',
    amount: amt,
    date: new Date().toLocaleDateString('en-IN')
  });

  saveState();
  updateWalletUI();
  updateBillTotals();
  playSound('delivered');
  showToast(`🎉 ₹${amt} added to your BhookIt Wallet successfully!`, 'success');
}

function toggleWalletRedemption() {
  const chk = document.getElementById('redeemWalletCheck');
  isWalletRedeemedInCart = chk?.checked || false;
  const tag = document.getElementById('walletAppliedTag');
  if (tag) tag.style.display = isWalletRedeemedInCart ? 'inline-block' : 'none';
  if (isWalletRedeemedInCart) playSound('chime');
  updateBillTotals();
}

// -------------------------------------------------------------
// PHASE 13: DELIVERY PARTNER TIPPING ENGINE
// -------------------------------------------------------------
let currentDriverTip = 0;

function selectDriverTip(amt, btnEl) {
  currentDriverTip = amt;
  const chips = document.querySelectorAll('.tip-chip');
  chips.forEach(c => c.classList.remove('selected'));
  if (btnEl) btnEl.classList.add('selected');
  playSound('chime');
  updateBillTotals();
  if (amt > 0) {
    showToast(`ðŸ‘ Added ₹${amt} tip for your delivery courier!`, 'success');
  }
}

let currentServiceMode = 'delivery';

function setServiceMode(mode) {
  currentServiceMode = mode;
  const btnDel = document.getElementById('btnModeDelivery');
  const btnDine = document.getElementById('btnModeDineIn');
  const tableBox = document.getElementById('dineInTableBox');
  const addrBox = document.getElementById('addressSectionBox');
  const schedBox = document.getElementById('deliveryScheduleContainer');

  if (btnDel) btnDel.classList.toggle('active', mode === 'delivery');
  if (btnDine) btnDine.classList.toggle('active', mode === 'dinein');

  if (tableBox) tableBox.classList.toggle('hidden', mode !== 'dinein');
  if (addrBox) addrBox.classList.toggle('hidden', mode === 'dinein');
  if (schedBox) schedBox.classList.toggle('hidden', mode === 'dinein');

  playSound('chime');
  updateBillTotals();
  if (mode === 'dinein') {
    showToast('ðŸ½ï¸ Dine-In Table Mode Active: Delivery Fee Waived (₹0)!', 'success');
  } else {
    showToast('🛵 Doorstep Delivery Mode Selected', 'info');
  }
}

function updateBillTotals() {
  const subtotal = currentCart.reduce((s, i) => s + (i.price * i.qty), 0);
  const isVip = appData.currentUser && appData.currentUser.isVip;
  const isDineIn = currentServiceMode === 'dinein';
  const isFreeDelivery = (isVip && subtotal >= 199) || isDineIn;
  let deliveryFee = (currentCart.length && !isFreeDelivery) ? appData.settings.deliveryBase : 0;
  if (isDineIn) deliveryFee = 0;

  // Phase 12: Dynamic Surge Pricing Calculation
  const surge = appData.surgeSettings || { rainSurge: false, rainFee: 25, peakSurge: false, peakMultiplier: 1.25, lateNightSurge: false, lateNightFee: 20 };
  let surgeFee = 0;
  if (currentCart.length && !isDineIn) {
    if (surge.peakSurge && deliveryFee > 0) {
      const surgedDel = Math.round(deliveryFee * surge.peakMultiplier);
      surgeFee += (surgedDel - deliveryFee);
    }
    if (surge.rainSurge) surgeFee += surge.rainFee;
    if (surge.lateNightSurge) surgeFee += surge.lateNightFee;
  }

  // Phase 13: Delivery Partner Tip
  const tip = isDineIn ? 0 : (currentDriverTip || 0);

  const taxes = Math.round(subtotal * (appData.settings.gstRate / 100));
  const subAfterDiscount = Math.max(0, subtotal + deliveryFee + surgeFee + tip + taxes - appliedDiscount);

  let walletDeduction = 0;
  if (isWalletRedeemedInCart && appData.currentUser) {
    const available = appData.currentUser.walletBalance || 0;
    walletDeduction = Math.min(available, subAfterDiscount);
  }

  const grandTotal = Math.max(0, subAfterDiscount - walletDeduction);

  const elSub = document.getElementById('billSubtotal');
  const elDel = document.getElementById('billDeliveryFee');
  const elSurgeRow = document.getElementById('billSurgeRow');
  const elSurgeFee = document.getElementById('billSurgeFee');
  const elSurgeAlert = document.getElementById('cartSurgeAlert');
  const elTipRow = document.getElementById('billTipRow');
  const elTipFee = document.getElementById('billDriverTip');
  const elTax = document.getElementById('billTaxes');
  const elDis = document.getElementById('billDiscount');
  const elWal = document.getElementById('billWalletDeduction');
  const elWalRow = document.getElementById('billWalletRow');
  const elTot = document.getElementById('billGrandTotal');
  const cartWalBal = document.getElementById('cartWalletBalance');

  if (elSub) elSub.textContent = subtotal;
  if (elDel) {
    if (isDineIn) {
      elDel.innerHTML = '<span style="color:#059669; font-weight:800;">₹0 (Dine-In Table)</span>';
    } else if (isFreeDelivery) {
      elDel.innerHTML = '<span style="color:#059669; font-weight:800;">₹0 (VIP Free)</span>';
    } else {
      elDel.textContent = deliveryFee;
    }
  }

  if (elSurgeRow) {
    elSurgeRow.style.display = surgeFee > 0 ? 'flex' : 'none';
    if (elSurgeFee) elSurgeFee.textContent = surgeFee;
  }

  if (elTipRow) {
    elTipRow.style.display = tip > 0 ? 'flex' : 'none';
    if (elTipFee) elTipFee.textContent = tip;
  }

  if (elSurgeAlert) {
    if (surge.rainSurge || surge.peakSurge || surge.lateNightSurge) {
      elSurgeAlert.classList.remove('hidden');
      const icon = document.getElementById('cartSurgeIcon');
      const title = document.getElementById('cartSurgeTitle');
      const desc = document.getElementById('cartSurgeDesc');
      if (surge.rainSurge) {
        if (icon) icon.textContent = 'ðŸŒ§ï¸';
        if (title) title.textContent = 'Inclement Weather Delivery Surge (+₹25)';
        if (desc) desc.textContent = '100% of the ₹25 rain incentive goes straight to your delivery courier.';
      } else if (surge.peakSurge) {
        if (icon) icon.textContent = '⚡';
        if (title) title.textContent = 'Peak Demand Volume Surge (1.25x)';
        if (desc) desc.textContent = 'High demand corridor in Sakoli. Delivery fee adjusted for faster dispatch.';
      } else {
        if (icon) icon.textContent = '🌙';
        if (title) title.textContent = 'Late Night Delivery Surcharge (+₹20)';
        if (desc) desc.textContent = 'Special night shift delivery partner incentive active.';
      }
    } else {
      elSurgeAlert.classList.add('hidden');
    }
  }

  if (elTax) elTax.textContent = taxes;
  if (elDis) elDis.textContent = appliedDiscount;
  if (elWal) elWal.textContent = walletDeduction;
  if (elWalRow) elWalRow.style.display = walletDeduction > 0 ? 'flex' : 'none';
  if (elTot) elTot.textContent = grandTotal;
  if (cartWalBal) cartWalBal.textContent = appData.currentUser ? (appData.currentUser.walletBalance || 0) : 0;
}

function applyCouponCode() {
  const code = (document.getElementById('couponInput')?.value || '').trim().toUpperCase();
  const subtotal = currentCart.reduce((s, i) => s + (i.price * i.qty), 0);
  const msgEl = document.getElementById('couponMessage');

  if (!code) {
    if (msgEl) msgEl.innerHTML = '<span style="color:var(--danger)">Please enter a coupon code.</span>';
    return;
  }

  const coupon = appData.settings.coupons[code];
  if (!coupon) {
    appliedDiscount = 0;
    appliedCouponCode = '';
    if (msgEl) msgEl.innerHTML = '<span style="color:var(--danger)">âŒ Invalid coupon code.</span>';
    updateBillTotals();
    return;
  }

  if (subtotal < coupon.min) {
    appliedDiscount = 0;
    appliedCouponCode = '';
    if (msgEl) msgEl.innerHTML = `<span style="color:var(--warning)">âš ï¸ Minimum spend of ₹${coupon.min} required for this coupon.</span>`;
    updateBillTotals();
    return;
  }

  appliedDiscount = coupon.type === 'percent' ? Math.round(subtotal * (coupon.value / 100)) : coupon.value;
  appliedCouponCode = code;
  if (msgEl) msgEl.innerHTML = `<span style="color:var(--accent)">🎉 Success! Saved ₹${appliedDiscount} with coupon ${code}.</span>`;
  playSound('chime');
  updateBillTotals();
}

let deliveryScheduleMode = 'now';

function setDeliveryScheduleMode(mode) {
  deliveryScheduleMode = mode;
  const btnNow = document.getElementById('btnDeliverNow');
  const btnLater = document.getElementById('btnDeliverLater');
  const picker = document.getElementById('scheduleTimePickerBox');
  if (btnNow) btnNow.classList.toggle('active', mode === 'now');
  if (btnLater) btnLater.classList.toggle('active', mode === 'later');
  if (picker) {
    if (mode === 'later') {
      picker.classList.remove('hidden');
      const dateInp = document.getElementById('scheduleDateInput');
      if (dateInp && !dateInp.value) {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        dateInp.value = d.toISOString().split('T')[0];
      }
    } else {
      picker.classList.add('hidden');
    }
  }
}

let pendingOrderForPayment = null;
let currentRzpOrderId = null;

async function submitOrder() {
  if (!currentCart.length) {
    showToast('Your cart is empty. Please add food first.', 'warning');
    return alert(t('emptyCart'));
  }

  const name = document.getElementById('custName')?.value.trim() || appData.currentUser?.name || 'Rakesh Sharma';
  const phone = document.getElementById('custPhone')?.value.trim() || appData.currentUser?.phone || '9876543210';
  const address = document.getElementById('custAddress')?.value.trim() || appData.currentUser?.address || 'Flat 402, Green Avenue, Sakoli';
  let payment = document.getElementById('paymentMethod')?.value || 'UPI';

  const subtotal = currentCart.reduce((s, i) => s + (i.price * i.qty), 0);
  const isVip = appData.currentUser && appData.currentUser.isVip;
  const isDineIn = currentServiceMode === 'dinein';
  let deliveryFee = (isDineIn || (isVip && subtotal >= 199)) ? 0 : appData.settings.deliveryBase;

  // Phase 12: Dynamic Surge Pricing Calculation
  const surge = appData.surgeSettings || { rainSurge: false, rainFee: 25, peakSurge: false, peakMultiplier: 1.25, lateNightSurge: false, lateNightFee: 20 };
  let surgeFee = 0;
  if (currentCart.length && !isDineIn) {
    if (surge.peakSurge && deliveryFee > 0) {
      const surgedDel = Math.round(deliveryFee * surge.peakMultiplier);
      surgeFee += (surgedDel - deliveryFee);
    }
    if (surge.rainSurge) surgeFee += surge.rainFee;
    if (surge.lateNightSurge) surgeFee += surge.lateNightFee;
  }

  // Phase 13: Delivery Partner Tip
  const tip = isDineIn ? 0 : (currentDriverTip || 0);

  const taxes = Math.round(subtotal * (appData.settings.gstRate / 100));
  const subAfterDiscount = Math.max(0, subtotal + deliveryFee + surgeFee + tip + taxes - appliedDiscount);

  let walletDeduction = 0;
  if (isWalletRedeemedInCart && appData.currentUser) {
    const available = appData.currentUser.walletBalance || 0;
    walletDeduction = Math.min(available, subAfterDiscount);
  }

  const total = Math.max(0, subAfterDiscount - walletDeduction);
  const now = new Date();

  // If grand total is zero because of wallet, mark as Paid via Wallet
  if (total === 0 && walletDeduction > 0) {
    payment = 'WALLET';
  }

  const uniqueVendors = [...new Set(currentCart.map(i => i.restaurantName))];
  const isMultiVendorHub = uniqueVendors.length > 1;
  const allCartAllergies = [...new Set(currentCart.flatMap(i => i.allergies || []))];
  const allCartNotes = currentCart.filter(i => i.chefNotes).map(i => `${i.name}: "${i.chefNotes}"`).join('; ');

  const newOrder = {
    id: 'FB-' + Math.floor(10000 + Math.random() * 90000),
    invoiceNo: `JBINV-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.floor(100 + Math.random() * 900)}`,
    userId: appData.currentUser.id,
    restaurantId: currentCart[0].restaurantId,
    restaurantName: isMultiVendorHub ? `${currentCart[0].restaurantName} + ${uniqueVendors.length - 1} more` : currentCart[0].restaurantName,
    isMultiVendorHub,
    vendorNames: uniqueVendors,
    allergies: allCartAllergies,
    chefNotes: allCartNotes,
    serviceMode: currentServiceMode,
    tableNumber: isDineIn ? (document.getElementById('dineInTableSelect')?.value || 'Table #01 (AC Family Hall)') : null,
    customer: { 
      name, 
      phone, 
      address: isDineIn ? `[DINE-IN] ${document.getElementById('dineInTableSelect')?.value || 'Table #01 (AC Family Hall)'}` : address 
    },
    items: [...currentCart],
    subtotal,
    deliveryFee,
    surgeFee,
    riderTip: tip,
    taxes,
    discount: appliedDiscount,
    couponCode: appliedCouponCode,
    walletRedeemed: walletDeduction,
    total,
    status: 'New',
    deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(),
    deliveryBoy: isDineIn ? 'Table Captain' : '',
    riderPhone: isDineIn ? '+91 9822001100' : '',
    payment,
    paymentStatus: (payment === 'COD') ? 'Pending' : 'Paid',
    transactionId: (payment === 'COD') ? 'COD-PAY-ON-DELIVERY' : (payment === 'WALLET') ? 'TXN-WALLET-REDEEM' : '',
    createdAt: now.toISOString(),
    etaMinutes: isDineIn ? 15 : 30,
    deliveryProgress: 15,
    scheduleMode: isDineIn ? 'now' : deliveryScheduleMode,
    scheduledSlot: (!isDineIn && deliveryScheduleMode === 'later') ? {
      date: document.getElementById('scheduleDateInput')?.value || new Date().toISOString().split('T')[0],
      slot: document.getElementById('scheduleSlotInput')?.value || '12:30 PM - 01:00 PM'
    } : null,
    chatHistory: []
  };

  // Deduct wallet if redeemed
  if (walletDeduction > 0 && appData.currentUser) {
    appData.currentUser.walletBalance -= walletDeduction;
    if (!Array.isArray(appData.currentUser.walletLedger)) appData.currentUser.walletLedger = [];
    appData.currentUser.walletLedger.unshift({
      id: 'tx_' + Date.now(),
      type: 'debit',
      title: `ðŸ›ï¸ Order #${newOrder.id} Payment`,
      amount: walletDeduction,
      date: new Date().toLocaleDateString('en-IN')
    });
    saveState();
    updateWalletUI();
  }

  // If Online Payment and remaining total > 0, open the interactive gateway modal
  if (total > 0 && (payment === 'UPI' || payment === 'CARD')) {
    pendingOrderForPayment = newOrder;
    openPaymentGateway(newOrder);
    return;
  }

  // Finalize directly for COD or Full Wallet Payment
  finalizeOrderPlacement(newOrder);
}

// Open Payment Gateway Modal
async function openPaymentGateway(order) {
  const payAmtEl = document.getElementById('gatewayPayAmount');
  const payBtnAmtEl = document.getElementById('gatewayPayBtnAmount');
  const orderIdEl = document.getElementById('gatewayOrderIdText');

  if (payAmtEl) payAmtEl.textContent = order.total;
  if (payBtnAmtEl) payBtnAmtEl.textContent = order.total;
  if (orderIdEl) orderIdEl.textContent = `Order #${order.id} • ${order.restaurantName}`;

  document.getElementById('gatewayActionArea')?.classList.remove('hidden');
  document.getElementById('gatewayProcessingState')?.classList.add('hidden');

  switchGatewayTab(order.payment === 'CARD' ? 'card' : 'upi');
  openModal('paymentGatewayModal');

  // Call Backend API to register payment order
  try {
    const res = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: order.total, orderId: order.id })
    });
    const data = await res.json();
    if (data.order_id) {
      currentRzpOrderId = data.order_id;
      console.log('Razorpay Order Initialized on Backend:', currentRzpOrderId);
    }
  } catch (err) {
    console.warn('Backend API offline, continuing in local simulation mode:', err.message);
    currentRzpOrderId = 'order_local_' + Date.now();
  }
}

function switchGatewayTab(tab) {
  ['tabUpi', 'tabCard', 'tabNet'].forEach(id => document.getElementById(id)?.classList.remove('active'));
  ['gatewayUpiPanel', 'gatewayCardPanel', 'gatewayNetPanel'].forEach(id => document.getElementById(id)?.classList.add('hidden'));

  if (tab === 'upi') {
    document.getElementById('tabUpi')?.classList.add('active');
    document.getElementById('gatewayUpiPanel')?.classList.remove('hidden');
  } else if (tab === 'card') {
    document.getElementById('tabCard')?.classList.add('active');
    document.getElementById('gatewayCardPanel')?.classList.remove('hidden');
  } else if (tab === 'net') {
    document.getElementById('tabNet')?.classList.add('active');
    document.getElementById('gatewayNetPanel')?.classList.remove('hidden');
  }
}

function cancelGatewayPayment() {
  closeModal('paymentGatewayModal');
  showToast('Payment cancelled by user. You can retry or choose Cash on Delivery.', 'warning');
}

async function processGatewayPayment(isSuccess) {
  if (!pendingOrderForPayment) return;

  const actionArea = document.getElementById('gatewayActionArea');
  const procState = document.getElementById('gatewayProcessingState');
  const procMsg = document.getElementById('gatewayProcessMsg');

  actionArea.classList.add('hidden');
  procState.classList.remove('hidden');

  if (!isSuccess) {
    procMsg.textContent = 'Contacting issuing bank...';
    setTimeout(() => {
      procState.classList.add('hidden');
      actionArea.classList.remove('hidden');
      alert('âŒ Payment Failed: Issuing bank declined transaction. Please retry or choose Cash on Delivery.');
      showToast('Payment Simulation Failed (Test Scenario)', 'warning');
    }, 1200);
    return;
  }

  procMsg.textContent = 'Verifying payment cryptographic signature...';

  // Generate realistic transaction ID
  const txnId = 'pay_live_' + Math.random().toString(36).substring(2, 14);

  // Verify signature with backend API
  try {
    await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: currentRzpOrderId || 'order_demo',
        razorpay_payment_id: txnId,
        razorpay_signature: 'sig_mock_' + Date.now()
      })
    });
  } catch (e) {
    console.log('Local verification complete');
  }

  setTimeout(() => {
    closeModal('paymentGatewayModal');
    pendingOrderForPayment.transactionId = txnId;
    pendingOrderForPayment.paymentStatus = 'Paid';
    finalizeOrderPlacement(pendingOrderForPayment);
    pendingOrderForPayment = null;
  }, 1000);
}

function finalizeOrderPlacement(newOrder) {
  appData.orders.unshift(newOrder);

  // Credit 5% Loyalty Cashback (15% for VIP Gold members)
  const isVip = appData.currentUser && appData.currentUser.isVip;
  const cashbackRate = isVip ? 0.15 : 0.05;
  const cashback = Math.round(newOrder.subtotal * cashbackRate);
  if (cashback > 0 && appData.currentUser) {
    appData.currentUser.walletBalance = (appData.currentUser.walletBalance || 0) + cashback;
    if (!Array.isArray(appData.currentUser.walletLedger)) appData.currentUser.walletLedger = [];
    appData.currentUser.walletLedger.unshift({
      id: 'tx_' + Date.now(),
      type: 'credit',
      title: isVip ? `👑 15% VIP Gold Cashback (Order #${newOrder.id})` : `🎉 5% Loyalty Cashback (Order #${newOrder.id})`,
      amount: cashback,
      date: new Date().toLocaleDateString('en-IN')
    });
    pushNotification('💰', isVip ? `👑 ₹${cashback} VIP Gold 15% Cashback credited!` : `₹${cashback} Cashback credited to your BhookIt Wallet!`);
  }

  saveState();
  updateWalletUI();

  // Trigger Kitchen Voice Announcement
  speakVoiceAlert(`Attention ${newOrder.restaurantName}! New order received for ${newOrder.items.length} items. Total amount ${newOrder.total} rupees.`);

  // Deplete kitchen raw ingredients & meal supplies
  depleteInventoryForOrder(newOrder);

  currentCart = [];
  appliedDiscount = 0;
  appliedCouponCode = '';
  isWalletRedeemedInCart = false;
  currentDriverTip = 0;
  document.querySelectorAll('.tip-chip').forEach(c => {
    c.classList.toggle('selected', c.textContent.trim().toLowerCase().includes('no tip'));
  });
  const chk = document.getElementById('redeemWalletCheck');
  if (chk) chk.checked = false;
  const tag = document.getElementById('walletAppliedTag');
  if (tag) tag.style.display = 'none';

  updateCartBadge();
  playSound('chime');
  pushNotification('ðŸ›ï¸', `Order #${newOrder.id} confirmed! Estimated arrival in 30 mins.`);
  showToast(`${t('orderPlacedSuccess')} ${newOrder.id} (${newOrder.payment} • ${newOrder.paymentStatus})`, 'success');
  currentTrackedOrderId = newOrder.id;
  show('track');
}

// -------------------------------------------------------------
// DINE-IN TABLE RESERVATIONS ENGINE
// -------------------------------------------------------------
function switchOrderTab(tab) {
  currentOrderSubtab = tab;
  const tabDel = document.getElementById('tabDeliveryOrders');
  const tabTb = document.getElementById('tabTableBookings');
  const contOrders = document.getElementById('customerOrdersContainer');
  const contTb = document.getElementById('customerTableBookingsContainer');

  if (tabDel) tabDel.classList.toggle('active', tab === 'delivery');
  if (tabTb) tabTb.classList.toggle('active', tab === 'tables');

  if (contOrders) contOrders.classList.toggle('hidden', tab !== 'delivery');
  if (contTb) contTb.classList.toggle('hidden', tab !== 'tables');

  if (tab === 'tables') renderCustomerTableBookings();
  else renderOrdersView();
}

function openTableBookingModal(restId) {
  const rest = appData.restaurants.find(r => r.id === Number(restId));
  if (!rest) return;

  document.getElementById('tbRestId').value = rest.id;
  document.getElementById('tbRestaurantTitle').textContent = `${rest.name} • ${rest.category}`;

  const today = new Date().toISOString().slice(0, 10);
  const dateInput = document.getElementById('tbDateInput');
  if (dateInput) {
    dateInput.min = today;
    dateInput.value = today;
  }

  const nameInput = document.getElementById('tbGuestName');
  const phoneInput = document.getElementById('tbGuestPhone');
  if (nameInput) nameInput.value = appData.currentUser?.name || 'Rakesh Sharma';
  if (phoneInput) phoneInput.value = appData.currentUser?.phone || '9876543210';

  // Reset chips
  selectedTbTimeSlot = '07:30 PM (Dinner)';
  document.querySelectorAll('#tbTimeSlots .slot-chip').forEach(c => {
    c.classList.toggle('selected', c.textContent.includes('07:30 PM'));
  });

  selectedTbGuests = 2;
  document.querySelectorAll('.guest-chip').forEach(c => {
    c.classList.toggle('selected', c.textContent.trim() === '2');
  });

  selectedTbOccasions = ['🎂 Birthday Celebration'];
  document.querySelectorAll('#tbOccasionChips .occasion-chip').forEach(c => {
    c.classList.toggle('selected', c.textContent.includes('Birthday'));
  });

  const notesInput = document.getElementById('tbSpecialNotes');
  if (notesInput) notesInput.value = '';

  openModal('tableBookingModal');
}

function selectTimeSlot(btn) {
  selectedTbTimeSlot = btn.textContent.trim();
  document.querySelectorAll('#tbTimeSlots .slot-chip').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
}

function selectGuests(count) {
  selectedTbGuests = count;
  document.querySelectorAll('.guest-chip').forEach(c => {
    c.classList.toggle('selected', c.textContent.trim() === (count >= 10 ? '10+' : count.toString()));
  });
}

function toggleOccasionChip(btn) {
  btn.classList.toggle('selected');
  const text = btn.textContent.trim();
  if (btn.classList.contains('selected')) {
    if (!selectedTbOccasions.includes(text)) selectedTbOccasions.push(text);
  } else {
    selectedTbOccasions = selectedTbOccasions.filter(o => o !== text);
  }
}

function confirmTableReservation() {
  const restId = Number(document.getElementById('tbRestId').value);
  const rest = appData.restaurants.find(r => r.id === restId);
  if (!rest) return;

  const date = document.getElementById('tbDateInput')?.value;
  const seatingZone = document.getElementById('tbSeatingSelect')?.value || 'Indoor AC Family Section';
  const guestName = (document.getElementById('tbGuestName')?.value || '').trim() || (appData.currentUser?.name || 'Rakesh Sharma');
  const guestPhone = (document.getElementById('tbGuestPhone')?.value || '').trim() || (appData.currentUser?.phone || '9876543210');
  const notes = (document.getElementById('tbSpecialNotes')?.value || '').trim();

  if (!date) {
    showToast('Please pick a reservation date', 'warning');
    return;
  }

  const bookingId = 'TB-' + Math.floor(10000 + Math.random() * 90000);
  const occasionsStr = selectedTbOccasions.join(', ') + (notes ? (selectedTbOccasions.length ? ' • ' + notes : notes) : '');

  const newBooking = {
    id: bookingId,
    restaurantId: rest.id,
    restaurantName: rest.name,
    customerName: guestName,
    customerPhone: guestPhone,
    date,
    timeSlot: selectedTbTimeSlot,
    guests: selectedTbGuests,
    seatingZone,
    specialNotes: occasionsStr || 'General Dining',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  if (!Array.isArray(appData.tableBookings)) {
    appData.tableBookings = [];
  }
  appData.tableBookings.unshift(newBooking);
  saveState();

  closeModal('tableBookingModal');
  playSound('delivered');
  pushNotification('ðŸ½ï¸', `Table reserved at ${rest.name} on ${date} (${selectedTbTimeSlot})!`);
  showToast(`🎉 Dine-in table reservation confirmed! Booking ID: ${bookingId}`, 'success');

  // Open the confirmation pass
  openTablePass(bookingId);
  renderCustomerTableBookings();
  renderVendorTableBookings();
}

function openTablePass(bookingId) {
  const booking = (appData.tableBookings || []).find(b => b.id === bookingId);
  if (!booking) return;

  document.getElementById('passBookingId').textContent = booking.id;
  document.getElementById('passRestName').textContent = booking.restaurantName;
  document.getElementById('passDate').textContent = booking.date;
  document.getElementById('passTime').textContent = booking.timeSlot;
  document.getElementById('passGuests').textContent = `${booking.guests} Guests`;
  document.getElementById('passZone').textContent = booking.seatingZone;
  document.getElementById('passGuestName').textContent = booking.customerName;
  document.getElementById('passGuestPhone').textContent = booking.customerPhone;
  document.getElementById('passNotes').textContent = booking.specialNotes || 'None';

  openModal('tablePassModal');
}

function printTablePass() {
  window.print();
}

function cancelTableBooking(bookingId) {
  const booking = (appData.tableBookings || []).find(b => b.id === bookingId);
  if (!booking) return;

  if (confirm(`Are you sure you want to cancel Table Reservation #${booking.id} at ${booking.restaurantName}?`)) {
    booking.status = 'Cancelled';
    saveState();
    playSound('chime');
    showToast(`Table reservation #${booking.id} has been cancelled`, 'info');
    renderCustomerTableBookings();
    renderVendorTableBookings();
  }
}

function renderCustomerTableBookings() {
  const container = document.getElementById('customerTableBookingsContainer');
  if (!container) return;

  const myBookings = (appData.tableBookings || []).filter(b => 
    b.customerPhone === (appData.currentUser?.phone || '9876543210') || 
    b.customerName === (appData.currentUser?.name || 'Rakesh Sharma')
  );

  const badge = document.getElementById('tbCountBadge');
  if (badge) badge.textContent = myBookings.length;

  if (!myBookings.length) {
    container.innerHTML = `
      <div class="dashboard-card" style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 44px; margin-bottom: 8px;">ðŸ½ï¸</div>
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 6px;">No Table Reservations</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">Skip the waiting line! Reserve a table in advance at any partner restaurant.</p>
        <button class="btn-primary" onclick="show('customer')" style="width: auto; padding: 8px 18px;">Find Restaurants</button>
      </div>
    `;
    return;
  }

  container.innerHTML = myBookings.map(b => `
    <div class="order-card" style="margin-bottom: 12px;">
      <div class="order-header">
        <div>
          <h3 style="font-size: 16px; font-weight: 700;">${b.restaurantName}</h3>
          <span style="font-size: 12px; color: var(--text-muted);">Pass #${b.id} • Booked for ${b.date}</span>
        </div>
        <span class="status-pill ${b.status === 'Confirmed' ? 'delivered' : b.status === 'Seated' ? 'accepted' : 'cancelled'}">${b.status}</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin: 10px 0; background: var(--bg-main); padding: 10px 14px; border-radius: var(--radius-sm);">
        <div><span style="font-size: 11px; color: var(--text-muted);">Time:</span> <b style="font-size: 12px;">${b.timeSlot}</b></div>
        <div><span style="font-size: 11px; color: var(--text-muted);">Guests:</span> <b style="font-size: 12px;">${b.guests} People</b></div>
        <div><span style="font-size: 11px; color: var(--text-muted);">Zone:</span> <b style="font-size: 12px;">${b.seatingZone}</b></div>
        <div><span style="font-size: 11px; color: var(--text-muted);">Notes:</span> <b style="font-size: 12px;">${b.specialNotes || 'None'}</b></div>
      </div>

      <div style="display: flex; gap: 8px; justify-content: flex-end; align-items: center; border-top: 1px solid var(--border); padding-top: 10px;">
        <button class="btn-secondary" onclick="openTablePass('${b.id}')" style="padding: 6px 12px; font-size: 12px;">
          ðŸŽŸï¸ View Table Pass
        </button>
        ${b.status === 'Confirmed' ? `
          <button class="btn-secondary" onclick="cancelTableBooking('${b.id}')" style="padding: 6px 12px; font-size: 12px; color: var(--danger); border-color: var(--danger);">
            Cancel Reservation
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function renderVendorTableBookings() {
  const container = document.getElementById('vendorTableBookingsList');
  if (!container) return;

  const currentVendor = appData.restaurants.find(r => r.id === currentActiveVendorId) || appData.restaurants[0];
  if (!currentVendor) return;

  const bookings = (appData.tableBookings || []).filter(b => b.restaurantId === currentVendor.id);
  const badge = document.getElementById('vendorTbBadge');
  if (badge) badge.textContent = `${bookings.length} Bookings`;

  if (!bookings.length) {
    container.innerHTML = '<p style="color:var(--text-muted); padding: 14px 0;">No table reservations for this restaurant yet.</p>';
    return;
  }

  container.innerHTML = bookings.map(b => `
    <div class="order-card" style="margin-bottom: 10px;">
      <div class="order-header">
        <div>
          <b>Pass #${b.id}</b> • <span style="font-size:12px; color:var(--text-muted);">${b.customerName} (📞 ${b.customerPhone})</span>
        </div>
        <span class="status-pill ${b.status === 'Confirmed' ? 'delivered' : b.status === 'Seated' ? 'accepted' : 'cancelled'}">${b.status}</span>
      </div>
      <div style="font-size: 13px; margin: 6px 0;">
        📅 <b>${b.date}</b> • ⏱️  <b>${b.timeSlot}</b> • 👥 <b>${b.guests} Guests</b> • 📍 <b>${b.seatingZone}</b>
      </div>
      <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">
        Occasion / Special Request: <em>${b.specialNotes || 'None'}</em>
      </div>
      <div class="action-btn-group">
        ${b.status === 'Confirmed' ? `
          <button class="btn-accent" onclick="setTableBookingStatus('${b.id}', 'Seated')">Mark Guests Seated ðŸ½ï¸</button>
          <button class="btn-secondary" onclick="setTableBookingStatus('${b.id}', 'Completed')">Mark Completed</button>
          <button class="btn-secondary" onclick="setTableBookingStatus('${b.id}', 'Cancelled')" style="color:var(--danger); border-color:var(--danger);">Decline / Cancel</button>
        ` : b.status === 'Seated' ? `
          <button class="btn-accent" onclick="setTableBookingStatus('${b.id}', 'Completed')">Mark Completed ✅</button>
        ` : `<span style="font-size:12px; color:var(--text-muted);">Reservation ${b.status}</span>`}
      </div>
    </div>
  `).join('');
}

function setTableBookingStatus(bookingId, status) {
  const booking = (appData.tableBookings || []).find(b => b.id === bookingId);
  if (!booking) return;

  booking.status = status;
  saveState();
  playSound('chime');
  showToast(`Reservation #${booking.id} marked as ${status}`, 'success');
  renderVendorTableBookings();
  renderCustomerTableBookings();
}

// -------------------------------------------------------------
// 3. ORDERS & INVOICES
// -------------------------------------------------------------
function renderOrdersView() {
  const myBookings = (appData.tableBookings || []).filter(b => 
    b.customerPhone === (appData.currentUser?.phone || '9876543210') || 
    b.customerName === (appData.currentUser?.name || 'Rakesh Sharma')
  );
  const badge = document.getElementById('tbCountBadge');
  if (badge) badge.textContent = myBookings.length;

  const container = document.getElementById('customerOrdersContainer');
  if (!container) return;

  const orders = appData.orders.filter(o => o.userId === appData.currentUser.id);
  if (!orders.length) {
    container.innerHTML = '<div class="dashboard-card"><p style="color:var(--text-muted);">No orders found. Order your first meal today!</p></div>';
    return;
  }

  container.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="order-header">
        <div>
          <h3 style="font-size: 16px; font-weight: 700;">
            ${o.restaurantName}
            ${o.serviceMode === 'dinein' ? `<span class="dine-in-badge" style="margin-left:6px;">ðŸ½ï¸ ${o.tableNumber || 'Table #01'}</span>` : ''}
            ${o.scheduleMode === 'later' && o.scheduledSlot ? `<span class="scheduled-slot-badge" style="margin-left:6px;">📅 ${o.scheduledSlot.date} (${o.scheduledSlot.slot})</span>` : ''}
          </h3>
          <span style="font-size: 12px; color: var(--text-muted);">Order #${o.id} • ${new Date(o.createdAt).toLocaleString()}</span>
        </div>
        <span class="status-pill ${o.status.toLowerCase().replace(/\s+/g, '-')}">${o.status}</span>
      </div>

      <div style="font-size: 13px; margin-bottom: 12px; color: var(--text-main);">
        ${o.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
      </div>

      ${o.status !== 'Delivered' && o.status !== 'Cancelled' && o.serviceMode !== 'dinein' ? `
        <div style="margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; background: #fffbeb; border: 1.5px dashed #f59e0b; padding: 6px 12px; border-radius: 8px;">
          <span style="font-size: 12px; font-weight: 700; color: #b45309;">ðŸ” Share OTP with Delivery Partner:</span>
          <span style="font-size: 16px; font-weight: 900; letter-spacing: 2.5px; color: #d97706; background: #fff; padding: 2px 8px; border-radius: 4px; border: 1px solid #fde68a;">${o.deliveryOtp || '4829'}</span>
        </div>
      ` : ''}

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 12px; flex-wrap: wrap; gap: 8px;">
        <span style="font-weight: 800; font-size: 16px; color: var(--primary);">₹${o.total} (${o.payment} • ${o.paymentStatus})</span>
        <div class="action-btn-group" style="margin-top:0;">
          <button class="btn-primary" onclick="openOrderChat('${o.id}')" style="background:#2563eb; border-color:#2563eb; padding:6px 12px; font-size:12px;">💬 Chat (${(o.chatHistory||[]).length})</button>
          ${o.serviceMode === 'dinein' && o.status !== 'Cancelled' ? `
            <button class="btn-accent" onclick="openWaiterCallModal('${o.id}')" style="padding:6px 12px; font-size:12px;">🔔 Call Waiter</button>
          ` : ''}
          <button class="btn-secondary" onclick="viewTrackingFor('${o.id}')">📍 Track Live</button>
          <button class="btn-whatsapp" onclick="shareOrderWhatsApp('${o.id}')">💬 WhatsApp Receipt</button>
          <button class="btn-secondary" onclick="showGSTInvoice('${o.id}')">📄 GST Invoice</button>
          ${o.status === 'Delivered' ? `
            ${o.dispute ? `
              <span style="font-size: 11px; font-weight: 700; color: #dc2626; background: #fee2e2; border: 1px solid #fca5a5; padding: 4px 8px; border-radius: 4px;">âš–ï¸ ${o.dispute.status}</span>
            ` : `
              <button class="btn-report-issue" onclick="openDisputeModal('${o.id}')">âš ï¸ Report Issue / Refund</button>
            `}
            ${o.review ? `
              <span style="font-size: 12px; font-weight: 700; color: #d97706; background: #fef3c7; border: 1px solid #fde68a; padding: 4px 8px; border-radius: 4px;">⭐ Rated ${o.review.foodRating}⭐ (Food) • ${o.review.riderRating}⭐ (Rider)</span>
            ` : `
              <button class="btn-accent" onclick="openRatingModal('${o.id}')" style="padding: 6px 12px; font-size: 12px;">⭐ Rate Order & Delivery</button>
            `}
          ` : ''}
          ${o.status === 'New' || o.status === 'Accepted' ? `<button class="btn-danger" onclick="cancelOrder('${o.id}')">Cancel</button>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function cancelOrder(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;
  if (!confirm(`Are you sure you want to cancel Order #${order.id}?`)) return;

  order.status = 'Cancelled';

  // 1. Auto Restock Depleted Raw Ingredients & Supplies
  restoreInventoryForOrder(order);

  // 2. Instant Wallet Refund if paid online or wallet was redeemed
  const wasPaid = order.paymentStatus === 'Paid' || order.payment !== 'COD' || (order.walletRedeemed && order.walletRedeemed > 0);
  let refundAmt = 0;

  if (wasPaid) {
    refundAmt = order.total + (order.walletRedeemed || 0);
    order.refundStatus = `Refunded ₹${refundAmt} to Wallet`;
    order.paymentStatus = 'Refunded';

    if (!appData.currentUser) appData.currentUser = { walletBalance: 0, walletLedger: [] };
    appData.currentUser.walletBalance = (appData.currentUser.walletBalance || 0) + refundAmt;
    if (!Array.isArray(appData.currentUser.walletLedger)) appData.currentUser.walletLedger = [];

    appData.currentUser.walletLedger.unshift({
      id: 'tx_' + Date.now(),
      type: 'credit',
      title: `🔄 Instant Order Cancellation Refund (Order #${order.id})`,
      amount: refundAmt,
      date: new Date().toLocaleDateString('en-IN')
    });
    updateWalletUI();
  } else {
    order.refundStatus = 'Not Applicable (COD)';
  }

  // 3. Audio Bell Alert & Kitchen Voice Cancellation Warning
  playSound('classic_bell');
  speakVoiceAlert(`Attention ${order.restaurantName}! Order #${order.id} has been cancelled by customer.`);

  pushNotification('âŒ', `Order #${order.id} cancelled.${refundAmt > 0 ? ` ₹${refundAmt} refunded instantly to your BhookIt Wallet!` : ''}`);
  saveState();

  showToast(`Order #${order.id} cancelled. ${refundAmt > 0 ? `₹${refundAmt} credited to wallet!` : ''} Supplies restored.`, 'warning');
  renderOrdersView();
  renderRestaurantView();
}

function viewTrackingFor(orderId) {
  currentTrackedOrderId = orderId;
  show('track');
}

// -------------------------------------------------------------
// 4. LIVE ORDER TRACKING WITH LEAFLET OPENSTREETMAP
// -------------------------------------------------------------
let activeLeafletMap = null;
let riderMarker = null;
let routePolyline = null;
let simulationInterval = null;

// Real-world road waypoints in Sakoli region
const DELIVERY_WAYPOINTS = [
  [21.0825, 79.9854], // Sakoli Market (Restaurant)
  [21.0838, 79.9875], // Main Road Turn
  [21.0858, 79.9908], // Post Office Junction
  [21.0880, 79.9942], // Highway Cross
  [21.0910, 79.9975], // Green Avenue North
  [21.0940, 80.0010]  // Customer Residence
];

function renderTrackingView() {
  const container = document.getElementById('activeTrackingCard');
  if (!container) return;

  const order = appData.orders.find(o => o.id === currentTrackedOrderId) || appData.orders.find(o => o.status !== 'Delivered' && o.status !== 'Cancelled') || appData.orders[0];

  if (!order) {
    container.innerHTML = '<p style="color:var(--text-muted); padding: 20px;">No active orders currently placed.</p>';
    return;
  }

  const steps = ['Placed', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];
  const currentStepIdx = steps.indexOf(order.status) >= 0 ? steps.indexOf(order.status) : 0;

  container.innerHTML = `
    <div class="order-header">
      <div>
        <h2 style="font-size: 20px; font-weight: 800;">Order #${order.id}</h2>
        <span style="font-size: 13px; color: var(--text-muted);">From ${order.restaurantName}</span>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <button class="btn-whatsapp" onclick="shareOrderWhatsApp('${order.id}')">💬 Share WhatsApp</button>
        <button class="btn-secondary" onclick="copyTrackingShareLink('${order.id}')" style="padding: 6px 10px; font-size: 12px;">🔗 Copy Link</button>
        <span class="status-pill ${order.status.toLowerCase().replace(/\s+/g, '-')}" id="trackStatusPill">${order.status}</span>
      </div>
    </div>

    <!-- Stepper Progress Bar -->
    <div class="route-step-bar" id="trackStepperBar">
      ${steps.map((s, idx) => `
        <div class="route-step ${idx === currentStepIdx ? 'active' : idx < currentStepIdx ? 'completed' : ''}">
          ${idx < currentStepIdx ? '✓ ' : ''}${s}
        </div>
      `).join('')}
    </div>

    <!-- Live Leaflet Real-World Interactive Road Map -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
      <span style="font-size: 13px; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 6px;">
        <span>🗑ºï¸</span> Real-World Live Navigation (OpenStreetMap)
      </span>
      <div style="display: flex; gap: 6px;">
        <button class="btn-accent" onclick="startLiveRiderSimulation('${order.id}')" id="btnSimulateRide" style="padding: 5px 12px; font-size: 12px;">
          â–¶ï¸ Simulate Rider Trip
        </button>
        <button class="btn-secondary" onclick="recenterTrackingMap()" style="padding: 5px 10px; font-size: 12px;">
          🎯 Fit Route
        </button>
      </div>
    </div>

    <div id="liveLeafletMap" style="height: 300px; width: 100%; border-radius: var(--radius-lg); border: 1.5px solid var(--border); overflow: hidden; margin-bottom: 14px; position: relative; z-index: 1;"></div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-top: 14px;">
      <div style="background: #f8fafc; padding: 14px; border-radius: 10px; border: 1px solid var(--border);">
        <span style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">${t('deliveryPartner')}</span>
        <div style="font-size: 15px; font-weight: 700; margin-top: 4px;" id="trackRiderName">${order.deliveryBoy || 'Vikram Rider (Assigned)'}</div>
        <div style="font-size: 13px; color: var(--primary); margin-top: 4px;" id="trackRiderPhone">📞 +91 9988771122</div>
      </div>

      <div style="background: #f8fafc; padding: 14px; border-radius: 10px; border: 1px solid var(--border);">
        <span style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">${t('estimatedTime')}</span>
        <div style="font-size: 15px; font-weight: 700; color: var(--primary); margin-top: 4px;" id="trackEtaDisplay">
          ${order.status === 'Delivered' ? '✅ Arrived & Delivered' : '⏱️ Arriving in ~' + (order.etaMinutes || 15) + ' mins'}
        </div>
        <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Delivery to: ${order.customer.address}</div>
      </div>
    </div>

    ${order.status !== 'Delivered' && order.status !== 'Cancelled' ? `
      <div class="delivery-otp-badge" style="margin-top: 14px;">
        <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #b45309;">ðŸ” 4-Digit Delivery Confirmation OTP</span>
        <span style="font-size: 24px; font-weight: 900; letter-spacing: 4px; color: #d97706; margin: 4px 0;">${order.deliveryOtp || '4829'}</span>
        <span style="font-size: 12px; color: #92400e;">Please share this secure code with ${order.deliveryBoy || 'Vikram Rider'} upon doorstep arrival.</span>
      </div>
    ` : ''}

    <div style="margin-top: 14px; text-align: center;">
      <button class="btn-secondary" onclick="openSupportChat()" style="padding: 8px 16px; font-size: 13px;">💬 Need Help? Chat with Live Support</button>
    </div>

    ${order.status === 'Delivered' ? `
      <div style="background: #fefce8; border: 1.5px solid #fef08a; padding: 14px 18px; border-radius: 12px; margin-top: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <div style="font-weight: 700; color: #854d0e; font-size: 14px;">🎉 Food has arrived & delivered!</div>
          <div style="font-size: 12px; color: #a16207;">How was the taste and delivery? Rate your experience.</div>
        </div>
        ${order.review ? `
          <span style="font-weight: 700; color: #d97706; font-size: 13px; background: #fff; padding: 4px 10px; border-radius: 6px; border: 1px solid #fde68a;">⭐ Rated ${order.review.foodRating}⭐ (Food) • ${order.review.riderRating}⭐ (Rider)</span>
        ` : `
          <button class="btn-accent" onclick="openRatingModal('${order.id}')" style="padding: 8px 16px; font-size: 13px;">⭐ Rate Food & Delivery</button>
        `}
      </div>
    ` : ''}
  `;

  // Initialize Leaflet Map
  setTimeout(() => {
    initLeafletTrackingMap(order);
  }, 100);
}

function initLeafletTrackingMap(order) {
  if (typeof L === 'undefined') return;

  const mapContainer = document.getElementById('liveLeafletMap');
  if (!mapContainer) return;

  if (activeLeafletMap) {
    activeLeafletMap.remove();
    activeLeafletMap = null;
  }

  // Create Leaflet instance centered on route
  activeLeafletMap = L.map('liveLeafletMap', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([21.0880, 79.9930], 14);

  // Add OpenStreetMap Tile Layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(activeLeafletMap);

  // Custom Icon Helpers
  const restIcon = L.divIcon({
    className: 'custom-map-icon',
    html: '<div class="map-icon-bubble rest" title="Restaurant">ðŸª</div>',
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });

  const custIcon = L.divIcon({
    className: 'custom-map-icon',
    html: '<div class="map-icon-bubble cust" title="Your House">📍</div>',
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });

  const riderIcon = L.divIcon({
    className: 'custom-map-icon',
    html: '<div class="map-icon-bubble rider" title="Courier Rider">🛵</div>',
    iconSize: [42, 42],
    iconAnchor: [21, 21]
  });

  // Origin Marker (Restaurant)
  L.marker(DELIVERY_WAYPOINTS[0], { icon: restIcon })
    .addTo(activeLeafletMap)
    .bindPopup(`<b>${order.restaurantName}</b><br>Kitchen Origin`);

  // Destination Marker (Customer)
  L.marker(DELIVERY_WAYPOINTS[DELIVERY_WAYPOINTS.length - 1], { icon: custIcon })
    .addTo(activeLeafletMap)
    .bindPopup(`<b>Delivery Destination</b><br>${order.customer.address}`);

  // Transit Route Line
  routePolyline = L.polyline(DELIVERY_WAYPOINTS, {
    color: '#ff4722',
    weight: 5,
    opacity: 0.85,
    dashArray: '8, 8'
  }).addTo(activeLeafletMap);

  // Rider Marker
  const startPos = order.status === 'Delivered' ? DELIVERY_WAYPOINTS[DELIVERY_WAYPOINTS.length - 1] : DELIVERY_WAYPOINTS[0];
  riderMarker = L.marker(startPos, { icon: riderIcon })
    .addTo(activeLeafletMap)
    .bindPopup(`<b>${order.deliveryBoy || 'Delivery Rider'}</b><br>Live GPS Signal Active`);

  // Fit bounds to display both ends
  activeLeafletMap.fitBounds(routePolyline.getBounds(), { padding: [40, 40] });
}

function recenterTrackingMap() {
  if (activeLeafletMap && routePolyline) {
    activeLeafletMap.fitBounds(routePolyline.getBounds(), { padding: [40, 40] });
  }
}

function startLiveRiderSimulation(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order || !riderMarker || !activeLeafletMap) return;

  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }

  const btn = document.getElementById('btnSimulateRide');
  if (btn) btn.disabled = true;

  order.status = 'Out for Delivery';
  order.deliveryBoy = 'Vikram Rider';
  saveState();

  const statusPill = document.getElementById('trackStatusPill');
  if (statusPill) {
    statusPill.textContent = 'Out for Delivery';
    statusPill.className = 'status-pill out-for-delivery';
  }

  showToast('🛵 Rider picked up your food! Real-time navigation active.', 'info');
  speakVoiceAlert('Rider is on the way with your food order!');

  let step = 0;
  const totalSteps = DELIVERY_WAYPOINTS.length;

  simulationInterval = setInterval(() => {
    step++;

    if (step < totalSteps) {
      const coord = DELIVERY_WAYPOINTS[step];
      riderMarker.setLatLng(coord);
      activeLeafletMap.panTo(coord);

      const minsLeft = Math.max(1, Math.round((totalSteps - step) * 3));
      const etaEl = document.getElementById('trackEtaDisplay');
      if (etaEl) etaEl.textContent = `⏱️ Arriving in ~${minsLeft} mins`;

      riderMarker.setPopupContent(`<b>🛵 Delivery Rider in Motion</b><br>Speed: 28 km/h • ~${minsLeft} mins away`);
    } else {
      clearInterval(simulationInterval);
      simulationInterval = null;

      // Completed
      order.status = 'Delivered';
      order.paymentStatus = 'Paid';
      saveState();

      riderMarker.setLatLng(DELIVERY_WAYPOINTS[totalSteps - 1]);
      riderMarker.setPopupContent(`<b>✅ Arrived & Delivered!</b>`);

      const etaEl = document.getElementById('trackEtaDisplay');
      if (etaEl) etaEl.textContent = '✅ Arrived & Delivered';

      if (statusPill) {
        statusPill.textContent = 'Delivered';
        statusPill.className = 'status-pill delivered';
      }

      // Update stepper bar
      const stepper = document.getElementById('trackStepperBar');
      if (stepper) {
        stepper.querySelectorAll('.route-step').forEach(s => s.className = 'route-step completed');
      }

      if (btn) btn.disabled = false;
      playSound('chime');
      showToast('🎉 Your food has been delivered! Enjoy your meal.', 'success');
      speakVoiceAlert('Your food has been delivered! Enjoy your meal from BhookIt.');
    }
  }, 1500);
}

// -------------------------------------------------------------
// 5. RESTAURANT VENDOR PORTAL
// -------------------------------------------------------------
function renderRestaurantView() {
  const vendorSelect = document.getElementById('vendorSelect');
  if (vendorSelect && !vendorSelect.options.length) {
    vendorSelect.innerHTML = appData.restaurants.map(r => `
      <option value="${r.id}" ${r.id === currentActiveVendorId ? 'selected' : ''}>${r.name}</option>
    `).join('');
  }

  const currentVendor = appData.restaurants.find(r => r.id === currentActiveVendorId) || appData.restaurants[0];
  if (!currentVendor) return;

  const toggleBtn = document.getElementById('storeStatusToggleBtn');
  if (toggleBtn) {
    toggleBtn.textContent = currentVendor.open ? '🟢 Store Open' : '🔴 Store Closed';
    toggleBtn.className = currentVendor.open ? 'btn-accent' : 'btn-danger';
  }

  const vendorOrders = appData.orders.filter(o => o.restaurantId === currentVendor.id || (o.isMultiVendorHub && o.items.some(i => i.restaurantId === currentVendor.id)));
  const activeOrders = vendorOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const grossSales = vendorOrders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => {
    // If multi-vendor, compute subtotal for items belonging to this vendor
    if (o.isMultiVendorHub) {
      return sum + o.items.filter(i => i.restaurantId === currentVendor.id).reduce((s, i) => s + (i.price * i.qty), 0);
    }
    return sum + o.subtotal;
  }, 0);
  const commission = Math.round(grossSales * (currentVendor.commissionRate / 100));
  const netPayout = grossSales - commission;

  document.getElementById('vendorActiveOrders').textContent = activeOrders.length;
  document.getElementById('vendorTodayGross').textContent = `₹${grossSales}`;
  document.getElementById('vendorCommission').textContent = `₹${commission}`;
  document.getElementById('vendorNetPayout').textContent = `₹${netPayout}`;

  const ordersListEl = document.getElementById('vendorOrdersList');
  if (ordersListEl) {
    if (!vendorOrders.length) {
      ordersListEl.innerHTML = '<p style="color:var(--text-muted); padding: 14px 0;">No incoming orders yet.</p>';
    } else {
      ordersListEl.innerHTML = vendorOrders.map(o => {
        const vendorItems = o.isMultiVendorHub ? o.items.filter(i => i.restaurantId === currentVendor.id) : o.items;
        return `
        <div class="order-card" style="margin-bottom: 12px; ${o.allergies && o.allergies.length ? 'border-left: 4px solid #ef4444;' : ''}">
          <div class="order-header">
            <div>
              <b>Order #${o.id}</b> 
              ${o.isMultiVendorHub ? '<span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:10px;">Multi-Vendor Hub</span>' : ''}
              ${o.serviceMode === 'dinein' ? `<span class="dine-in-badge" style="margin-left:4px;">ðŸ½ï¸ ${o.tableNumber || 'Table #01'}</span>` : ''}
              ${o.scheduleMode === 'later' && o.scheduledSlot ? `<span class="scheduled-slot-badge" style="margin-left:4px;">📅 Slot: ${o.scheduledSlot.date} (${o.scheduledSlot.slot})</span>` : ''}
              • <span style="color:var(--text-muted); font-size:12px;">${o.customer.name} (${o.customer.phone})</span>
            </div>
            <span class="status-pill ${o.status.toLowerCase().replace(/\s+/g, '-')}">${o.status}</span>
          </div>

          ${o.allergies && o.allergies.length ? `
            <div style="background: #fef2f2; border: 1px dashed #ef4444; border-radius: 4px; padding: 4px 8px; margin: 6px 0; font-size: 11px; font-weight: 700; color: #b91c1c;">
              🚨 Kitchen Caution - Customer Allergies: ${o.allergies.join(', ')}
            </div>
          ` : ''}

          <div style="font-size: 13px; margin: 6px 0;">
            ${vendorItems.map(i => `
              <div style="margin-bottom: 2px;">
                <b>${i.qty}x</b> ${i.name} ${i.addons && i.addons.length ? `<span style="color:var(--text-muted); font-size:12px;">(${i.addons.join(', ')})</span>` : ''}
                ${i.allergies && i.allergies.length ? `<span style="font-size: 10px; font-weight: 700; color: #b91c1c; background: #fee2e2; padding: 1px 6px; border-radius: 4px; margin-left: 4px;">âš ï¸ ${i.allergies.join(', ')}</span>` : ''}
                ${i.chefNotes ? `<span style="font-size: 11px; color: #ea580c; font-style: italic; margin-left: 6px;">ðŸ‘¨â€ðŸ³ "${i.chefNotes}"</span>` : ''}
              </div>
            `).join('')}
          </div>
          <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 10px;">
            Address: ${o.customer.address} | Total: <b>₹${o.total}</b> (${o.payment})
          </div>
          <div class="action-btn-group">
            ${o.status === 'New' ? `<button class="btn-accent" onclick="setOrderStatus('${o.id}', 'Accepted')">Accept Order</button>` : ''}
            ${o.status === 'Accepted' ? `<button class="btn-secondary" onclick="setOrderStatus('${o.id}', 'Preparing')">Start Preparing (15m)</button>` : ''}
            ${o.status === 'Preparing' ? `<button class="btn-accent" onclick="setOrderStatus('${o.id}', 'Ready')">Mark Food Ready for Rider</button>` : ''}
            ${o.status === 'Ready' ? `<span style="font-size:12px; color:var(--accent); font-weight:700;">Awaiting Rider Pickup</span>` : ''}
            <button class="btn-whatsapp" onclick="sendKitchenWhatsApp('${o.id}')">💬 Send to Chef WhatsApp</button>
          </div>
        </div>
      `;
      }).join('');
    }
  }

  const menuListEl = document.getElementById('vendorMenuList');
  if (menuListEl) {
    menuListEl.innerHTML = currentVendor.foods.map(f => `
      <div class="food-row" style="margin-bottom: 8px;">
        <div class="food-details">
          <span class="food-title">
            <span class="${f.veg ? 'veg-indicator' : 'nonveg-indicator'}"></span>
            ${f.name}
            <span style="font-size: 11px; background: #e2e8f0; color: #0f172a; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">${f.category}</span>
          </span>
          <span class="food-price">₹${f.price}</span>
        </div>
        <div>
          <button class="${f.inStock ? 'btn-accent' : 'btn-danger'}" onclick="toggleFoodStock(${currentVendor.id}, ${f.id})" style="padding: 4px 10px; font-size: 12px;">
            ${f.inStock ? 'In Stock' : 'Out of Stock'}
          </button>
        </div>
      </div>
    `).join('');
  }

  // Render Dine-In Table Buzzers / Waiter Calls
  renderVendorWaiterAlerts();

  // Render Table Reservations for this Vendor
  renderVendorTableBookings();

  // Render Kitchen Performance Analytics
  renderVendorAnalytics();

  // Render Kitchen Raw Material Inventory
  renderVendorInventory();
}

function switchVendor(vendorId) {
  currentActiveVendorId = Number(vendorId);
  renderRestaurantView();
}

function toggleStoreOpen() {
  const vendor = appData.restaurants.find(r => r.id === currentActiveVendorId);
  if (!vendor) return;
  vendor.open = !vendor.open;
  saveState();
  renderRestaurantView();
  showToast(`Store marked ${vendor.open ? 'OPEN' : 'CLOSED'}`, vendor.open ? 'success' : 'warning');
}

function toggleFoodStock(vendorId, foodId) {
  const vendor = appData.restaurants.find(r => r.id === vendorId);
  const food = vendor?.foods.find(f => f.id === foodId);
  if (!food) return;
  food.inStock = !food.inStock;
  saveState();
  renderRestaurantView();
  showToast(`${food.name} marked ${food.inStock ? 'In Stock' : 'Out of Stock'}`, 'info');
}

function setOrderStatus(orderId, nextStatus) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = nextStatus;
  saveState();
  playSound('chime');
  speakVoiceAlert(`Order ${order.id} status updated to ${nextStatus}.`);
  showToast(`Order #${order.id} status updated to: ${nextStatus}`, 'success');
  renderRestaurantView();
}

function openAddMenuModal() {
  openModal('addDishModal');
}

function submitNewDish() {
  const name = document.getElementById('newDishName')?.value.trim();
  const price = Number(document.getElementById('newDishPrice')?.value);
  const category = document.getElementById('newDishCategory')?.value || 'Fast Food';
  const veg = document.querySelector('input[name="newDishDiet"]:checked')?.value === 'veg';
  const photo = document.getElementById('newDishPhoto')?.value.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

  if (!name || !price) return alert('Please enter dish name and valid price.');

  const vendor = appData.restaurants.find(r => r.id === currentActiveVendorId);
  if (!vendor) return;

  vendor.foods.push({
    id: Date.now(),
    name,
    price,
    category,
    veg,
    inStock: true,
    desc: 'Special chef preparation made with authentic ingredients.'
  });

  saveState();
  closeModal('addDishModal');
  showToast(`Added ${name} to restaurant menu!`, 'success');
  renderRestaurantView();
}

// -------------------------------------------------------------
// 6. DELIVERY RIDER PORTAL
// -------------------------------------------------------------
let riderOnline = true;

function renderDeliveryView() {
  const currentRider = appData.riders[0];
  const listEl = document.getElementById('riderDeliveriesList');
  if (!listEl) return;

  document.getElementById('riderTotalTrips').textContent = currentRider.totalTrips;
  document.getElementById('riderEarnings').textContent = `₹${currentRider.earnings}`;
  document.getElementById('riderTips').textContent = `₹${currentRider.tips}`;

  const dispatchOrders = appData.orders.filter(o => o.status === 'Ready' || o.deliveryBoy === currentRider.name);

  renderRiderBatchMode();

  if (!dispatchOrders.length) {
    listEl.innerHTML = '<p style="color:var(--text-muted); padding: 14px 0;">No pending deliveries assigned. You will be alerted when an order is ready.</p>';
    return;
  }

  listEl.innerHTML = dispatchOrders.map(o => `
    <div class="order-card">
      <div class="order-header">
        <div>
          <b>Order #${o.id}</b> • <span class="badge">${o.status}</span>
          ${o.podCaptured ? '<span class="badge" style="background:#ecfdf5; color:#059669; margin-left:6px;">📸 POD Verified</span>' : ''}
        </div>
        <span style="font-weight: 800; color: var(--accent);">Payout: ₹${o.deliveryFee}</span>
      </div>

      <div style="font-size: 13px; margin: 8px 0;">
        <div>ðŸª <b>Pickup:</b> ${o.restaurantName}</div>
        <div>📍 <b>Dropoff:</b> ${o.customer.name} • ${o.customer.address}</div>
        <div>📞 <b>Customer Phone:</b> ${o.customer.phone}</div>
      </div>

      <div class="action-btn-group">
        ${!o.deliveryBoy ? `<button class="btn-accent" onclick="riderAcceptOrder('${o.id}')">Accept Delivery</button>` : ''}
        ${o.deliveryBoy === currentRider.name && o.status === 'Ready' ? `<button class="btn-accent" onclick="riderPickUpOrder('${o.id}')">Confirm Food Picked Up</button>` : ''}
        ${o.deliveryBoy === currentRider.name && o.status === 'Out for Delivery' ? `
          <div style="width: 100%; background: #f0fdf4; border: 1.5px dashed #86efac; padding: 10px 14px; border-radius: 8px; margin: 8px 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span style="font-size: 12px; font-weight: 700; color: #166534;">ðŸ” Enter Customer's 4-Digit OTP:</span>
            <div style="display: flex; gap: 6px;">
              <input type="text" id="riderOtpInput_${o.id}" maxlength="4" placeholder="4 digits" class="input-field" style="margin: 0; width: 100px; padding: 4px 8px; text-align: center; font-weight: 800; letter-spacing: 2px;">
              <button class="btn-primary" onclick="verifyRiderDeliveryOtp('${o.id}')" style="margin: 0; padding: 6px 12px; font-size: 12px;">Verify & Complete 📦</button>
            </div>
          </div>
        ` : ''}
        <button class="btn-whatsapp" onclick="sendRiderWhatsApp('${o.id}')">💬 WhatsApp Location</button>
        <button class="btn-secondary" onclick="openPodModal('${o.id}')" style="padding: 6px 12px; font-size: 12px;">
          ${o.podCaptured ? '✓ 📸 POD Verified' : '📸 Snap POD'}
        </button>
      </div>
    </div>
  `).join('');
}

function toggleRiderOnline() {
  riderOnline = !riderOnline;
  const btn = document.getElementById('riderStatusBtn');
  if (btn) {
    btn.textContent = riderOnline ? '🟢 Rider Online' : '🔴 Rider Offline';
    btn.className = riderOnline ? 'btn-accent' : 'btn-danger';
  }
  showToast(`Rider status set to ${riderOnline ? 'ONLINE' : 'OFFLINE'}`, riderOnline ? 'success' : 'warning');
}

function simulateRiderGPS() {
  showToast('📍 GPS Location Ping: Lat 21.0825, Lng 79.9854 (Sakoli Center)', 'info');
}

function riderAcceptOrder(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;
  order.deliveryBoy = appData.riders[0].name;
  order.riderPhone = appData.riders[0].phone;
  order.status = 'Ready';
  saveState();
  playSound('chime');
  showToast(`Accepted Delivery for Order #${order.id}`, 'success');
  renderDeliveryView();
}

function riderPickUpOrder(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = 'Out for Delivery';
  saveState();
  playSound('chime');
  showToast(`Picked up Order #${order.id} from kitchen. Starting route!`, 'info');
  renderDeliveryView();
}

function riderCompleteDelivery(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = 'Delivered';
  order.paymentStatus = 'Paid';
  appData.riders[0].totalTrips++;
  appData.riders[0].earnings += order.deliveryFee;
  saveState();
  playSound('chime');
  showToast(`Order #${order.id} delivered successfully! Payment confirmed.`, 'success');
  renderDeliveryView();
}

// -------------------------------------------------------------
// 7. SUPER ADMIN DASHBOARD
// -------------------------------------------------------------
function renderAdminView() {
  const gmv = appData.orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
  const subtotal = appData.orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.subtotal, 0);
  const commission = Math.round(subtotal * 0.10);

  document.getElementById('adminKpiGMV').textContent = `₹${gmv}`;
  document.getElementById('adminKpiCommission').textContent = `₹${commission}`;
  document.getElementById('adminKpiOrders').textContent = appData.orders.length;
  document.getElementById('adminKpiRestaurants').textContent = appData.restaurants.length;

  const restTable = document.getElementById('adminRestaurantsTable');
  if (restTable) {
    restTable.innerHTML = `
      <table class="invoice-table">
        <thead>
          <tr><th>Restaurant</th><th>KYC & Compliance</th><th>Category</th><th>Commission</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          ${appData.restaurants.map(r => `
            <tr>
              <td><b>${r.name}</b><br><span style="font-size:11px; color:var(--text-muted);">${r.email}</span></td>
              <td><span class="fssai-pill">🛡️ FSSAI: ${r.fssai || '11524012000341'}</span><br><span style="font-size:11px; color:var(--text-muted);">GST: ${r.gstin || '27AAACF1234F1Z5'}</span></td>
              <td>${r.category}</td>
              <td>${r.commissionRate}%</td>
              <td><span class="status-pill ${r.approved ? 'delivered' : 'cancelled'}">${r.approved ? 'Active' : 'Pending'}</span></td>
              <td>
                ${!r.approved ? `<button class="btn-accent" onclick="adminApproveRest(${r.id}, true)" style="padding:4px 8px; font-size:11px;">Approve</button>` : `<button class="btn-danger" onclick="adminApproveRest(${r.id}, false)" style="padding:4px 8px; font-size:11px;">Suspend</button>`}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  const dispatchList = document.getElementById('adminDispatchList');
  if (dispatchList) {
    const unassigned = appData.orders.filter(o => !o.deliveryBoy && (o.status === 'Ready' || o.status === 'Preparing' || o.status === 'New'));
    if (!unassigned.length) {
      dispatchList.innerHTML = '<p style="color:var(--text-muted); padding: 10px 0;">All orders are dispatched and assigned to riders.</p>';
    } else {
      dispatchList.innerHTML = unassigned.map(o => `
        <div class="food-row" style="margin-bottom: 8px;">
          <div>
            <b>#${o.id}</b> • ${o.restaurantName} â†’ ${o.customer.address} (₹${o.total})
          </div>
          <div style="display: flex; gap: 8px;">
            <select id="riderSelect_${o.id}" class="input-field" style="margin:0; width:auto; padding:4px 8px; font-size:12px;">
              ${appData.riders.map(r => `<option value="${r.name}">${r.name}</option>`).join('')}
            </select>
            <button class="btn-accent" onclick="adminAssignRider('${o.id}')" style="padding:4px 10px; font-size:12px;">Assign</button>
          </div>
        </div>
      `).join('');
    }
  }

  const settlementList = document.getElementById('adminSettlementLedger');
  if (settlementList) {
    settlementList.innerHTML = appData.restaurants.map(r => {
      const rOrders = appData.orders.filter(o => o.restaurantId === r.id && o.status !== 'Cancelled');
      const gross = rOrders.reduce((sum, o) => sum + o.subtotal, 0);
      const comm = Math.round(gross * (r.commissionRate / 100));
      const payable = gross - comm;
      return `
        <div class="food-row" style="margin-bottom: 8px;">
          <div>
            <b>${r.name}</b><br>
            <span style="font-size:12px; color:var(--text-muted);">Gross: ₹${gross} • Commission: ₹${comm}</span>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; color: var(--accent);">Payable: ₹${payable}</div>
            <div class="action-btn-group" style="justify-content: flex-end; margin-top: 4px;">
              <button class="btn-whatsapp" onclick="sendSettlementWhatsApp(${r.id})">💬 WhatsApp Summary</button>
              <button class="btn-secondary" onclick="showToast('Payout of ₹${payable} initiated to ${r.name}', 'success')" style="padding: 4px 8px; font-size: 11px;">Settle Payout</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  const couponList = document.getElementById('adminCouponList');
  if (couponList) {
    couponList.innerHTML = Object.entries(appData.settings.coupons).map(([code, c]) => `
      <div class="food-row" style="margin-bottom: 8px;">
        <div>
          <b style="color:var(--primary);">${code}</b> • ${c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} FLAT`} (Min Spend ₹${c.min})
        </div>
        <button class="btn-danger" onclick="deleteCoupon('${code}')" style="padding: 2px 8px; font-size: 11px;">Remove</button>
      </div>
    `).join('');
  }

  // Render Rider Fleet Radar
  renderAdminFleetRadar();

  // Render Customer Disputes Desk
  renderAdminDisputes();

  // Render Dynamic Surge Switchboard Controls
  renderAdminSurgeSwitchboard();

  // Render Sakoli Geo-Demand Heatmap & Fleet Telemetry
  renderAdminHeatmap();
  renderAdminFleetTelemetry();

  // Render Delivery Cities & Service Zones Management Console
  renderAdminDeliveryZones();
}

function adminApproveRest(id, approved) {
  const rest = appData.restaurants.find(r => r.id === id);
  if (!rest) return;
  rest.approved = approved;
  saveState();
  showToast(`Restaurant ${rest.name} ${approved ? 'approved' : 'suspended'}.`, 'info');
  renderAdminView();
  
  if (approved) {
    sendPartnerApprovalNotification(rest);
  }
}

function adminAssignRider(orderId) {
  const riderName = document.getElementById(`riderSelect_${orderId}`)?.value;
  const order = appData.orders.find(o => o.id === orderId);
  const rider = appData.riders.find(r => r.name === riderName);
  if (!order || !rider) return;

  order.deliveryBoy = rider.name;
  order.riderPhone = rider.phone;
  order.status = 'Ready';
  saveState();
  playSound('chime');
  showToast(`Assigned ${rider.name} to Order #${order.id}`, 'success');
  renderAdminView();
}

function autoDispatchOrders() {
  const unassigned = appData.orders.filter(o => !o.deliveryBoy && (o.status === 'Ready' || o.status === 'Preparing'));
  if (!unassigned.length) return showToast('No ready orders need assignment.', 'info');

  unassigned.forEach((o, i) => {
    const rider = appData.riders[i % appData.riders.length];
    o.deliveryBoy = rider.name;
    o.riderPhone = rider.phone;
    o.status = 'Ready';
  });

  saveState();
  playSound('chime');
  showToast(`Auto-dispatched ${unassigned.length} orders to riders!`, 'success');
  renderAdminView();
}

function openAddCouponModal() {
  openModal('addCouponModal');
}

function submitNewCoupon() {
  const code = (document.getElementById('newCouponCode')?.value || '').trim().toUpperCase();
  const value = Number(document.getElementById('newCouponValue')?.value);
  const min = Number(document.getElementById('newCouponMin')?.value);

  if (!code || !value || !min) return alert('Please enter code, discount %, and minimum order amount.');

  appData.settings.coupons[code] = {
    type: 'percent',
    value,
    min,
    label: `${value}% OFF min ₹${min}`
  };

  saveState();
  closeModal('addCouponModal');
  showToast(`Coupon ${code} created successfully!`, 'success');
  renderAdminView();
}

function deleteCoupon(code) {
  delete appData.settings.coupons[code];
  saveState();
  showToast(`Coupon ${code} removed.`, 'warning');
  renderAdminView();
}

function openOnboardRestaurantModal() {
  openModal('onboardRestaurantModal');
}

function submitNewRestaurant() {
  const name = document.getElementById('newRestName')?.value.trim();
  const email = document.getElementById('newRestEmail')?.value.trim();
  const category = document.getElementById('newRestCategory')?.value.trim() || 'Multi-Cuisine';
  const commission = Number(document.getElementById('newRestCommission')?.value) || 10;

  if (!name || !email) return alert('Please enter restaurant name and email.');

  const newRest = {
    id: Date.now(),
    name,
    email,
    phone: '+91 9800112233',
    category,
    rating: 4.8,
    prepTime: '20-30 mins',
    minOrder: 150,
    commissionRate: commission,
    approved: true,
    open: true,
    coverImg: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    foods: [
      { id: Date.now() + 1, name: `${name} Special Platter`, price: 220, category, veg: true, inStock: true, desc: 'Signature house specialty cooked with aromatic spices.' }
    ]
  };

  appData.restaurants.push(newRest);
  saveState();
  closeModal('onboardRestaurantModal');
  showToast(`Onboarded ${name} successfully!`, 'success');
  renderAdminView();
}

function resetDemoData() {
  if (!confirm('Reset application data back to factory seed demo values?')) return;
  localStorage.removeItem(STORAGE_KEY);
  appData = JSON.parse(JSON.stringify(SEED_DATA));
  saveState();
  showToast('Reset data to default demo state.', 'info');
  show('customer');
}

// -------------------------------------------------------------
// 8. GST TAX INVOICE
// -------------------------------------------------------------
function showGSTInvoice(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;

  document.getElementById('invInvoiceNo').textContent = order.invoiceNo || order.id;
  document.getElementById('invDate').textContent = new Date(order.createdAt).toLocaleDateString();
  document.getElementById('invCustName').textContent = order.customer.name;
  document.getElementById('invCustPhone').textContent = order.customer.phone;
  document.getElementById('invCustAddress').textContent = order.customer.address;
  document.getElementById('invRestName').textContent = order.restaurantName;
  document.getElementById('invPaymentMode').textContent = `${order.payment} (${order.paymentStatus})${order.transactionId ? ' • Txn: ' + order.transactionId : ''}`;

  const tbody = document.getElementById('invItemsBody');
  if (tbody) {
    tbody.innerHTML = order.items.map(i => `
      <tr>
        <td>${i.name} ${i.addons ? `<br><small style="color:#64748b;">${i.addons.join(', ')}</small>` : ''}</td>
        <td>${i.qty}</td>
        <td>₹${i.price}</td>
        <td>₹${i.price * i.qty}</td>
      </tr>
    `).join('');
  }

  document.getElementById('invSubtotal').textContent = order.subtotal;
  document.getElementById('invDelivery').textContent = order.deliveryFee;
  document.getElementById('invTax').textContent = order.taxes;
  document.getElementById('invDiscount').textContent = order.discount;
  document.getElementById('invGrandTotal').textContent = order.total;

  openModal('gstInvoiceModal');
}

function printInvoice() {
  window.print();
}

// -------------------------------------------------------------
// 9. MODALS & AUTH
// -------------------------------------------------------------
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) {
    m.classList.remove('hidden');
    // Scroll the modal content to top for better UX
    const modalCard = m.querySelector('.modal-card');
    if (modalCard) {
      modalCard.scrollTop = 0;
      modalCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add('hidden');
}

function openAuth() {
  openModal('authModal');
}

function userLoginAction() {
  const email = document.getElementById('loginEmail')?.value.trim();
  const pass = document.getElementById('loginPass')?.value;
  if (!email || !pass) return alert('Please enter email and password.');

  appData.currentUser = {
    id: 'usr_' + Date.now(),
    name: email.split('@')[0],
    email,
    phone: '9876543210',
    address: 'Sakoli City Center'
  };

  saveState();
  updateUserBadge();
  closeModal('authModal');
  showToast(`Welcome back, ${appData.currentUser.name}!`, 'success');
}

function userSignupAction() {
  userLoginAction();
}

function updateUserBadge() {
  const label = document.getElementById('userLabel');
  const btn = document.getElementById('authBtn');
  if (label) label.textContent = appData.currentUser ? appData.currentUser.name : t('guest');
  if (btn) {
    btn.textContent = appData.currentUser ? t('logout') : t('login');
    btn.onclick = appData.currentUser ? () => {
      appData.currentUser = null;
      updateUserBadge();
      showToast('Logged out.', 'info');
    } : openAuth;
  }
}

// -------------------------------------------------------------
// 9B. SHAREABLE TRACKING & SOCIAL DISPATCH
// -------------------------------------------------------------
function copyTrackingShareLink(orderId) {
  const url = `${window.location.origin}${window.location.pathname}?track=${orderId}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('📋 Live Tracking link copied to clipboard!', 'success');
      playSound('chime');
    }).catch(() => {
      prompt('Copy this tracking link:', url);
    });
  } else {
    prompt('Copy this tracking link:', url);
  }
}

function shareOrderWhatsApp(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;
  const trackingUrl = `${window.location.origin}${window.location.pathname}?track=${order.id}`;
  const text = encodeURIComponent(
    `🍔 *BhookIt Order Confirmation #${order.id}*\n` +
    `ðŸª *Restaurant:* ${order.restaurantName}\n` +
    `📦 *Items:* ${order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}\n` +
    `💰 *Total Paid:* ₹${order.total} (${order.payment})\n` +
    `ðŸ” *Delivery OTP:* ${order.deliveryOtp || '4829'}\n` +
    `📍 *Live Tracking URL:* ${trackingUrl}\n\n` +
    `_Thank you for ordering with BhookIt!_`
  );
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

// -------------------------------------------------------------
// 9C. RESTAURANT POS (POINT OF SALE) ENGINE & THERMAL RECEIPT
// -------------------------------------------------------------
let currentPosVendorId = 1;
let posCart = [];
let posOrderType = 'Dine-In';
let posSelectedCategory = 'All';
let posTenderMode = 'Cash';

function openPosModal() {
  const select = document.getElementById('posVendorSelect');
  if (select) {
    select.innerHTML = appData.restaurants.map(r => `
      <option value="${r.id}" ${r.id === currentPosVendorId ? 'selected' : ''}>${r.name}</option>
    `).join('');
  }
  setPosOrderType(posOrderType);
  renderPosCategories();
  renderPosCatalog();
  renderPosTicket();
  openModal('posModal');
}

function switchPosVendor(vendorId) {
  currentPosVendorId = Number(vendorId);
  posCart = [];
  renderPosCategories();
  renderPosCatalog();
  renderPosTicket();
}

function setPosOrderType(type) {
  posOrderType = type;
  const btnDine = document.getElementById('posTypeDineIn');
  const btnTake = document.getElementById('posTypeTakeaway');
  const btnDel = document.getElementById('posTypeDelivery');
  const tableRow = document.getElementById('posTableSelectRow');

  if (btnDine) btnDine.classList.toggle('active', type === 'Dine-In');
  if (btnTake) btnTake.classList.toggle('active', type === 'Takeaway');
  if (btnDel) btnDel.classList.toggle('active', type === 'Delivery');

  if (tableRow) {
    tableRow.style.display = type === 'Dine-In' ? 'flex' : 'none';
  }
}

function renderPosCategories() {
  const strip = document.getElementById('posCategoryStrip');
  if (!strip) return;
  const rest = appData.restaurants.find(r => r.id === currentPosVendorId) || appData.restaurants[0];
  const cats = ['All', ...new Set((rest?.foods || []).map(f => f.category))];
  strip.innerHTML = cats.map(c => `
    <button type="button" class="category-pill ${posSelectedCategory === c ? 'active' : ''}" onclick="filterPosCategory('${c}')">
      ${c}
    </button>
  `).join('');
}

function filterPosCategory(cat) {
  posSelectedCategory = cat;
  renderPosCategories();
  renderPosCatalog();
}

function renderPosCatalog() {
  const grid = document.getElementById('posItemsGrid');
  if (!grid) return;
  const rest = appData.restaurants.find(r => r.id === currentPosVendorId) || appData.restaurants[0];
  const q = (document.getElementById('posSearchInput')?.value || '').trim().toLowerCase();

  let foods = rest?.foods || [];
  if (posSelectedCategory !== 'All') {
    foods = foods.filter(f => f.category === posSelectedCategory);
  }
  if (q) {
    foods = foods.filter(f => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
  }

  if (!foods.length) {
    grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:20px;">No dishes match search in this category.</p>';
    return;
  }

  grid.innerHTML = foods.map(f => `
    <div class="pos-item-card" onclick="addPosItem(${f.id})">
      <div style="font-size: 28px; margin-bottom: 4px;">${f.veg ? '🥗' : '🍗'}</div>
      <div class="pos-item-name">${f.name}</div>
      <div class="pos-item-price">₹${f.price}</div>
    </div>
  `).join('');
}

function addPosItem(foodId) {
  const rest = appData.restaurants.find(r => r.id === currentPosVendorId) || appData.restaurants[0];
  const food = (rest?.foods || []).find(f => f.id === foodId);
  if (!food) return;

  const existing = posCart.find(i => i.food.id === foodId);
  if (existing) {
    existing.qty++;
  } else {
    posCart.push({ food, qty: 1 });
  }

  playSound('chime');
  renderPosTicket();
}

function changePosItemQty(idx, delta) {
  if (!posCart[idx]) return;
  posCart[idx].qty += delta;
  if (posCart[idx].qty <= 0) {
    posCart.splice(idx, 1);
  }
  renderPosTicket();
}

function renderPosTicket() {
  const container = document.getElementById('posTicketItems');
  const subtotalEl = document.getElementById('posSubtotal');
  const taxesEl = document.getElementById('posTaxes');
  const grandTotalEl = document.getElementById('posGrandTotal');

  const subtotal = posCart.reduce((sum, i) => sum + (i.food.price * i.qty), 0);
  const taxes = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + taxes;

  if (subtotalEl) subtotalEl.textContent = subtotal;
  if (taxesEl) taxesEl.textContent = taxes;
  if (grandTotalEl) grandTotalEl.textContent = grandTotal;

  if (!container) return;

  if (!posCart.length) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 30px 10px;">
        <div style="font-size: 32px; margin-bottom: 6px;">🧾</div>
        <div style="font-weight: 700; font-size: 13px;">Ticket is empty</div>
        <div style="font-size: 11px;">Touch dishes on left catalog to add to order.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = posCart.map((item, idx) => `
    <div class="pos-ticket-row">
      <div class="pos-ticket-row-title">
        ${item.food.name}
        <div style="font-size: 10px; color: var(--text-muted); font-weight: normal;">₹${item.food.price} × ${item.qty}</div>
      </div>
      <div class="pos-ticket-qty-controls">
        <button type="button" class="pos-qty-btn" onclick="changePosItemQty(${idx}, -1)">−</button>
        <span style="font-size: 12px; font-weight: 800; min-width: 14px; text-align: center;">${item.qty}</span>
        <button type="button" class="pos-qty-btn" onclick="changePosItemQty(${idx}, 1)">+</button>
      </div>
      <span style="font-weight: 800; font-size: 12px; min-width: 48px; text-align: right;">₹${item.food.price * item.qty}</span>
    </div>
  `).join('');
}

function setPosTender(tender) {
  posTenderMode = tender;
  document.querySelectorAll('.pos-tender-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.includes(tender.split(' ')[0]));
  });
}

function clearPosTicket() {
  if (posCart.length && !confirm('Clear current ticket items?')) return;
  posCart = [];
  renderPosTicket();
}

function printPosKot() {
  if (!posCart.length) {
    showToast('Cannot print KOT for an empty ticket!', 'warning');
    return;
  }
  const table = posOrderType === 'Dine-In' ? (document.getElementById('posTableSelect')?.value || 'Table 1') : posOrderType;
  const rest = appData.restaurants.find(r => r.id === currentPosVendorId) || appData.restaurants[0];
  playSound('delivered');
  showToast(`ðŸ‘¨â€ðŸ³ Kitchen Order Ticket (KOT) printed for ${table} at ${rest.name}!`, 'success');
  speakVoiceAlert(`Kitchen order ticket printed for ${table}.`);
}

function printPosThermalReceipt() {
  if (!posCart.length) {
    showToast('Add dishes to ticket before previewing receipt!', 'warning');
    return;
  }

  const rest = appData.restaurants.find(r => r.id === currentPosVendorId) || appData.restaurants[0];
  const table = posOrderType === 'Dine-In' ? (document.getElementById('posTableSelect')?.value || 'Table 1') : posOrderType;
  const subtotal = posCart.reduce((sum, i) => sum + (i.food.price * i.qty), 0);
  const cgst = Math.round(subtotal * 0.025);
  const sgst = Math.round(subtotal * 0.025);
  const total = subtotal + cgst + sgst;

  document.getElementById('thRestName').textContent = rest.name;
  document.getElementById('thFssai').textContent = rest.fssai || '11524012000101';
  document.getElementById('thGstin').textContent = rest.gstin || '27AAACF1001F1Z1';
  document.getElementById('thInvoiceNo').textContent = 'POS-' + Math.floor(1000 + Math.random() * 9000);
  document.getElementById('thDate').textContent = new Date().toLocaleDateString('en-IN');
  document.getElementById('thOrderType').textContent = `${posOrderType} (${table})`;
  document.getElementById('thPaymentMode').textContent = posTenderMode;

  const tbody = document.getElementById('thItemsBody');
  if (tbody) {
    tbody.innerHTML = posCart.map(i => `
      <tr>
        <td style="padding: 2px 0;">${i.food.name}</td>
        <td style="text-align: center;">${i.qty}</td>
        <td style="text-align: right;">₹${i.food.price}</td>
        <td style="text-align: right;">₹${i.food.price * i.qty}</td>
      </tr>
    `).join('');
  }

  document.getElementById('thSubtotal').textContent = subtotal;
  document.getElementById('thCgst').textContent = cgst;
  document.getElementById('thSgst').textContent = sgst;
  document.getElementById('thGrandTotal').textContent = total;

  openModal('thermalReceiptModal');
}

function printThermalDoc() {
  window.print();
}

function completePosOrder() {
  if (!posCart.length) {
    showToast('Ticket is empty! Add items first.', 'warning');
    return;
  }

  const rest = appData.restaurants.find(r => r.id === currentPosVendorId) || appData.restaurants[0];
  const table = posOrderType === 'Dine-In' ? (document.getElementById('posTableSelect')?.value || 'Table 1') : posOrderType;
  const subtotal = posCart.reduce((sum, i) => sum + (i.food.price * i.qty), 0);
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + taxes;
  const custName = document.getElementById('posCustName')?.value.trim() || 'Counter Walk-In';
  const custPhone = document.getElementById('posCustPhone')?.value.trim() || '9876500000';
  const orderId = 'POS-' + Math.floor(1000 + Math.random() * 9000);

  const posOrder = {
    id: orderId,
    invoiceNo: `POSINV-${Date.now().toString().slice(-6)}`,
    userId: appData.currentUser?.id || 'usr_walkin',
    restaurantId: rest.id,
    restaurantName: rest.name,
    customer: {
      name: custName,
      phone: custPhone,
      address: `${posOrderType} - ${table}`
    },
    items: posCart.map(i => ({
      restaurantId: rest.id,
      restaurantName: rest.name,
      foodId: i.food.id,
      name: i.food.name,
      price: i.food.price,
      qty: i.qty,
      addons: []
    })),
    subtotal,
    deliveryFee: 0,
    taxes,
    discount: 0,
    couponCode: '',
    walletRedeemed: 0,
    total,
    status: 'Delivered',
    orderSource: 'POS Terminal',
    tableNumber: table,
    deliveryOtp: '',
    deliveryBoy: 'Counter Staff',
    payment: posTenderMode,
    paymentStatus: 'Paid',
    transactionId: `TXN-POS-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  appData.orders.unshift(posOrder);
  saveState();
  playSound('delivered');
  showToast(`🎉 POS Order #${orderId} settled & recorded successfully!`, 'success');

  // Open thermal receipt for printing
  printPosThermalReceipt();

  // Reset ticket
  posCart = [];
  renderPosTicket();
  if (document.getElementById('posCustName')) document.getElementById('posCustName').value = '';
  if (document.getElementById('posCustPhone')) document.getElementById('posCustPhone').value = '';
}

// -------------------------------------------------------------
// 9D. SUPER ADMIN LIVE RIDER FLEET RADAR & TELEMETRY
// -------------------------------------------------------------
let adminFleetMap = null;
let fleetMapMarkers = {};

const FLEET_RIDERS = [
  { id: 'rd_1', name: 'Vikram Rider', phone: '+91 9988771122', lat: 21.0860, lng: 79.9890, battery: 92, speed: 28, status: 'Active (En Route)', activeOrder: 'FB-98214' },
  { id: 'rd_2', name: 'Rahul Shinde', phone: '+91 9877665544', lat: 21.0895, lng: 79.9950, battery: 74, speed: 0, status: 'At Sakoli Corner (Pickup)', activeOrder: 'FB-10492' },
  { id: 'rd_3', name: 'Amit Patil', phone: '+91 9766554433', lat: 21.0920, lng: 79.9980, battery: 85, speed: 32, status: 'Returning to Pool', activeOrder: 'Idle' }
];

function renderAdminFleetRadar() {
  const container = document.getElementById('adminFleetCards');
  if (container) {
    container.innerHTML = FLEET_RIDERS.map(r => `
      <div style="background: var(--bg-card); padding: 12px; border-radius: var(--radius-sm); border: 1.5px solid var(--border);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <b style="font-size: 13px;">🛵 ${r.name}</b>
          <span class="badge" style="background: #ecfdf5; color: #059669; font-size: 10px;">${r.speed > 0 ? `${r.speed} km/h` : 'Stopped'}</span>
        </div>
        <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 6px;">${r.phone} • Battery: <b>${r.battery}% 🔋</b></div>
        <div style="font-size: 11px; background: var(--bg-main); padding: 4px 8px; border-radius: 4px;">
          Status: <b>${r.status}</b><br>
          Assigned: <span style="color: var(--primary); font-weight: 700;">${r.activeOrder}</span>
        </div>
      </div>
    `).join('');
  }

  const mapEl = document.getElementById('adminFleetMap');
  if (!mapEl || typeof L === 'undefined') return;

  if (!adminFleetMap) {
    adminFleetMap = L.map('adminFleetMap', {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([21.0880, 79.9930], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(adminFleetMap);
  }

  // Update or create markers
  FLEET_RIDERS.forEach(r => {
    const icon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div class="map-icon-bubble rider" title="${r.name}" style="background: #0284c7;">🛵</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    if (fleetMapMarkers[r.id]) {
      fleetMapMarkers[r.id].setLatLng([r.lat, r.lng]);
      fleetMapMarkers[r.id].setPopupContent(`<b>🛵 ${r.name}</b><br>Speed: ${r.speed} km/h<br>Battery: ${r.battery}%<br>Order: ${r.activeOrder}`);
    } else {
      fleetMapMarkers[r.id] = L.marker([r.lat, r.lng], { icon })
        .addTo(adminFleetMap)
        .bindPopup(`<b>🛵 ${r.name}</b><br>Speed: ${r.speed} km/h<br>Battery: ${r.battery}%<br>Order: ${r.activeOrder}`);
    }
  });
}

function simulateFleetMovement() {
  FLEET_RIDERS.forEach(r => {
    // Nudge latitude & longitude slightly
    r.lat += (Math.random() - 0.5) * 0.0012;
    r.lng += (Math.random() - 0.5) * 0.0012;
    r.speed = Math.floor(18 + Math.random() * 22);
    r.battery = Math.max(15, r.battery - (Math.random() > 0.7 ? 1 : 0));
  });

  renderAdminFleetRadar();
  playSound('chime');
  showToast('🔄 Fleet radar GPS telemetry refreshed for all active riders!', 'info');
}

// -------------------------------------------------------------
// 10. FIREBASE INTEGRATION ENGINE
// -------------------------------------------------------------
function connectFirebase() {
  if (!window.JB_FIREBASE_CONFIG || window.JB_FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
    alert('Please provide your active Firebase project credentials in firebase-config.js first.');
    return;
  }

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(window.JB_FIREBASE_CONFIG);
    }
    document.getElementById('cloudStatusBadge').textContent = '🟢 Firebase Synced';
    document.getElementById('cloudStatusBadge').className = 'badge online';
    document.getElementById('systemModeTag').textContent = 'Firebase Cloud Active';

    firebase.firestore().collection('orders').orderBy('createdAt', 'desc').limit(50).onSnapshot(snapshot => {
      if (!snapshot.empty) {
        appData.orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderOrdersView();
        renderRestaurantView();
        renderDeliveryView();
        renderAdminView();
      }
    });

    showToast('Connected to Firebase Firestore successfully!', 'success');
  } catch (err) {
    alert('Firebase connection error: ' + err.message);
  }
}

function downloadFirestoreRules() {
  const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    match /restaurants/{restId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{orderId} {
      allow read, create: if true;
      allow update: if request.auth != null;
    }
    match /riders/{riderId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`;
  const blob = new Blob([rules], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'firestore.rules';
  a.click();
  showToast('Downloaded firestore.rules file.', 'info');
}

// -------------------------------------------------------------
// 9E. CUSTOMER ORDER REVIEW & 5-STAR RATING SYSTEM
// -------------------------------------------------------------
let selectedFoodRating = 5;
let selectedRiderRating = 5;
let selectedCompliments = ['🔥 Piping Hot', '⚡ Super Fast'];
let reviewPhotoUploaded = false;

function openRatingModal(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;

  document.getElementById('ratingTargetOrderId').value = order.id;
  document.getElementById('ratingModalSubtitle').textContent = `Order #${order.id} • ${order.restaurantName}`;

  setRatingStars('food', 5);
  setRatingStars('rider', 5);

  const photoPrev = document.getElementById('reviewPhotoPreview');
  if (photoPrev) photoPrev.style.display = 'none';
  reviewPhotoUploaded = false;

  const commentInp = document.getElementById('reviewCommentText');
  if (commentInp) commentInp.value = '';

  openModal('ratingModal');
}

function setRatingStars(type, rating) {
  if (type === 'food') {
    selectedFoodRating = rating;
    const labels = {
      5: '5 ⭐ (Excellent)',
      4: '4 ⭐ (Very Good)',
      3: '3 ⭐ (Average)',
      2: '2 ⭐ (Needs Improvement)',
      1: '1 ⭐ (Poor)'
    };
    const lbl = document.getElementById('foodRatingLabel');
    if (lbl) lbl.textContent = labels[rating];

    const stars = document.querySelectorAll('#foodStarGroup .star-icon');
    stars.forEach((s, idx) => {
      s.classList.toggle('selected', idx < rating);
    });
  } else {
    selectedRiderRating = rating;
    const labels = {
      5: '5 ⭐ (Super Fast)',
      4: '4 ⭐ (Punctual)',
      3: '3 ⭐ (Acceptable)',
      2: '2 ⭐ (Delayed)',
      1: '1 ⭐ (Unprofessional)'
    };
    const lbl = document.getElementById('riderRatingLabel');
    if (lbl) lbl.textContent = labels[rating];

    const stars = document.querySelectorAll('#riderStarGroup .star-icon');
    stars.forEach((s, idx) => {
      s.classList.toggle('selected', idx < rating);
    });
  }
}

function toggleComplimentChip(btn) {
  btn.classList.toggle('selected');
  const txt = btn.textContent.trim();
  if (btn.classList.contains('selected')) {
    if (!selectedCompliments.includes(txt)) selectedCompliments.push(txt);
  } else {
    selectedCompliments = selectedCompliments.filter(c => c !== txt);
  }
}

function simulateReviewPhotoUpload() {
  reviewPhotoUploaded = true;
  const photoPrev = document.getElementById('reviewPhotoPreview');
  if (photoPrev) photoPrev.style.display = 'flex';
  playSound('chime');
  showToast('📸 Food photo attached to review!', 'success');
}

function submitOrderReview() {
  const orderId = document.getElementById('ratingTargetOrderId')?.value;
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;

  const comment = document.getElementById('reviewCommentText')?.value.trim() || 'Food was delicious and arrived right on time!';

  order.review = {
    foodRating: selectedFoodRating,
    riderRating: selectedRiderRating,
    compliments: [...selectedCompliments],
    comment,
    photoAttached: reviewPhotoUploaded,
    date: new Date().toLocaleDateString('en-IN')
  };

  // Recalculate restaurant rating
  const rest = appData.restaurants.find(r => r.id === order.restaurantId);
  if (rest) {
    const restReviews = appData.orders.filter(o => o.restaurantId === rest.id && o.review).map(o => o.review.foodRating);
    if (restReviews.length) {
      const avg = (restReviews.reduce((a, b) => a + b, 0) / restReviews.length).toFixed(1);
      rest.rating = parseFloat(avg);
    }
  }

  // Credit ₹20 loyalty review bonus to customer wallet
  if (appData.currentUser) {
    const bonus = 20;
    appData.currentUser.walletBalance = (appData.currentUser.walletBalance || 0) + bonus;
    if (!Array.isArray(appData.currentUser.walletLedger)) appData.currentUser.walletLedger = [];
    appData.currentUser.walletLedger.unshift({
      id: 'tx_' + Date.now(),
      type: 'credit',
      title: `ðŸŽ Review Bonus (Order #${order.id})`,
      amount: bonus,
      date: new Date().toLocaleDateString('en-IN')
    });
    pushNotification('ðŸŽ', `₹20 Bonus credited for reviewing Order #${order.id}!`);
  }

  saveState();
  closeModal('ratingModal');
  playSound('delivered');
  showToast(`🎉 Review saved! ₹20 bonus added to your BhookIt wallet.`, 'success');
  updateWalletUI();
  renderOrdersView();
  renderTrackingView();
}

// -------------------------------------------------------------
// 9F. PROOF OF DELIVERY (POD) CAMERA SYSTEM
// -------------------------------------------------------------
function openPodModal(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;

  document.getElementById('podTargetOrderId').value = order.id;
  document.getElementById('podOrderIdLabel').textContent = `Order #${order.id} • ${order.customer.name}`;
  document.getElementById('podWatermarkDate').textContent = `${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

  openModal('podModal');
}

function confirmPodCapture() {
  const orderId = document.getElementById('podTargetOrderId')?.value;
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;

  order.podCaptured = true;
  order.podTimestamp = new Date().toISOString();
  order.podImageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

  saveState();
  closeModal('podModal');
  playSound('delivered');
  showToast(`📸 Proof of Delivery (POD) saved for Order #${order.id}!`, 'success');
  renderDeliveryView();
}

// -------------------------------------------------------------
// 9G. FOODIEBOT AI SOMMELIER & LIVE SUPPORT ASSISTANT
// -------------------------------------------------------------
let foodieBotHistory = [];

function toggleFoodieBot() {
  const drawer = document.getElementById('foodieBotDrawer');
  if (!drawer) return;
  const isHidden = drawer.classList.contains('hidden');
  drawer.classList.toggle('hidden');

  if (isHidden && foodieBotHistory.length === 0) {
    const greeting = currentLanguage === 'mr' ?
      'à¤¨à¤®à¤¸à¥à¤•à¤¾à¤°! à¤®à¥€ à¤†à¤¹à¥‡ FoodieBot AI 🤖. à¤†à¤œ à¤•à¤¾à¤¯ à¤–à¤¾à¤¯à¤²à¤¾ à¤†à¤µà¤¡à¥‡à¤²? à¤¶à¤¾à¤•à¤¾à¤¹à¤¾à¤°à¥€ à¤¥à¤¾à¤³à¥€, à¤ªà¤¿à¤à¥à¤à¤¾, à¤•à¤¿à¤‚à¤µà¤¾ à¤¬à¤¿à¤°à¥à¤¯à¤¾à¤£à¥€?' :
      currentLanguage === 'hi' ?
      'à¤¨à¤®à¤¸à¥à¤¤à¥‡! à¤®à¥ˆà¤‚ à¤¹à¥‚à¤ FoodieBot AI 🤖. à¤†à¤œ à¤•à¥à¤¯à¤¾ à¤–à¤¾à¤¨à¥‡ à¤•à¤¾ à¤®à¤¨ à¤¹à¥ˆ? à¤µà¥‡à¤œ à¤¥à¤¾à¤²à¥€, à¤ªà¤¿à¤œà¥à¤œà¤¾, à¤¯à¤¾ à¤¬à¤¿à¤°à¤¯à¤¾à¤¨à¥€?' :
      'Hello there! I am FoodieBot AI 🤖. What are you craving today? I can recommend top dishes, check order ETA, or help with your cart!';
    addBotMessage(greeting);
  }
}

function openSupportChat() {
  const drawer = document.getElementById('foodieBotDrawer');
  if (drawer && drawer.classList.contains('hidden')) {
    toggleFoodieBot();
  }
  addBotMessage('👋 Hello! Live Order Support is active. Please let me know how I can assist with your delivery or order.');
}

function addBotMessage(text, dishRecommendations = []) {
  foodieBotHistory.push({ sender: 'bot', text, dishes: dishRecommendations });
  renderFoodieBotMessages();
}

function addUserMessage(text) {
  foodieBotHistory.push({ sender: 'user', text });
  renderFoodieBotMessages();
}

function renderFoodieBotMessages() {
  const container = document.getElementById('foodieBotMessages');
  if (!container) return;

  container.innerHTML = foodieBotHistory.map(m => {
    if (m.sender === 'user') {
      return `<div class="foodiebot-msg user">${m.text}</div>`;
    } else {
      let dishesHtml = '';
      if (m.dishes && m.dishes.length) {
        dishesHtml = m.dishes.map(d => `
          <div class="foodiebot-dish-card">
            <div>
              <div style="font-weight: 700; font-size: 12px;">${d.veg ? '🥗' : '🍗'} ${d.name}</div>
              <div style="font-size: 11px; color: var(--primary); font-weight: 800;">₹${d.price} • ${d.restaurantName}</div>
            </div>
            <button class="btn-primary" onclick="quickAddFromBot(${d.restaurantId}, ${d.id})" style="padding: 4px 10px; font-size: 11px; margin: 0;">
              + Add
            </button>
          </div>
        `).join('');
      }
      return `
        <div class="foodiebot-msg bot">
          <div>${m.text}</div>
          ${dishesHtml}
        </div>
      `;
    }
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function quickAddFromBot(restId, foodId) {
  const rest = appData.restaurants.find(r => r.id === restId);
  const food = (rest?.foods || []).find(f => f.id === foodId);
  if (!rest || !food) return;

  const existing = currentCart.find(i => i.foodId === food.id);
  if (existing) {
    existing.qty++;
  } else {
    currentCart.push({
      restaurantId: rest.id,
      restaurantName: rest.name,
      foodId: food.id,
      name: food.name,
      basePrice: food.price,
      price: food.price,
      qty: 1,
      addons: ['Regular']
    });
  }

  updateCartBadge();
  playSound('chime');
  showToast(`🛒 Added ${food.name} to cart!`, 'success');
}

function askFoodieBot(prompt) {
  const input = document.getElementById('foodieBotInput');
  if (input) input.value = prompt;
  sendFoodieBotMessage();
}

function sendFoodieBotMessage() {
  const input = document.getElementById('foodieBotInput');
  const text = (input?.value || '').trim();
  if (!text) return;

  addUserMessage(text);
  input.value = '';

  const lower = text.toLowerCase();

  setTimeout(() => {
    // 1. Order tracking intent
    if (lower.includes('track') || lower.includes('order') || lower.includes('status') || lower.includes('where')) {
      const activeOrder = appData.orders.find(o => o.status !== 'Delivered' && o.status !== 'Cancelled') || appData.orders[0];
      if (activeOrder) {
        addBotMessage(`📦 Order #${activeOrder.id} from ${activeOrder.restaurantName} is currently *${activeOrder.status}*!\nEstimated Delivery Time: ~${activeOrder.etaMinutes || 20} mins.`);
      } else {
        addBotMessage("You don't have any active orders right now. Would you like to explore our top-rated restaurants?");
      }
      return;
    }

    // 2. Loyalty wallet intent
    if (lower.includes('wallet') || lower.includes('cash') || lower.includes('balance') || lower.includes('money')) {
      const bal = appData.currentUser?.walletBalance || 0;
      addBotMessage(`💳 Your BhookIt Wallet has ₹${bal} available.\nYou get 5% instant cashback on every meal order and ₹20 bonus on verified reviews!`);
      return;
    }

    // 3. Dietary: Vegetarian intent
    if (lower.includes('veg') || lower.includes('paneer') || lower.includes('salad') || lower.includes('à¤¶à¤¾à¤•à¤¾à¤¹à¤¾à¤°à¥€')) {
      const vegDishes = [];
      appData.restaurants.forEach(r => {
        r.foods.filter(f => f.veg).forEach(f => {
          vegDishes.push({ ...f, restaurantId: r.id, restaurantName: r.name });
        });
      });
      const top3 = vegDishes.slice(0, 3);
      addBotMessage("🌱 Here are our most popular pure-vegetarian specialties cooked fresh:", top3);
      return;
    }

    // 4. Fast delivery / Urgent intent
    if (lower.includes('fast') || lower.includes('quick') || lower.includes('urgent') || lower.includes('25 mins')) {
      const fastRest = appData.restaurants.filter(r => (r.prepTime || '').includes('20') || (r.prepTime || '').includes('15') || r.id === 1);
      const fastDishes = [];
      fastRest.forEach(r => {
        r.foods.slice(0, 2).forEach(f => {
          fastDishes.push({ ...f, restaurantId: r.id, restaurantName: r.name });
        });
      });
      addBotMessage("⚡ These hot meals can be prepared and delivered in under 25 minutes:", fastDishes.slice(0, 3));
      return;
    }

    // 5. Biryani & Thali intent
    if (lower.includes('biryani') || lower.includes('thali') || lower.includes('rice')) {
      const biryaniDishes = [];
      appData.restaurants.forEach(r => {
        r.foods.filter(f => f.name.toLowerCase().includes('thali') || f.name.toLowerCase().includes('biryani') || f.name.toLowerCase().includes('rice')).forEach(f => {
          biryaniDishes.push({ ...f, restaurantId: r.id, restaurantName: r.name });
        });
      });
      addBotMessage("🍛 Here are our authentic Biryani and Maharastrian Thali recommendations:", biryaniDishes.slice(0, 3));
      return;
    }

    // 6. Generic food fallback
    const allDishes = [];
    appData.restaurants.forEach(r => {
      r.foods.forEach(f => allDishes.push({ ...f, restaurantId: r.id, restaurantName: r.name }));
    });
    const shuffled = allDishes.sort(() => 0.5 - Math.random()).slice(0, 2);
    addBotMessage(`Here are some delicious choices curated just for you:`, shuffled);
  }, 450);
}

// -------------------------------------------------------------
// 9H. KITCHEN REVENUE & PEAK ORDERING TRENDS ANALYTICS
// -------------------------------------------------------------
function renderVendorAnalytics(timeframe = '7days') {
  const container = document.getElementById('vendorAnalyticsBox');
  if (!container) return;

  const currentVendor = appData.restaurants.find(r => r.id === currentActiveVendorId) || appData.restaurants[0];
  const vendorOrders = appData.orders.filter(o => o.restaurantId === currentVendor.id && o.status !== 'Cancelled');

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailyRevenues = [1200, 1850, 1420, 2100, 3200, 4800, 3950];
  const maxRev = Math.max(...dailyRevenues);

  const dayBarsHtml = days.map((day, i) => {
    const rev = dailyRevenues[i];
    const pct = Math.round((rev / maxRev) * 100);
    return `
      <div class="analytics-bar-row">
        <span class="analytics-bar-label">${day}</span>
        <div class="analytics-bar-track">
          <div class="analytics-bar-fill" style="width: ${pct}%;"></div>
        </div>
        <span class="analytics-bar-val">₹${rev}</span>
      </div>
    `;
  }).join('');

  // Peak ordering hours
  const hours = [
    { slot: 'Lunch (12 PM - 3 PM)', pct: 75, count: '38 Orders' },
    { slot: 'Evening Snacks (4 - 6 PM)', pct: 45, count: '22 Orders' },
    { slot: 'Dinner (7 PM - 11 PM)', pct: 95, count: '64 Orders' },
    { slot: 'Late Night (11 PM+)', pct: 25, count: '12 Orders' }
  ];

  const peakBarsHtml = hours.map(h => `
    <div class="analytics-bar-row">
      <span class="analytics-bar-label" style="min-width: 140px;">${h.slot}</span>
      <div class="analytics-bar-track">
        <div class="analytics-bar-fill" style="width: ${h.pct}%; background: linear-gradient(90deg, #4f46e5, #06b6d4);"></div>
      </div>
      <span class="analytics-bar-val" style="min-width: 65px;">${h.count}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="analytics-card">
      <div class="analytics-card-title">
        <span>📈 7-Day Revenue Trend</span>
        <span style="font-size: 11px; color: var(--accent); font-weight: 800;">+24% vs Last Week</span>
      </div>
      <div>${dayBarsHtml}</div>
    </div>

    <div class="analytics-card">
      <div class="analytics-card-title">
        <span>⏱️  Peak Kitchen Load Hours</span>
        <span style="font-size: 11px; color: #4f46e5; font-weight: 800;">Dinner Rush Peak</span>
      </div>
      <div>${peakBarsHtml}</div>
    </div>
  `;
}

// =============================================================
// PHASE 10: VALUE COMBOS & BOGO ENGINE
// =============================================================
const SEED_COMBOS = [
  {
    id: 'combo_1',
    restaurantId: 1,
    restaurantName: 'Sakoli Food Corner',
    title: '🍔 Super Saver Burger & Fries Combo',
    badge: 'SAVE ₹40',
    price: 139,
    originalPrice: 178,
    img: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=500&q=80',
    desc: 'Crispy Veg Supreme Burger + Peri-Peri French Fries + Chilled Soft Drink'
  },
  {
    id: 'combo_2',
    restaurantId: 1,
    restaurantName: 'Sakoli Food Corner',
    title: '🍕 BOGO Pizza Party (Buy 1 Get 1 FREE)',
    badge: 'BOGO 1+1 FREE',
    price: 189,
    originalPrice: 378,
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80',
    desc: 'Buy 1 Farmhouse Cheese Pizza (7 inch) and get 1 Margherita Pizza FREE!'
  },
  {
    id: 'combo_3',
    restaurantId: 2,
    restaurantName: 'Aapla Bhojanalay',
    title: '🍛 Executive Thali & Gulab Jamun Feast',
    badge: 'CHEF SPECIAL',
    price: 199,
    originalPrice: 260,
    img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80',
    desc: 'Special Maharashtrian Veg Thali + Gulab Jamun Duo + Masala Chaas'
  }
];

function renderCombosCarousel() {
  const container = document.getElementById('combosCarousel');
  if (!container) return;

  container.innerHTML = SEED_COMBOS.map(c => `
    <div class="combo-card">
      <div class="combo-img-box">
        <img src="${c.img}" class="combo-img" alt="${c.title}">
        <span class="combo-badge-tag">${c.badge}</span>
      </div>
      <div class="combo-info">
        <span class="combo-rest-name">${c.restaurantName}</span>
        <h4 class="combo-title">${c.title}</h4>
        <p class="combo-desc">${c.desc}</p>
        <div class="combo-bottom-row">
          <div class="combo-price-group">
            <span class="combo-price-curr">₹${c.price}</span>
            <span class="combo-price-old">₹${c.originalPrice}</span>
          </div>
          <button class="btn-add-combo" onclick="addComboToCart('${c.id}')">+ Add Combo</button>
        </div>
      </div>
    </div>
  `).join('');
}

function addComboToCart(comboId) {
  const combo = SEED_COMBOS.find(c => c.id === comboId);
  if (!combo) return;

  const existing = currentCart.find(i => i.name === combo.title);
  if (existing) {
    existing.qty++;
  } else {
    currentCart.push({
      restaurantId: combo.restaurantId,
      restaurantName: combo.restaurantName,
      foodId: 'combo_' + combo.id,
      name: combo.title,
      basePrice: combo.price,
      price: combo.price,
      qty: 1,
      addons: ['Special Combo Package']
    });
  }

  updateCartBadge();
  playSound('chime');
  showToast(`🎉 Added "${combo.title}" to your cart!`, 'success');
}

// =============================================================
// PHASE 10: VIP GOLD CLUB MEMBERSHIP ENGINE
// =============================================================
let selectedVipPlanDuration = '3m';
let selectedVipPlanCost = 249;

function updateVipBannerUI() {
  const isVip = appData.currentUser && appData.currentUser.isVip;
  const tag = document.getElementById('vipStatusTag');
  const actionBtn = document.getElementById('btnVipBannerAction');
  const activeBanner = document.getElementById('vipActiveBanner');
  const activateBtn = document.getElementById('btnActivateVip');

  if (tag) {
    tag.textContent = isVip ? '👑 VIP Active' : '₹99/mo';
    tag.style.background = isVip ? '#86efac' : '#fef08a';
    tag.style.color = isVip ? '#14532d' : '#854d0e';
  }

  if (actionBtn) {
    actionBtn.textContent = isVip ? '👑 VIP Member Active ➔' : 'Explore Perks ➔';
  }

  if (activeBanner) {
    activeBanner.style.display = isVip ? 'block' : 'none';
  }

  if (activateBtn) {
    if (isVip) {
      activateBtn.innerHTML = '👑 VIP Gold Membership Active (Valid for 90 Days)';
      activateBtn.style.background = '#059669';
    } else {
      activateBtn.innerHTML = `👑 Upgrade to VIP Gold (₹<span id="vipPlanCostLabel">${selectedVipPlanCost}</span>)`;
      activateBtn.style.background = 'linear-gradient(135deg, #d97706, #b45309)';
    }
  }
}

function openMembershipModal() {
  updateVipBannerUI();
  openModal('membershipModal');
}

function selectVipPlan(planId, cost) {
  selectedVipPlanDuration = planId;
  selectedVipPlanCost = cost;

  ['planCard1m', 'planCard3m', 'planCard12m'].forEach(id => {
    document.getElementById(id)?.classList.remove('selected');
  });

  const card = document.getElementById(`planCard${planId}`);
  if (card) card.classList.add('selected');

  const lbl = document.getElementById('vipPlanCostLabel');
  if (lbl) lbl.textContent = cost;
  playSound('chime');
}

function activateVipMembership() {
  if (!appData.currentUser) {
    showToast('Please login to activate VIP Gold', 'warning');
    return;
  }

  if (appData.currentUser.isVip) {
    showToast('✨  You are already an active VIP Gold Member!', 'info');
    return;
  }

  appData.currentUser.isVip = true;
  appData.currentUser.vipExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');
  
  if (!Array.isArray(appData.currentUser.walletLedger)) appData.currentUser.walletLedger = [];
  appData.currentUser.walletLedger.unshift({
    id: 'tx_vip_' + Date.now(),
    type: 'debit',
    title: `👑 BhookIt VIP Gold Membership (${selectedVipPlanDuration.toUpperCase()})`,
    amount: selectedVipPlanCost,
    date: new Date().toLocaleDateString('en-IN')
  });

  saveState();
  updateVipBannerUI();
  updateBillTotals();
  playSound('delivered');
  pushNotification('👑', 'Welcome to BhookIt VIP Gold Club! Enjoy ₹0 delivery and 15% cashback.');
  showToast('🎉 Congratulations! You are now a BhookIt VIP Gold Member!', 'success');
  setTimeout(() => closeModal('membershipModal'), 1200);
}

// =============================================================
// PHASE 10: GROUP ORDERING & SPLIT BILL ENGINE
// =============================================================
let groupOrderState = {
  roomCode: 'ROOM-FOOD-9821',
  splitMode: 'equal',
  members: [
    { name: 'Rakesh Sharma (You - Host)', role: 'Host', isSelf: true, items: [{ name: 'Special Maharashtrian Veg Thali', price: 160, qty: 1 }], total: 160 },
    { name: 'Sneha Patil', role: 'Friend', isSelf: false, items: [{ name: 'Farmhouse Cheese Pizza (7 inch)', price: 189, qty: 1 }], total: 189 },
    { name: 'Amit Kulkarni', role: 'Friend', isSelf: false, items: [{ name: 'Crispy Veg Burger', price: 99, qty: 1 }, { name: 'Peri-Peri Fries', price: 79, qty: 1 }], total: 178 }
  ]
};

function openGroupOrderModal() {
  renderGroupOrderUI();
  openModal('groupOrderModal');
}

function copyGroupOrderLink() {
  const link = `${window.location.origin}${window.location.pathname}?party=${groupOrderState.roomCode}`;
  navigator.clipboard?.writeText(link).catch(() => {});
  showToast(`📋 Copied shared party link for ${groupOrderState.roomCode}!`, 'success');
}

function shareGroupOrderWhatsApp() {
  const total = groupOrderState.members.reduce((sum, m) => sum + m.total, 0);
  const link = `${window.location.origin}${window.location.pathname}?party=${groupOrderState.roomCode}`;
  const text = encodeURIComponent(`🍔 Hey! Join our BhookIt Group Order party room ${groupOrderState.roomCode}! Current total is ₹${total}. Tap link to add your favorite dishes: ${link}`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

function setGroupSplitMode(mode) {
  groupOrderState.splitMode = mode;
  document.getElementById('btnSplitEqual')?.classList.toggle('active', mode === 'equal');
  document.getElementById('btnSplitExact')?.classList.toggle('active', mode === 'exact');
  renderGroupOrderUI();
}

function renderGroupOrderUI() {
  const list = document.getElementById('groupMembersList');
  if (!list) return;

  const total = groupOrderState.members.reduce((sum, m) => sum + m.total, 0);
  const perPerson = Math.round(total / groupOrderState.members.length);

  const subEl = document.getElementById('groupTotalSubtotal');
  const eqEl = document.getElementById('groupEqualPerPerson');
  if (subEl) subEl.textContent = total;
  if (eqEl) eqEl.textContent = perPerson;

  list.innerHTML = groupOrderState.members.map((m, idx) => {
    const dueAmount = groupOrderState.splitMode === 'equal' ? perPerson : m.total;
    const itemsSummary = m.items.map(i => `${i.name} (x${i.qty})`).join(', ');

    return `
      <div class="group-member-card">
        <div class="group-member-info">
          <div class="group-member-avatar">${m.name.charAt(0)}</div>
          <div>
            <div style="font-weight: 800; font-size: 13px;">${m.name}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${itemsSummary}</div>
          </div>
        </div>
        <div style="text-align: right; display: flex; align-items: center; gap: 8px;">
          <div>
            <div style="font-weight: 900; font-size: 14px; color: var(--primary);">₹${dueAmount}</div>
            <div style="font-size: 10px; color: var(--text-muted);">${groupOrderState.splitMode === 'equal' ? 'Equal share' : 'Exact items'}</div>
          </div>
          ${!m.isSelf ? `
            <button class="btn-secondary" onclick="sendGroupUpiWhatsApp(${idx})" style="padding: 4px 8px; font-size: 11px; background: #25d366; color: #fff; border-color: #25d366;" title="Send WhatsApp UPI Request">
              💬 UPI
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function sendGroupUpiWhatsApp(idx) {
  const m = groupOrderState.members[idx];
  if (!m) return;
  const total = groupOrderState.members.reduce((sum, mem) => sum + mem.total, 0);
  const perPerson = Math.round(total / groupOrderState.members.length);
  const due = groupOrderState.splitMode === 'equal' ? perPerson : m.total;

  const upiLink = `upi://pay?pa=bhookit@okhdfcbank&pn=BhookIt&am=${due}&cu=INR&tn=BhookItGroupOrder`;
  const text = encodeURIComponent(`Hi ${m.name}, your share for the BhookIt Group Order (${groupOrderState.roomCode}) is ₹${due}. Tap to pay via UPI: ${upiLink}`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

function mergeGroupOrderToCart() {
  groupOrderState.members.forEach(m => {
    m.items.forEach(it => {
      const existing = currentCart.find(i => i.name === it.name);
      if (existing) {
        existing.qty += it.qty;
      } else {
        currentCart.push({
          restaurantId: 1,
          restaurantName: 'Sakoli Food Corner',
          foodId: 'grp_' + Math.floor(Math.random() * 1000),
          name: it.name,
          basePrice: it.price,
          price: it.price,
          qty: it.qty,
          addons: [`Added by ${m.name}`]
        });
      }
    });
  });

  closeModal('groupOrderModal');
  updateCartBadge();
  show('cart');
  showToast('🎉 All group items merged into your Cart for checkout!', 'success');
}

// =============================================================
// PHASE 10: KITCHEN DISPLAY SYSTEM (KDS) KANBAN ENGINE
// =============================================================
let currentKdsVendorId = 1;
let kdsSoundActive = true;
let kdsClockInterval = null;

function openKdsModal() {
  const sel = document.getElementById('kdsVendorSelect');
  if (sel) {
    sel.innerHTML = appData.restaurants.map(r => `
      <option value="${r.id}" ${r.id === currentKdsVendorId ? 'selected' : ''}>${r.name}</option>
    `).join('');
  }

  if (!kdsClockInterval) {
    kdsClockInterval = setInterval(updateKdsClock, 1000);
  }
  updateKdsClock();

  renderKdsBoard();
  openModal('kdsModal');
}

function updateKdsClock() {
  const clock = document.getElementById('kdsLiveClock');
  if (clock) {
    clock.textContent = new Date().toLocaleTimeString('en-US');
  }
}

function switchKdsVendor(vendorId) {
  currentKdsVendorId = parseInt(vendorId, 10);
  renderKdsBoard();
}

function toggleKdsSound() {
  kdsSoundActive = !kdsSoundActive;
  const btn = document.getElementById('kdsSoundToggleBtn');
  if (btn) btn.textContent = kdsSoundActive ? '🔊 KDS Bell: ON' : '🔇 KDS Bell: OFF';
  showToast(`KDS Kitchen Bell ${kdsSoundActive ? 'Activated' : 'Muted'}`, 'info');
}

function renderKdsBoard() {
  const vendorOrders = appData.orders.filter(o => o.restaurantId === currentKdsVendorId);

  const newOrders = vendorOrders.filter(o => o.status === 'New' || o.status === 'Pending');
  const prepOrders = vendorOrders.filter(o => o.status === 'Accepted' || o.status === 'Preparing');
  const readyOrders = vendorOrders.filter(o => o.status === 'Ready');

  const elNew = document.getElementById('kdsCountNew');
  const elPrep = document.getElementById('kdsCountPreparing');
  const elReady = document.getElementById('kdsCountReady');

  if (elNew) elNew.textContent = newOrders.length;
  if (elPrep) elPrep.textContent = prepOrders.length;
  if (elReady) elReady.textContent = readyOrders.length;

  const colNew = document.getElementById('kdsColNewList');
  const colPrep = document.getElementById('kdsColPreparingList');
  const colReady = document.getElementById('kdsColReadyList');

  if (colNew) colNew.innerHTML = renderKdsTicketsHtml(newOrders, 'new');
  if (colPrep) colPrep.innerHTML = renderKdsTicketsHtml(prepOrders, 'prep');
  if (colReady) colReady.innerHTML = renderKdsTicketsHtml(readyOrders, 'ready');
}

function renderKdsTicketsHtml(orders, stage) {
  if (!orders.length) {
    return `<div style="text-align: center; padding: 24px 10px; color: #64748b; font-size: 12px;">No active orders in this station</div>`;
  }

  const now = Date.now();

  return orders.map(o => {
    const elapsedMins = Math.floor((now - new Date(o.createdAt).getTime()) / 60000);
    const slaClass = elapsedMins < 10 ? 'green' : elapsedMins < 18 ? 'yellow' : 'red';
    const isDineIn = (o.customer?.address && o.customer.address.includes('Table')) || (o.invoiceNo && o.invoiceNo.includes('POS'));

    let actionBtnHtml = '';
    if (stage === 'new') {
      actionBtnHtml = `<button class="btn-kds-bump start" onclick="bumpKdsOrder('${o.id}', 'Preparing')">ðŸ³ Start Cooking</button>`;
    } else if (stage === 'prep') {
      actionBtnHtml = `<button class="btn-kds-bump ready" onclick="bumpKdsOrder('${o.id}', 'Ready')">✅ Mark Ready for Pickup</button>`;
    } else if (stage === 'ready') {
      actionBtnHtml = `<button class="btn-kds-bump dispatch" onclick="bumpKdsOrder('${o.id}', 'Dispatched')">🚀 Handover to Rider</button>`;
    }

    return `
      <div class="kds-ticket-card">
        <div class="kds-ticket-top">
          <div>
            <span class="kds-ticket-id">#${o.id}</span>
            <span class="kds-ticket-type ${isDineIn ? 'dinein' : 'delivery'}">${isDineIn ? 'Dine-In' : 'Delivery'}</span>
          </div>
          <span class="kds-timer-badge ${slaClass}">⏱️ ${elapsedMins}m</span>
        </div>

        <div style="font-size: 11px; color: #94a3b8;">
          <span>👤 ${o.customer?.name || 'Guest'}</span> • <span>${o.items.length} items</span>
        </div>

        <div class="kds-ticket-items">
          ${o.items.map(it => `
            <div class="kds-ticket-item-row">
              <span style="font-weight: 700; color: #f8fafc;">${it.qty}x ${it.name}</span>
              <span style="color: #94a3b8; font-size: 11px;">${it.addons ? it.addons.slice(0,1).join('') : ''}</span>
            </div>
          `).join('')}
        </div>

        ${actionBtnHtml}
      </div>
    `;
  }).join('');
}

function bumpKdsOrder(orderId, nextStatus) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;

  order.status = nextStatus;

  if (nextStatus === 'Preparing') {
    speakVoiceAlert(`Kitchen started preparing Order #${order.id}`);
    showToast(`Order #${order.id} is now COOKING 🔥`, 'info');
  } else if (nextStatus === 'Ready') {
    speakVoiceAlert(`Order #${order.id} is packaged and ready for pickup!`);
    showToast(`Order #${order.id} is PACKAGED & READY ✅`, 'success');
  } else if (nextStatus === 'Dispatched') {
    order.status = 'Out for Delivery';
    order.deliveryBoy = 'Vikram (Rider #1)';
    order.riderPhone = '+91 9822001122';
    showToast(`Order #${order.id} handed over to Rider Vikram 🛵`, 'success');
  }

  saveState();
  if (kdsSoundActive) playSound('delivered');
  renderKdsBoard();
  renderVendorOrders();
  renderTrackingView();
  renderOrdersView();
}

// -------------------------------------------------------------
// PHASE 11: GAMIFIED LUCKY SPIN WHEEL ENGINE
// -------------------------------------------------------------
const LUCKY_SECTORS = [
  { label: '₹50 OFF', color: '#ec4899', textColor: '#ffffff', type: 'coupon', value: 'SPIN50', title: 'You Won ₹50 OFF!', sub: 'Use coupon code SPIN50 on orders above ₹199.' },
  { label: 'Free Dessert', color: '#8b5cf6', textColor: '#ffffff', type: 'wallet', value: 40, title: 'You Won Free Dessert (₹40 Cash)!', sub: '₹40 instant bonus added to your BhookIt wallet.' },
  { label: '₹30 Cash', color: '#10b981', textColor: '#ffffff', type: 'wallet', value: 30, title: 'You Won ₹30 Wallet Cash!', sub: '₹30 instantly credited to your BhookIt wallet.' },
  { label: '15% Discount', color: '#f59e0b', textColor: '#ffffff', type: 'coupon', value: 'LUCKY15', title: 'You Won 15% OFF Coupon!', sub: 'Use coupon LUCKY15 on your next delicious meal.' },
  { label: 'Free Delivery', color: '#3b82f6', textColor: '#ffffff', type: 'coupon', value: 'FREEDEL', title: 'You Won Free Delivery!', sub: 'Coupon FREEDEL auto-applied to waive ₹30 delivery fee.' },
  { label: 'VIP Pass', color: '#d946ef', textColor: '#ffffff', type: 'vip', value: 1, title: 'You Won 1-Day VIP Gold Pass!', sub: 'Enjoy ₹0 delivery fees and 15% wallet cashback for 24h!' },
  { label: '₹100 Mega Win', color: '#ef4444', textColor: '#ffffff', type: 'wallet', value: 100, title: 'MEGA WIN! ₹100 Wallet Cash!', sub: '₹100 jackpot cash credited to your BhookIt wallet.' },
  { label: 'BOGO 50%', color: '#06b6d4', textColor: '#ffffff', type: 'coupon', value: 'BOGO50', title: 'You Won 50% OFF Combo Coupon!', sub: 'Use coupon BOGO50 on any meal combo deal.' }
];

let isSpinningWheel = false;
let currentWheelAngle = 0;
let pendingWonPrize = null;

function openGamificationModal() {
  const winBox = document.getElementById('luckyWinBox');
  if (winBox) winBox.classList.add('hidden');
  const spinBtn = document.getElementById('btnSpinWheel');
  if (spinBtn) {
    spinBtn.disabled = false;
    spinBtn.style.opacity = '1';
    spinBtn.innerHTML = 'SPIN<br>NOW';
  }
  openModal('gamificationModal');
  setTimeout(() => {
    drawLuckyWheel(currentWheelAngle);
  }, 60);
}

function drawLuckyWheel(currentAngle) {
  const canvas = document.getElementById('luckyWheelCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const numSlices = LUCKY_SECTORS.length;
  const arc = (2 * Math.PI) / numSlices;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = (canvas.width / 2) - 8;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw outer glowing ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 4, 0, 2 * Math.PI);
  ctx.fillStyle = '#1e293b';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#fbbf24';
  ctx.stroke();
  ctx.restore();

  // Draw wheel slices
  for (let i = 0; i < numSlices; i++) {
    const angle = currentAngle + (i * arc);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle, angle + arc);
    ctx.closePath();
    ctx.fillStyle = LUCKY_SECTORS[i].color;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Draw text on slice
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle + (arc / 2));
    ctx.textAlign = 'right';
    ctx.fillStyle = LUCKY_SECTORS[i].textColor || '#ffffff';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 4;
    ctx.fillText(LUCKY_SECTORS[i].label, radius - 20, 4);
    ctx.restore();
  }

  // Draw outer decorative pins/bulbs
  for (let i = 0; i < numSlices * 2; i++) {
    const pinAngle = currentAngle + (i * (Math.PI / numSlices));
    const pinX = centerX + (radius + 2) * Math.cos(pinAngle);
    const pinY = centerY + (radius + 2) * Math.sin(pinAngle);
    ctx.beginPath();
    ctx.arc(pinX, pinY, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#fef08a';
    ctx.fill();
  }

  // Draw center golden rim
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, 38, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#f59e0b';
  ctx.stroke();
  ctx.restore();
}

function spinLuckyWheel() {
  if (isSpinningWheel) return;
  isSpinningWheel = true;

  const spinBtn = document.getElementById('btnSpinWheel');
  if (spinBtn) {
    spinBtn.disabled = true;
    spinBtn.style.opacity = '0.7';
    spinBtn.innerHTML = 'GOOD<br>LUCK!';
  }

  const winBox = document.getElementById('luckyWinBox');
  if (winBox) winBox.classList.add('hidden');

  // Random landing prize index (0 to 7)
  const targetIndex = Math.floor(Math.random() * LUCKY_SECTORS.length);
  const numSlices = LUCKY_SECTORS.length;
  const arc = (2 * Math.PI) / numSlices;

  // The pointer is at the TOP (angle = 3*PI/2)
  // We want (3*PI/2 - finalAngle) mod 2PI to land at targetIndex center
  const targetSliceMid = (targetIndex + 0.5) * arc;
  const targetRemainder = ((3 * Math.PI / 2) - targetSliceMid + (2 * Math.PI * 10)) % (2 * Math.PI);

  const fullRotations = (5 + Math.floor(Math.random() * 3)) * (2 * Math.PI);
  const startAngle = currentWheelAngle;
  const totalAngleToRotate = fullRotations + targetRemainder - (startAngle % (2 * Math.PI));
  const finalAngle = startAngle + totalAngleToRotate;

  const duration = 3800;
  const startTime = performance.now();
  let lastTickSoundAngle = startAngle;

  function animateWheel(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    // Smooth deceleration ease-out quartic
    const easeOut = 1 - Math.pow(1 - progress, 4);

    currentWheelAngle = startAngle + (totalAngleToRotate * easeOut);
    drawLuckyWheel(currentWheelAngle);

    // Audio click effect on slice passage
    if (Math.abs(currentWheelAngle - lastTickSoundAngle) > (arc / 2)) {
      playSound('click');
      lastTickSoundAngle = currentWheelAngle;
    }

    if (progress < 1) {
      requestAnimationFrame(animateWheel);
    } else {
      isSpinningWheel = false;
      currentWheelAngle = finalAngle;
      drawLuckyWheel(currentWheelAngle);
      showLuckyWin(LUCKY_SECTORS[targetIndex]);
    }
  }

  requestAnimationFrame(animateWheel);
}

function showLuckyWin(prize) {
  pendingWonPrize = prize;
  playSound('order_placed');

  const winBox = document.getElementById('luckyWinBox');
  const winTitle = document.getElementById('luckyWinTitle');
  const winSub = document.getElementById('luckyWinSubtitle');
  const spinBtn = document.getElementById('btnSpinWheel');

  if (winTitle) winTitle.textContent = prize.title;
  if (winSub) winSub.innerHTML = prize.sub;
  if (winBox) winBox.classList.remove('hidden');
  if (spinBtn) spinBtn.innerHTML = 'WON<br>🎉';
}

function claimLuckyReward() {
  if (!pendingWonPrize) return;

  if (pendingWonPrize.type === 'coupon') {
    if (!appData.settings.coupons) appData.settings.coupons = {};
    appData.settings.coupons[pendingWonPrize.value] = {
      type: 'flat',
      value: pendingWonPrize.value === 'SPIN50' ? 50 : 30,
      min: 199
    };
    appliedCouponCode = pendingWonPrize.value;
    const couponInput = document.getElementById('couponCodeInput');
    if (couponInput) couponInput.value = pendingWonPrize.value;
    showToast(`🎉 Coupon ${pendingWonPrize.value} applied to your cart!`, 'success');
  } else if (pendingWonPrize.type === 'wallet') {
    if (!appData.currentUser) appData.currentUser = { walletBalance: 0, walletLedger: [] };
    appData.currentUser.walletBalance = (appData.currentUser.walletBalance || 0) + pendingWonPrize.value;
    if (!Array.isArray(appData.currentUser.walletLedger)) appData.currentUser.walletLedger = [];
    appData.currentUser.walletLedger.unshift({
      id: 'tx_' + Date.now(),
      type: 'credit',
      title: `ðŸŽ ${pendingWonPrize.title}`,
      amount: pendingWonPrize.value,
      date: new Date().toLocaleDateString('en-IN')
    });
    pushNotification('ðŸŽ', `₹${pendingWonPrize.value} won from Daily Lucky Wheel credited to your wallet!`);
    showToast(`💰 ₹${pendingWonPrize.value} credited to your BhookIt Wallet!`, 'success');
  } else if (pendingWonPrize.type === 'vip') {
    if (appData.currentUser) {
      appData.currentUser.isVip = true;
      pushNotification('👑', 'VIP Gold Club pass activated! Enjoy ₹0 delivery and 15% cashback.');
      showToast('👑 VIP Gold Pass activated! Enjoy ₹0 delivery!', 'success');
    }
  }

  saveState();
  updateWalletUI();
  updateUserBadge();
  closeModal('gamificationModal');
}

// -------------------------------------------------------------
// PHASE 11: CUSTOMER ORDER DISPUTE & INSTANT REFUND DESK
// -------------------------------------------------------------
let selectedDisputeRatio = 1.0;
let selectedDisputeReasonText = 'Spilled Packaging / Damaged Food';

function openDisputeModal(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) {
    showToast('Order not found for dispute.', 'error');
    return;
  }

  document.getElementById('disputeTargetOrderId').value = order.id;
  const subtitle = document.getElementById('disputeModalSubtitle');
  if (subtitle) {
    subtitle.textContent = `Order #${order.id} • Total: ₹${order.total} • Delivered by ${order.deliveryBoy || 'Delivery Partner'}`;
  }

  const detailsInput = document.getElementById('disputeDetailsInput');
  if (detailsInput) detailsInput.value = '';

  selectedDisputeRatio = 1.0;
  selectedDisputeReasonText = 'Spilled Packaging / Damaged Food';

  // Reset chip active states
  const chips = document.querySelectorAll('.dispute-reason-chip');
  chips.forEach((c, idx) => {
    if (idx === 0) c.classList.add('selected');
    else c.classList.remove('selected');
  });

  const refundAmtEl = document.getElementById('disputeRefundAmount');
  if (refundAmtEl) refundAmtEl.textContent = `₹${order.total}`;
  const noteEl = document.getElementById('disputeRefundNote');
  if (noteEl) noteEl.textContent = 'Approved for 100% Instant Wallet Refund';

  openModal('disputeModal');
}

function selectDisputeReason(btn, ratio, reasonText) {
  const chips = document.querySelectorAll('.dispute-reason-chip');
  chips.forEach(c => c.classList.remove('selected'));
  if (btn) btn.classList.add('selected');

  selectedDisputeRatio = ratio;
  selectedDisputeReasonText = reasonText;

  const orderId = document.getElementById('disputeTargetOrderId')?.value;
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;

  const refundAmt = Math.max(10, Math.round(order.total * ratio));
  const refundAmtEl = document.getElementById('disputeRefundAmount');
  if (refundAmtEl) refundAmtEl.textContent = `₹${refundAmt}`;

  const noteEl = document.getElementById('disputeRefundNote');
  if (noteEl) {
    noteEl.textContent = ratio === 1.0 ? 'Approved for 100% Instant Wallet Refund' : 'Approved for 50% Instant Goodwill Refund';
  }
}

function confirmInstantRefund() {
  const orderId = document.getElementById('disputeTargetOrderId')?.value;
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;

  const details = document.getElementById('disputeDetailsInput')?.value.trim() || 'Customer requested instant resolution.';
  const refundAmount = Math.max(10, Math.round(order.total * selectedDisputeRatio));

  // Add refund to customer wallet
  if (!appData.currentUser) appData.currentUser = { walletBalance: 0, walletLedger: [] };
  appData.currentUser.walletBalance = (appData.currentUser.walletBalance || 0) + refundAmount;
  if (!Array.isArray(appData.currentUser.walletLedger)) appData.currentUser.walletLedger = [];

  appData.currentUser.walletLedger.unshift({
    id: 'tx_' + Date.now(),
    type: 'credit',
    title: `âš ï¸ Instant Refund: Order #${order.id} (${selectedDisputeReasonText})`,
    amount: refundAmount,
    date: new Date().toLocaleDateString('en-IN')
  });

  // Mark order dispute
  order.dispute = {
    reason: selectedDisputeReasonText,
    details: details,
    refundAmount: refundAmount,
    status: `Refunded (₹${refundAmount})`,
    timestamp: new Date().toISOString()
  };

  // Add to central disputes list
  if (!Array.isArray(appData.disputes)) appData.disputes = [];
  appData.disputes.unshift({
    id: 'DSP-' + Math.floor(10000 + Math.random() * 90000),
    orderId: order.id,
    customerName: order.customer.name,
    restaurantName: order.restaurantName,
    amount: refundAmount,
    reason: selectedDisputeReasonText,
    details: details,
    status: 'Instant Refund Approved',
    timestamp: new Date().toISOString()
  });

  pushNotification('âš ï¸', `₹${refundAmount} has been credited to your BhookIt wallet for Order #${order.id}.`);
  saveState();
  updateWalletUI();
  playSound('chime');
  showToast(`✅ ₹${refundAmount} refunded instantly to your BhookIt Wallet!`, 'success');

  closeModal('disputeModal');
  renderOrdersView();
  renderAdminDisputes();
}

function renderAdminDisputes() {
  const container = document.getElementById('adminDisputesList');
  const badge = document.getElementById('adminDisputeBadge');
  if (!container) return;

  if (!Array.isArray(appData.disputes) || !appData.disputes.length) {
    container.innerHTML = '<p style="color:var(--text-muted); padding:10px 0; font-size:13px;">No customer order disputes reported. Fleet and restaurants running with 100% satisfaction! ✨ </p>';
    if (badge) badge.textContent = '0 Issues';
    return;
  }

  if (badge) badge.textContent = `${appData.disputes.length} Resolved / Active Issues`;

  container.innerHTML = appData.disputes.map(d => `
    <div class="food-row" style="margin-bottom: 10px; align-items: flex-start; padding: 12px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm);">
      <div style="flex: 1;">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <b style="color: var(--primary);">Case #${d.id}</b>
          <span style="font-size: 11px; background: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${d.reason}</span>
          <span style="font-size: 11px; color: var(--text-muted);">${new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div style="font-size: 13px; margin: 4px 0;">
          Order <b>#${d.orderId}</b> • <b>${d.restaurantName}</b> • Customer: <b>${d.customerName}</b>
        </div>
        ${d.details ? `<div style="font-size: 12px; color: var(--text-muted); font-style: italic;">"${d.details}"</div>` : ''}
      </div>
      <div style="text-align: right;">
        <div style="font-size: 15px; font-weight: 900; color: #15803d;">₹${d.amount}</div>
        <span style="font-size: 11px; font-weight: 700; color: #15803d; background: #dcfce7; padding: 2px 6px; border-radius: 4px;">${d.status}</span>
      </div>
    </div>
  `).join('');
}

// -------------------------------------------------------------
// PHASE 11: VENDOR KITCHEN RAW INVENTORY & DEPLETION ENGINE
// -------------------------------------------------------------
const DEFAULT_INVENTORY = [
  { id: 'inv_1', name: 'Fresh Burger Buns', unit: 'Pcs', stock: 45, max: 100, lowThreshold: 20, icon: '🍔', cost: 12 },
  { id: 'inv_2', name: 'Mozzarella & Cheddar Cheese', unit: 'Kg', stock: 8.5, max: 20, lowThreshold: 4, icon: '🧀', cost: 420 },
  { id: 'inv_3', name: 'Fresh Malai Paneer', unit: 'Kg', stock: 12, max: 25, lowThreshold: 5, icon: 'ðŸ§ˆ', cost: 360 },
  { id: 'inv_4', name: 'Royal Basmati Biryani Rice', unit: 'Kg', stock: 28, max: 50, lowThreshold: 10, icon: 'ðŸš', cost: 110 },
  { id: 'inv_5', name: 'Food Grade Eco Meal Boxes', unit: 'Units', stock: 85, max: 150, lowThreshold: 30, icon: '📦', cost: 8 },
  { id: 'inv_6', name: 'Refined Cooking Oil & Ghee', unit: 'Liters', stock: 14, max: 30, lowThreshold: 6, icon: 'ðŸ›¢ï¸', cost: 140 }
];

function renderVendorInventory() {
  const container = document.getElementById('vendorInventoryList');
  if (!container) return;

  if (!Array.isArray(appData.inventory) || !appData.inventory.length) {
    appData.inventory = JSON.parse(JSON.stringify(DEFAULT_INVENTORY));
    saveState();
  }

  container.innerHTML = appData.inventory.map(item => {
    const isLow = item.stock <= item.lowThreshold;
    const percentage = Math.min(100, Math.round((item.stock / item.max) * 100));
    const fillColor = isLow ? '#ef4444' : percentage < 45 ? '#f59e0b' : '#10b981';

    return `
      <div class="inventory-item-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 24px;">${item.icon}</span>
            <div>
              <div style="font-weight: 800; font-size: 13px; color: var(--text);">${item.name}</div>
              <div style="font-size: 11px; color: var(--text-muted);">Threshold: ${item.lowThreshold} ${item.unit}</div>
            </div>
          </div>
          ${isLow ? `<span class="badge" style="background:#fee2e2; color:#b91c1c; font-size:10px; padding:2px 6px;">Low Stock</span>` : ''}
        </div>

        <div style="margin-top: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
            <span style="font-weight: 800; color: ${isLow ? '#ef4444' : 'var(--text)'};">${item.stock} ${item.unit}</span>
            <span style="color: var(--text-muted);">${item.max} ${item.unit} max</span>
          </div>
          <div class="inventory-bar-track">
            <div class="inventory-bar-fill" style="width: ${percentage}%; background: ${fillColor};"></div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px solid var(--border); padding-top: 8px;">
          <span style="font-size: 11px; color: var(--text-muted);">₹${item.cost} / ${item.unit}</span>
          <button class="btn-secondary" onclick="restockIngredient('${item.id}', 10)" style="padding: 4px 8px; font-size: 11px;">+ Restock 10</button>
        </div>
      </div>
    `;
  }).join('');
}

function restockIngredient(invId, amount) {
  const item = (appData.inventory || []).find(i => i.id === invId);
  if (!item) return;

  item.stock = Math.min(item.max, Number((item.stock + amount).toFixed(1)));
  saveState();
  renderVendorInventory();
  showToast(`📦 Restocked ${item.name} (+${amount} ${item.unit})`, 'success');
}

function restockAllIngredients() {
  (appData.inventory || []).forEach(item => {
    item.stock = item.max;
  });
  saveState();
  renderVendorInventory();
  showToast('✨  All kitchen ingredients and meal boxes fully replenished!', 'success');
}

function depleteInventoryForOrder(order) {
  if (!order || !Array.isArray(order.items) || !Array.isArray(appData.inventory)) return;

  order.items.forEach(item => {
    const qty = Number(item.qty) || 1;
    const nameLower = (item.name || '').toLowerCase();

    // 1 box per food item
    const box = appData.inventory.find(i => i.id === 'inv_5');
    if (box) box.stock = Math.max(0, box.stock - qty);

    // Cooking oil / ghee per dish
    const oil = appData.inventory.find(i => i.id === 'inv_6');
    if (oil) oil.stock = Math.max(0, Number((oil.stock - (0.05 * qty)).toFixed(2)));

    // Buns
    if (nameLower.includes('burger') || nameLower.includes('sandwich')) {
      const buns = appData.inventory.find(i => i.id === 'inv_1');
      if (buns) buns.stock = Math.max(0, buns.stock - qty);
    }

    // Cheese
    if (nameLower.includes('pizza') || nameLower.includes('cheese') || nameLower.includes('pasta')) {
      const cheese = appData.inventory.find(i => i.id === 'inv_2');
      if (cheese) cheese.stock = Math.max(0, Number((cheese.stock - (0.15 * qty)).toFixed(2)));
    }

    // Paneer
    if (nameLower.includes('paneer') || nameLower.includes('thali')) {
      const paneer = appData.inventory.find(i => i.id === 'inv_3');
      if (paneer) paneer.stock = Math.max(0, Number((paneer.stock - (0.2 * qty)).toFixed(2)));
    }

    // Rice
    if (nameLower.includes('biryani') || nameLower.includes('rice') || nameLower.includes('thali') || nameLower.includes('pulao')) {
      const rice = appData.inventory.find(i => i.id === 'inv_4');
      if (rice) rice.stock = Math.max(0, Number((rice.stock - (0.25 * qty)).toFixed(2)));
    }
  });

  // Check for critical thresholds
  appData.inventory.forEach(inv => {
    if (inv.stock <= inv.lowThreshold) {
      pushNotification('âš ï¸', `Kitchen Inventory Alert: ${inv.name} is running low (${inv.stock} ${inv.unit} left)!`);
    }
  });

  saveState();
  renderVendorInventory();
}

function restoreInventoryForOrder(order) {
  if (!order || !Array.isArray(order.items) || !Array.isArray(appData.inventory)) return;

  order.items.forEach(item => {
    const qty = Number(item.qty) || 1;
    const nameLower = (item.name || '').toLowerCase();

    // 1 box per food item
    const box = appData.inventory.find(i => i.id === 'inv_5');
    if (box) box.stock = Math.min(box.max, box.stock + qty);

    // Cooking oil / ghee per dish
    const oil = appData.inventory.find(i => i.id === 'inv_6');
    if (oil) oil.stock = Math.min(oil.max, Number((oil.stock + (0.05 * qty)).toFixed(2)));

    // Buns
    if (nameLower.includes('burger') || nameLower.includes('sandwich')) {
      const buns = appData.inventory.find(i => i.id === 'inv_1');
      if (buns) buns.stock = Math.min(buns.max, buns.stock + qty);
    }

    // Cheese
    if (nameLower.includes('pizza') || nameLower.includes('cheese') || nameLower.includes('pasta')) {
      const cheese = appData.inventory.find(i => i.id === 'inv_2');
      if (cheese) cheese.stock = Math.min(cheese.max, Number((cheese.stock + (0.15 * qty)).toFixed(2)));
    }

    // Paneer
    if (nameLower.includes('paneer') || nameLower.includes('thali')) {
      const paneer = appData.inventory.find(i => i.id === 'inv_3');
      if (paneer) paneer.stock = Math.min(paneer.max, Number((paneer.stock + (0.2 * qty)).toFixed(2)));
    }

    // Rice
    if (nameLower.includes('biryani') || nameLower.includes('rice') || nameLower.includes('thali') || nameLower.includes('pulao')) {
      const rice = appData.inventory.find(i => i.id === 'inv_4');
      if (rice) rice.stock = Math.min(rice.max, Number((rice.stock + (0.25 * qty)).toFixed(2)));
    }
  });

  saveState();
  renderVendorInventory();
}

// -------------------------------------------------------------
// PHASE 12: DYNAMIC SURGE & WEATHER DISPATCH ENGINE
// -------------------------------------------------------------
function updateWeatherPillUI() {
  const pill = document.getElementById('weatherSurgePill');
  const icon = document.getElementById('weatherSurgeIcon');
  const label = document.getElementById('weatherSurgeLabel');
  if (!pill || !appData.surgeSettings) return;

  const isRain = appData.surgeSettings.rainSurge;
  const isPeak = appData.surgeSettings.peakSurge;
  const isNight = appData.surgeSettings.lateNightSurge;

  if (isRain) {
    pill.classList.add('rain-mode');
    if (icon) icon.textContent = 'ðŸŒ§ï¸';
    if (label) label.textContent = 'Heavy Rain (+₹25 Surge)';
  } else if (isPeak) {
    pill.classList.remove('rain-mode');
    if (icon) icon.textContent = '⚡';
    if (label) label.textContent = 'Peak Rush (1.25x)';
  } else if (isNight) {
    pill.classList.remove('rain-mode');
    if (icon) icon.textContent = '🌙';
    if (label) label.textContent = 'Night Shift (+₹20)';
  } else {
    pill.classList.remove('rain-mode');
    if (icon) icon.textContent = 'â˜€ï¸';
    if (label) label.textContent = 'Weather: Clear (₹0 Surge)';
  }
}

function toggleSimulatedWeather() {
  if (!appData.surgeSettings) {
    appData.surgeSettings = { rainSurge: false, rainFee: 25, peakSurge: false, peakMultiplier: 1.25, lateNightSurge: false, lateNightFee: 20 };
  }
  appData.surgeSettings.rainSurge = !appData.surgeSettings.rainSurge;
  saveState();
  updateWeatherPillUI();
  updateBillTotals();
  renderAdminSurgeSwitchboard();

  if (appData.surgeSettings.rainSurge) {
    playSound('chime');
    showToast('ðŸŒ§ï¸ Monsoon Rain simulation active! ₹25 driver incentive surge added.', 'warning');
  } else {
    playSound('chime');
    showToast('â˜€ï¸ Clear weather restored. Normal delivery pricing active.', 'success');
  }
}

function toggleSurgeSetting(key, isChecked) {
  if (!appData.surgeSettings) {
    appData.surgeSettings = { rainSurge: false, rainFee: 25, peakSurge: false, peakMultiplier: 1.25, lateNightSurge: false, lateNightFee: 20 };
  }
  appData.surgeSettings[key] = isChecked;
  saveState();
  updateWeatherPillUI();
  updateBillTotals();
  renderAdminSurgeSwitchboard();

  const names = {
    rainSurge: 'ðŸŒ§ï¸ Heavy Rain Surge (+₹25)',
    peakSurge: '⚡ Dinner Peak Rush (1.25x)',
    lateNightSurge: '🌙 Late Night Delivery (+₹20)'
  };
  showToast(`${names[key] || key} marked ${isChecked ? 'ENABLED' : 'DISABLED'}`, isChecked ? 'warning' : 'info');
}

function renderAdminSurgeSwitchboard() {
  const rainToggle = document.getElementById('toggleRainSurge');
  const peakToggle = document.getElementById('togglePeakSurge');
  const nightToggle = document.getElementById('toggleLateNightSurge');
  const badge = document.getElementById('adminSurgeStatusBadge');

  const surge = appData.surgeSettings || { rainSurge: false, peakSurge: false, lateNightSurge: false };
  if (rainToggle) rainToggle.checked = !!surge.rainSurge;
  if (peakToggle) peakToggle.checked = !!surge.peakSurge;
  if (nightToggle) nightToggle.checked = !!surge.lateNightSurge;

  if (badge) {
    if (surge.rainSurge && surge.peakSurge) {
      badge.textContent = 'High Surge: Rain + Peak Rush (₹25 + 1.25x)';
      badge.style.background = '#fee2e2';
      badge.style.color = '#b91c1c';
    } else if (surge.rainSurge) {
      badge.textContent = 'Rain Surge Active (+₹25 Driver Fee)';
      badge.style.background = '#e0f2fe';
      badge.style.color = '#0369a1';
    } else if (surge.peakSurge) {
      badge.textContent = 'Peak Rush Active (1.25x Multiplier)';
      badge.style.background = '#fef3c7';
      badge.style.color = '#b45309';
    } else if (surge.lateNightSurge) {
      badge.textContent = 'Late Night Surcharge (+₹20 Fee)';
      badge.style.background = '#f3e8ff';
      badge.style.color = '#7e22ce';
    } else {
      badge.textContent = 'Normal Pricing (1.0x)';
      badge.style.background = '#ffedd5';
      badge.style.color = '#c2410c';
    }
  }
}

// -------------------------------------------------------------
// PHASE 12: AI MULTI-STOP BATCH ROUTE DISPATCH ENGINE
// -------------------------------------------------------------
function renderRiderBatchMode() {
  const container = document.getElementById('riderBatchDeliveryContainer');
  if (!container) return;

  const batch = appData.batchRoute;
  if (!batch) return;

  const currentStep = batch.currentStep || 0;
  const isFinished = currentStep >= batch.waypoints.length;

  container.innerHTML = `
    <div class="batch-route-card">
      <div class="batch-route-summary">
        <div>
          <div style="font-weight: 800; font-size: 14px; color: var(--text-main);">
            Route ID: <span style="color: #2563eb;">${batch.id}</span>
          </div>
          <div style="font-size: 12px; color: var(--text-muted);">${batch.corridor}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 900; font-size: 16px; color: #16a34a;">₹${batch.payout} Guaranteed Payout</div>
          <div style="font-size: 11px; color: #15803d;">Includes ₹15 Multi-Stop Batch Bonus</div>
        </div>
      </div>

      <div class="batch-timeline">
        ${batch.waypoints.map((wp, idx) => {
          let stateClass = '';
          let badgeText = '';
          if (idx < currentStep) {
            stateClass = 'completed';
            badgeText = '✓ Completed';
          } else if (idx === currentStep) {
            stateClass = 'active';
            badgeText = '⚡ Current Action';
          } else {
            badgeText = 'Upcoming';
          }

          const icon = wp.type === 'pickup' ? 'ðŸª' : '📍';
          return `
            <div class="batch-waypoint ${stateClass}">
              <div class="batch-waypoint-dot">${idx < currentStep ? '✓' : idx + 1}</div>
              <div class="batch-waypoint-content">
                <div>
                  <div style="font-weight: 800; font-size: 13px; color: var(--text-main);">
                    ${icon} ${wp.title}
                  </div>
                  <div style="font-size: 11px; color: var(--text-muted); margin: 2px 0;">
                    ${wp.address}
                  </div>
                  ${wp.items ? `<div style="font-size: 11px; color: #64748b;">Dishes: ${wp.items}</div>` : ''}
                  ${wp.otp ? `<div style="font-size: 11px; font-weight: 700; color: #b45309;">Customer OTP: <span style="background:#fef3c7; padding:1px 4px; border-radius:3px;">${wp.otp}</span></div>` : ''}
                </div>
                <div>
                  <span class="badge" style="${idx === currentStep ? 'background:#2563eb; color:#fff;' : idx < currentStep ? 'background:#dcfce7; color:#15803d;' : 'background:#e2e8f0; color:#64748b;'} font-size: 10px;">
                    ${badgeText}
                  </span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="margin-top: 14px; border-top: 1px solid var(--border); padding-top: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <span style="font-size: 12px; color: var(--text-muted);">
          ${isFinished ? '🎉 All multi-stop deliveries completed!' : `Next: Stop ${currentStep + 1} of ${batch.waypoints.length}`}
        </span>
        <div>
          ${!isFinished ? `
            <button class="btn-accent" onclick="advanceBatchWaypoint(${currentStep})" style="padding: 8px 16px; font-weight: 800;">
              ${batch.waypoints[currentStep].type === 'pickup' ? 'Confirm Food Picked Up ➔' : 'Verify OTP & Deliver 📦'}
            </button>
          ` : `
            <button class="btn-secondary" onclick="resetBatchRoute()" style="padding: 6px 12px; font-size: 12px;">
              🔄 Load Next Corridor Batch
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

function advanceBatchWaypoint(stepIdx) {
  const batch = appData.batchRoute;
  if (!batch || stepIdx !== batch.currentStep) return;

  const wp = batch.waypoints[stepIdx];
  if (!wp) return;

  wp.done = true;
  batch.currentStep++;

  if (wp.type === 'pickup') {
    playSound('chime');
    speakVoiceAlert(`Picked up items from ${wp.title}`);
    showToast(`✓ Picked up items for Order #${wp.orderId}!`, 'success');
  } else {
    playSound('delivered');
    speakVoiceAlert(`Successfully delivered Order #${wp.orderId} to customer!`);
    showToast(`🎉 Delivered to ${wp.title}! OTP ${wp.otp} verified.`, 'success');

    // Credit rider payout
    const rider = appData.riders[0];
    if (rider) {
      rider.earnings += 40;
      rider.totalTrips += 1;
      const earningsEl = document.getElementById('riderEarnings');
      const tripsEl = document.getElementById('riderTotalTrips');
      if (earningsEl) earningsEl.textContent = `₹${rider.earnings}`;
      if (tripsEl) tripsEl.textContent = rider.totalTrips;
    }
  }

  saveState();
  renderRiderBatchMode();
}

function resetBatchRoute() {
  if (!appData.batchRoute) return;
  appData.batchRoute.currentStep = 0;
  appData.batchRoute.waypoints.forEach(w => w.done = false);
  saveState();
  renderRiderBatchMode();
  showToast('🔄 New corridor batch route loaded for Sakoli sector!', 'info');
}

// -------------------------------------------------------------
// PHASE 12: SAKOLI GEO-DEMAND HEATMAP & FLEET TELEMETRY
// -------------------------------------------------------------
function renderAdminHeatmap() {
  const container = document.getElementById('sakoliHeatmapSvgContainer');
  if (!container) return;

  container.innerHTML = `
    <svg viewBox="0 0 340 220" style="width:100%; height:100%; display:block;">
      <defs>
        <radialGradient id="heatRed" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="0.85"/>
          <stop offset="70%" stop-color="#ef4444" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="heatAmber" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.8"/>
          <stop offset="70%" stop-color="#f59e0b" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="heatGreen" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.8"/>
          <stop offset="70%" stop-color="#10b981" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Road Grid Overlay -->
      <line x1="30" y1="65" x2="310" y2="65" stroke="#334155" stroke-width="3" stroke-dasharray="4,4" opacity="0.6"/>
      <line x1="30" y1="155" x2="310" y2="155" stroke="#334155" stroke-width="3" stroke-dasharray="4,4" opacity="0.6"/>
      <line x1="120" y1="20" x2="120" y2="200" stroke="#334155" stroke-width="3" stroke-dasharray="4,4" opacity="0.6"/>
      <line x1="220" y1="20" x2="220" y2="200" stroke="#334155" stroke-width="3" stroke-dasharray="4,4" opacity="0.6"/>

      <!-- Heat Zones -->
      <circle cx="75" cy="65" r="46" fill="url(#heatRed)" class="heatmap-zone" onclick="showToast('Market Yard: High Order Surge (18 orders)', 'warning')">
        <animate attributeName="r" values="42;48;42" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="215" cy="75" r="38" fill="url(#heatAmber)" class="heatmap-zone" onclick="showToast('Station Road: 11 active orders', 'info')"/>
      <circle cx="120" cy="155" r="34" fill="url(#heatGreen)" class="heatmap-zone" onclick="showToast('Green Avenue: 6 active orders', 'info')"/>
      <circle cx="260" cy="160" r="42" fill="url(#heatRed)" class="heatmap-zone" onclick="showToast('College Square: Peak Demand Zone (14 orders)', 'warning')">
        <animate attributeName="r" values="38;44;38" dur="2.5s" repeatCount="indefinite"/>
      </circle>

      <!-- Zone Center Markers & Text -->
      <circle cx="75" cy="65" r="5" fill="#ffffff" stroke="#ef4444" stroke-width="2"/>
      <text x="75" y="48" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">Market Yard (18)</text>

      <circle cx="215" cy="75" r="5" fill="#ffffff" stroke="#f59e0b" stroke-width="2"/>
      <text x="215" y="58" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">Station Rd (11)</text>

      <circle cx="120" cy="155" r="5" fill="#ffffff" stroke="#10b981" stroke-width="2"/>
      <text x="120" y="140" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">Green Ave (6)</text>

      <circle cx="260" cy="160" r="5" fill="#ffffff" stroke="#ef4444" stroke-width="2"/>
      <text x="260" y="144" fill="#f8fafc" font-size="10" font-weight="bold" text-anchor="middle">College Sq (14)</text>

      <!-- Live GPS Fleet Markers on Map -->
      <circle cx="95" cy="80" r="4" fill="#38bdf8"/>
      <text x="95" y="94" fill="#38bdf8" font-size="9" text-anchor="middle">🛵 Vikram</text>

      <circle cx="205" cy="120" r="4" fill="#38bdf8"/>
      <text x="205" y="134" fill="#38bdf8" font-size="9" text-anchor="middle">🛵 Rahul</text>
    </svg>
  `;
}

function renderAdminFleetTelemetry() {
  const container = document.getElementById('adminFleetTelemetryList');
  if (!container) return;

  const fleet = [
    { name: 'Vikram (Rider #1)', status: 'In Transit', speed: '24 km/h', battery: 88, zone: 'Market Yard', order: 'FB-98210' },
    { name: 'Amit Patil (Rider #2)', status: 'Idle (Available)', speed: '0 km/h', battery: 62, zone: 'Station Road', order: 'None' },
    { name: 'Rahul Shinde (Rider #3)', status: 'Delivering', speed: '31 km/h', battery: 94, zone: 'College Sq', order: 'FB-98214' }
  ];

  container.innerHTML = fleet.map(f => `
    <div class="telemetry-rider-row">
      <div>
        <div style="font-weight: 800; color: var(--text-main); font-size: 12px;">${f.name}</div>
        <div style="font-size: 11px; color: var(--text-muted);">${f.zone} • ${f.order !== 'None' ? `Order #${f.order}` : 'Awaiting dispatch'}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="speed-badge">${f.speed}</span>
        <span class="battery-pill">🔋 ${f.battery}%</span>
      </div>
    </div>
  `).join('');
}

function refreshDemandHeatmap() {
  renderAdminHeatmap();
  renderAdminFleetTelemetry();
  playSound('chime');
  showToast('🔄 Sakoli sector demand heatmap & GPS telemetry refreshed!', 'info');
}

// -------------------------------------------------------------
// PHASE 12: WHATSAPP BOT & NOTIFICATION WEB SIMULATOR
// -------------------------------------------------------------
let currentWhatsAppOrderId = null;

function openWhatsAppBotModal(orderId) {
  const order = appData.orders.find(o => o.id === orderId) || appData.orders[0];
  if (!order) return;

  currentWhatsAppOrderId = order.id;

  const msgList = document.getElementById('waMessagesList');
  const quickReplies = document.getElementById('waQuickRepliesContainer');
  const chatBody = document.getElementById('whatsAppChatBody');

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const itemList = order.items.map(i => `• ${i.qty}x *${i.name}* (₹${i.price * i.qty})`).join('<br>');
  const riderName = order.deliveryBoy || 'Vikram (Delivery Courier)';

  if (msgList) {
    msgList.innerHTML = `
      <div class="wa-bubble-incoming">
        Hello <b>${order.customer.name}</b>! 👋<br>
        Thank you for choosing <b>BhookIt</b>. Your order from <b>${order.restaurantName}</b> has been received!
        <div class="wa-time">${timeStr} ✓✓</div>
      </div>

      <div class="wa-bubble-incoming" style="border-left: 3px solid #25d366;">
        📦 <b>ORDER RECEIPT #${order.id}</b><br><br>
        ${itemList}<br><br>
        💵 <b>Total Paid:</b> ₹${order.total} (${order.payment})<br>
        📍 <b>Delivery To:</b> ${order.customer.address}<br>
        🛵 <b>Assigned Courier:</b> ${riderName}<br>
        ðŸ” <b>Delivery PIN / OTP:</b> <span style="background:#dcfce7; color:#166534; font-weight:800; padding:1px 6px; border-radius:4px;">${order.deliveryOtp || '5821'}</span>
        <div class="wa-time">${timeStr} ✓✓</div>
      </div>

      <div class="wa-bubble-incoming">
        How can our automated concierge assist you right now? Choose an action below: 👇
        <div class="wa-time">${timeStr} ✓✓</div>
      </div>
    `;
  }

  if (quickReplies) {
    quickReplies.innerHTML = `
      <button class="wa-reply-btn" onclick="sendWhatsAppQuickReply('track', '${order.id}')">📍 Track Courier Live</button>
      <button class="wa-reply-btn" onclick="sendWhatsAppQuickReply('invoice', '${order.id}')">🧾 View GST Invoice</button>
      <button class="wa-reply-btn" onclick="sendWhatsAppQuickReply('call', '${order.id}')">📞 Call ${riderName.split(' ')[0]}</button>
      <button class="wa-reply-btn" onclick="sendWhatsAppQuickReply('dispute', '${order.id}')">âš ï¸ Report Issue / Refund</button>
      <button class="wa-reply-btn" onclick="sendWhatsAppQuickReply('external', '${order.id}')">â†—ï¸ Open Web WhatsApp</button>
    `;
  }

  openModal('whatsAppBotModal');

  setTimeout(() => {
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
  }, 100);
}

function sendWhatsAppQuickReply(action, orderId) {
  const msgList = document.getElementById('waMessagesList');
  const chatBody = document.getElementById('whatsAppChatBody');
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let userText = '';
  if (action === 'track') userText = 'Where is my delivery right now? 📍';
  else if (action === 'invoice') userText = 'Please send my official GST tax invoice 🧾';
  else if (action === 'call') userText = 'Can I call my delivery courier? 📞';
  else if (action === 'dispute') userText = 'I need to report an issue with my food order âš ï¸';
  else if (action === 'external') userText = 'Share this receipt to my personal WhatsApp 📲';

  // Append User message bubble
  if (msgList) {
    const userBubble = document.createElement('div');
    userBubble.className = 'wa-bubble-outgoing';
    userBubble.innerHTML = `${userText}<div class="wa-time">${timeStr} ✓✓</div>`;
    msgList.appendChild(userBubble);
  }

  if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
  playSound('click');

  setTimeout(() => {
    if (action === 'track') {
      closeModal('whatsAppBotModal');
      viewTrackingFor(orderId);
      showToast('📍 Opened Live Delivery GPS Tracker!', 'info');
    } else if (action === 'invoice') {
      closeModal('whatsAppBotModal');
      showGSTInvoice(orderId);
    } else if (action === 'call') {
      showToast('📞 Simulating phone connection to Delivery Partner Vikram (+91 9822001122)...', 'success');
      if (msgList) {
        const botReply = document.createElement('div');
        botReply.className = 'wa-bubble-incoming';
        botReply.innerHTML = `Connecting you to Vikram Rider at <b>+91 9822001122</b>. Your number is masked for safety. 🔒<div class="wa-time">${timeStr} ✓✓</div>`;
        msgList.appendChild(botReply);
        if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
      }
    } else if (action === 'dispute') {
      closeModal('whatsAppBotModal');
      openDisputeModal(orderId);
    } else if (action === 'external') {
      const order = appData.orders.find(o => o.id === orderId);
      if (order) {
        const text = encodeURIComponent(`BhookIt Order #${order.id} for ${order.restaurantName} (₹${order.total}). Track live: ${window.location.origin}/?track=${order.id}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      }
    }
  }, 600);
}

// -------------------------------------------------------------
// PHASE 13: PLATFORM ACCOUNTING & LEDGER CSV EXPORTERS
// -------------------------------------------------------------
function downloadCSV(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportOrdersCSV(vendorId = null) {
  let orders = appData.orders || [];
  if (vendorId) {
    orders = orders.filter(o => o.restaurantId === Number(vendorId));
  }

  if (!orders.length) {
    showToast('No orders available to export', 'warning');
    return;
  }

  const headers = [
    'Order ID', 'Invoice No', 'Date Time', 'Restaurant ID', 'Restaurant Name',
    'Customer Name', 'Customer Phone', 'Delivery Address', 'Items Summary',
    'Subtotal (INR)', 'Delivery Fee (INR)', 'Surge Fee (INR)', 'Rider Tip (INR)',
    'Taxes (INR)', 'Coupon Discount (INR)', 'Wallet Redeemed (INR)', 'Grand Total (INR)',
    'Payment Method', 'Payment Status', 'Order Status', 'Rider'
  ];

  const rows = orders.map(o => {
    const itemsSummary = (o.items || []).map(i => `${i.qty}x ${i.name}`).join('; ');
    return [
      `"${o.id}"`,
      `"${o.invoiceNo || ''}"`,
      `"${new Date(o.createdAt).toLocaleString()}"`,
      `"${o.restaurantId}"`,
      `"${(o.restaurantName || '').replace(/"/g, '""')}"`,
      `"${(o.customer?.name || '').replace(/"/g, '""')}"`,
      `"${(o.customer?.phone || '').replace(/"/g, '""')}"`,
      `"${(o.customer?.address || '').replace(/"/g, '""')}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      o.subtotal || 0,
      o.deliveryFee || 0,
      o.surgeFee || 0,
      o.riderTip || 0,
      o.taxes || 0,
      o.discount || 0,
      o.walletRedeemed || 0,
      o.total || 0,
      `"${o.payment || ''}"`,
      `"${o.paymentStatus || ''}"`,
      `"${o.status || ''}"`,
      `"${(o.deliveryBoy || 'Unassigned').replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = vendorId ? `BhookIt_Vendor_${vendorId}_Orders_${dateStr}.csv` : `BhookIt_All_Orders_${dateStr}.csv`;
  downloadCSV(filename, csvContent);
  playSound('delivered');
  showToast(`📥 Exported ${orders.length} orders to CSV successfully!`, 'success');
}

function exportSettlementsCSV() {
  const restaurants = appData.restaurants || [];
  if (!restaurants.length) {
    showToast('No restaurants found for settlement export', 'warning');
    return;
  }

  const headers = [
    'Restaurant ID', 'Restaurant Name', 'Category', 'Phone', 'Rating',
    'Total Completed Orders', 'Gross Sales (INR)', 'Commission Rate (%)',
    'Platform Revenue (INR)', 'Net Payout Due (INR)', 'Status'
  ];

  const rows = restaurants.map(r => {
    const rOrders = (appData.orders || []).filter(o => o.restaurantId === r.id && o.status !== 'Cancelled');
    const gross = rOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
    const commRate = r.commissionRate || 10;
    const platformRev = Math.round(gross * (commRate / 100));
    const netPayout = gross - platformRev;

    return [
      `"${r.id}"`,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.category || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      r.rating || 4.5,
      rOrders.length,
      gross,
      commRate,
      platformRev,
      netPayout,
      `"${r.approved ? 'Active / Approved' : 'Pending Review'}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadCSV(`BhookIt_Vendor_Settlements_${dateStr}.csv`, csvContent);
  playSound('delivered');
  showToast(`📥 Exported financial settlements for ${restaurants.length} restaurants!`, 'success');
}

function exportFleetCSV() {
  const orders = appData.orders || [];
  const riders = [
    { id: 'RD-01', name: 'Vikram Shinde', phone: '+91 9822001122', vehicle: 'Honda Activa 6G (MH36-AQ-4491)', rating: 4.9, active: true },
    { id: 'RD-02', name: 'Amol Deshmukh', phone: '+91 9822003344', vehicle: 'Hero Splendor Plus (MH36-BE-1209)', rating: 4.8, active: true },
    { id: 'RD-03', name: 'Pooja Raut', phone: '+91 9822005566', vehicle: 'TVS Jupiter 125 (MH36-CK-8832)', rating: 5.0, active: true },
    { id: 'RD-04', name: 'Nikhil Meshram', phone: '+91 9822007788', vehicle: 'Bajaj Pulsar 150 (MH36-DL-6610)', rating: 4.7, active: false }
  ];

  const headers = [
    'Rider ID', 'Rider Name', 'Phone', 'Vehicle', 'Status', 'Rating',
    'Total Completed Trips', 'Base Delivery Earnings (INR)', 'Weather Surge Bonus (INR)',
    'Tips Earned (INR)', 'Total Courier Earnings (INR)'
  ];

  const rows = riders.map(r => {
    const riderOrders = orders.filter(o => (o.deliveryBoy || '').toLowerCase().includes(r.name.toLowerCase().split(' ')[0]) || o.status === 'Delivered');
    const trips = riderOrders.length;
    const baseEarnings = trips * 30;
    const surgeEarnings = riderOrders.reduce((sum, o) => sum + (o.surgeFee || 0), 0);
    const tips = riderOrders.reduce((sum, o) => sum + (o.riderTip || 0), 0);
    const totalPayout = baseEarnings + surgeEarnings + tips;

    return [
      `"${r.id}"`,
      `"${r.name}"`,
      `"${r.phone}"`,
      `"${r.vehicle.replace(/"/g, '""')}"`,
      `"${r.active ? 'On Duty (Active)' : 'Off Duty'}"`,
      r.rating,
      trips,
      baseEarnings,
      surgeEarnings,
      tips,
      totalPayout
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadCSV(`BhookIt_Fleet_Telemetry_${dateStr}.csv`, csvContent);
  playSound('delivered');
  showToast(`📥 Exported fleet telemetry for ${riders.length} courier partners!`, 'success');
}

// -------------------------------------------------------------
// PHASE 14: RIDER SOS DISTRESS & AUTO-REASSIGNMENT DESK
// -------------------------------------------------------------
function openRiderSosModal() {
  openModal('riderSosModal');
}

function confirmRiderSosBroadcast() {
  const reasonEl = document.querySelector('input[name="sosReason"]:checked');
  const reason = reasonEl ? reasonEl.value : 'Vehicle Breakdown';
  const notes = document.getElementById('sosAdditionalNotes')?.value.trim() || '';

  // Find active delivery for rider
  const activeOrder = (appData.orders || []).find(o => o.status === 'Accepted' || o.status === 'Preparing' || o.status === 'Ready');

  const banner = document.getElementById('riderSosActiveBanner');
  if (banner) {
    banner.classList.remove('hidden');
    banner.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
        <div>
          <div style="font-weight: 800; font-size: 13px; color: #991b1b;">🚨 ACTIVE SOS DISTRESS BEACON BROADCASTED</div>
          <div style="font-size: 12px; color: #b91c1c; margin-top: 2px;">Reason: <b>${reason}</b> ${notes ? `("${notes}")` : ''}</div>
          <div style="font-size: 11px; color: #7f1d1d; margin-top: 4px;">
            ⚡ Auto-transfer initiated: Backup courier <b>Amol Deshmukh (+91 9822003344)</b> has been dispatched to take over delivery.
          </div>
        </div>
        <button class="btn-secondary" onclick="dismissRiderSos()" style="padding: 2px 8px; font-size: 11px; color: #991b1b; border-color: #fca5a5;">Clear SOS</button>
      </div>
    `;
  }

  // Play urgent rush siren audio
  playSound('rush_siren');

  // Push notification to Admin and Customer
  pushNotification('🚨', `RIDER SOS: Vikram Shinde reported "${reason}". Auto-transferring task to Amol Deshmukh.`);
  if (activeOrder) {
    activeOrder.deliveryBoy = 'Amol Deshmukh (Backup Courier MH36-BE-1209)';
    activeOrder.riderPhone = '+91 9822003344';
    activeOrder.sosIncident = {
      reportedAt: new Date().toISOString(),
      reason,
      notes,
      originalCourier: 'Vikram Shinde'
    };
    saveState();
  }

  showToast(`🚨 SOS Broadcasted! Backup courier Amol (+91 9822003344) assigned.`, 'danger');
  closeModal('riderSosModal');
  renderDeliveryView();
}

function dismissRiderSos() {
  const banner = document.getElementById('riderSosActiveBanner');
  if (banner) banner.classList.add('hidden');
  showToast('Distress beacon marked as resolved', 'info');
  playSound('chime');
}

// -------------------------------------------------------------
// PHASE 14: END-OF-DAY (EOD) Z-REPORT & AUDIT SETTLEMENT ENGINE
// -------------------------------------------------------------
function openZReportModal(vendorId = currentActiveVendorId) {
  const rest = appData.restaurants.find(r => r.id === Number(vendorId)) || appData.restaurants[0];
  if (!rest) return;

  const todayStr = new Date().toISOString().slice(0, 10);
  const rOrders = (appData.orders || []).filter(o => o.restaurantId === rest.id && o.status !== 'Cancelled');
  
  const walkinOrders = rOrders.filter(o => o.orderSource === 'POS Terminal');
  const deliveryOrders = rOrders.filter(o => o.orderSource !== 'POS Terminal');

  const grossSales = rOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
  const totalTax = rOrders.reduce((sum, o) => sum + (o.taxes || 0), 0);
  const commRate = rest.commissionRate || 10;
  const platformCut = Math.round(grossSales * (commRate / 100));
  const netDue = grossSales - platformCut;

  const cashOrders = rOrders.filter(o => o.payment === 'CASH' || o.payment === 'COD');
  const upiOrders = rOrders.filter(o => o.payment === 'UPI');
  const cardOrders = rOrders.filter(o => o.payment === 'CARD');
  const walletOrders = rOrders.filter(o => o.payment === 'WALLET');

  const cashTotal = cashOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const upiTotal = upiOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const cardTotal = cardOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const walletTotal = walletOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const container = document.getElementById('zReportSlipContent');
  if (container) {
    container.innerHTML = `
      <div class="z-report-header">
        <div style="font-size: 16px; font-weight: 900; letter-spacing: 0.5px;">${rest.name.toUpperCase()}</div>
        <div style="font-size: 11px;">FSSAI Lic: ${rest.fssai || '11524012000341'} • GSTIN: 27AAACF1001F1Z1</div>
        <div style="font-size: 11px;">Municipal Ward 3, Main Market Road, Sakoli - 441802</div>
        <div style="margin-top: 6px; font-weight: 800;">*** END OF DAY (EOD) Z-REPORT ***</div>
        <div style="font-size: 11px;">Business Date: ${new Date().toLocaleDateString('en-IN')} | Shift #1</div>
        <div style="font-size: 11px;">Printed: ${new Date().toLocaleTimeString()} | Register: REG-SAKOLI-01</div>
      </div>

      <div style="margin-bottom: 10px;">
        <div class="z-line"><span>OPENING CASH FLOAT:</span><span>₹2,000.00</span></div>
        <div class="z-line"><span>TOTAL ORDERS SETTLED:</span><span>${rOrders.length}</span></div>
        <div class="z-line" style="padding-left: 12px; color: var(--text-muted);"><span>• POS Walk-In Orders:</span><span>${walkinOrders.length}</span></div>
        <div class="z-line" style="padding-left: 12px; color: var(--text-muted);"><span>• Online Delivery Orders:</span><span>${deliveryOrders.length}</span></div>
      </div>

      <div style="border-top: 1px dashed #64748b; padding-top: 8px; margin-bottom: 10px;">
        <div style="font-weight: 800; font-size: 12px; margin-bottom: 4px;">PAYMENT TENDERS BREAKDOWN:</div>
        <div class="z-line"><span>💵 Cash Collections:</span><span>₹${cashTotal.toFixed(2)}</span></div>
        <div class="z-line"><span>⚡ UPI & Dynamic QR:</span><span>₹${upiTotal.toFixed(2)}</span></div>
        <div class="z-line"><span>💳 POS Card Swipes:</span><span>₹${cardTotal.toFixed(2)}</span></div>
        <div class="z-line"><span>ðŸ›ï¸ BhookIt Wallet:</span><span>₹${walletTotal.toFixed(2)}</span></div>
      </div>

      <div style="border-top: 1px dashed #64748b; padding-top: 8px; margin-bottom: 10px;">
        <div style="font-weight: 800; font-size: 12px; margin-bottom: 4px;">TAX & PLATFORM AUDIT:</div>
        <div class="z-line"><span>CGST Collected (2.5%):</span><span>₹${(totalTax / 2).toFixed(2)}</span></div>
        <div class="z-line"><span>SGST Collected (2.5%):</span><span>₹${(totalTax / 2).toFixed(2)}</span></div>
        <div class="z-line"><span>Gross Food Sales:</span><span>₹${grossSales.toFixed(2)}</span></div>
        <div class="z-line" style="color: #ef4444;"><span>Platform Commission (${commRate}%):</span><span>-₹${platformCut.toFixed(2)}</span></div>
      </div>

      <div class="z-line total">
        <span>NET PAYOUT DUE:</span>
        <span style="color: #10b981;">₹${netDue.toFixed(2)}</span>
      </div>

      <div class="z-line" style="font-weight: 700; margin-top: 4px;">
        <span>NET CASH IN DRAWER TO DEPOSIT:</span>
        <span>₹${(2000 + cashTotal).toFixed(2)}</span>
      </div>

      <div style="text-align: center; border-top: 1px dashed #64748b; margin-top: 14px; padding-top: 8px; font-size: 11px;">
        REGISTER STATUS: BALANCED & CLOSED ✓<br>
        Shift Manager: Rakesh S. | Cashier ID: CSH-04<br>
        *** AUDIT COPY RETAINED ON DEVICE ***
      </div>
    `;
  }

  playSound('chime');
  openModal('zReportModal');
}

function printZReport() {
  window.print();
}

// -------------------------------------------------------------
// PHASE 15: VOICE SEARCH & SPEECH RECOGNITION ENGINE
// -------------------------------------------------------------
let isVoiceRecording = false;
let speechRecognitionInstance = null;

function toggleVoiceSearch() {
  const btn = document.getElementById('btnVoiceSearch');
  const icon = document.getElementById('voiceSearchIcon');
  const searchInput = document.getElementById('foodSearchInput');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    showVoiceFallbackModal();
    return;
  }

  if (isVoiceRecording) {
    if (speechRecognitionInstance) speechRecognitionInstance.stop();
    isVoiceRecording = false;
    if (btn) btn.classList.remove('recording');
    if (icon) icon.textContent = 'ðŸŽ™ï¸';
    showToast('Voice search ended', 'info');
    return;
  }

  try {
    speechRecognitionInstance = new SpeechRecognition();
    speechRecognitionInstance.lang = currentLanguage === 'mr' ? 'mr-IN' : currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    speechRecognitionInstance.interimResults = false;
    speechRecognitionInstance.maxAlternatives = 1;

    speechRecognitionInstance.onstart = () => {
      isVoiceRecording = true;
      if (btn) btn.classList.add('recording');
      if (icon) icon.textContent = '🔴';
      playSound('chime');
      showToast('ðŸŽ™ï¸ Listening... Speak dish craving in Marathi or English!', 'info');
    };

    speechRecognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (searchInput) {
        searchInput.value = transcript;
        renderCustomerView();
      }
      playSound('delivered');
      showToast(`🗑£ï¸ Heard: "${transcript}"`, 'success');
      speakVoiceAlert(`Searching for ${transcript}`);
    };

    speechRecognitionInstance.onerror = (err) => {
      console.warn('Speech recognition error/fallback:', err);
      isVoiceRecording = false;
      if (btn) btn.classList.remove('recording');
      if (icon) icon.textContent = 'ðŸŽ™ï¸';
      showVoiceFallbackModal();
    };

    speechRecognitionInstance.onend = () => {
      isVoiceRecording = false;
      if (btn) btn.classList.remove('recording');
      if (icon) icon.textContent = 'ðŸŽ™ï¸';
    };

    speechRecognitionInstance.start();
  } catch (err) {
    console.error('Speech recognition failed to start:', err);
    showVoiceFallbackModal();
  }
}

function showVoiceFallbackModal() {
  const samples = [
    'à¤®à¤¿à¤¸à¤³ à¤ªà¤¾à¤µ (Misal Pav)',
    'à¤µà¥à¤¹à¥‡à¤œ à¤¸à¥à¤ªà¥‡à¤¶à¤² à¤¥à¤¾à¤³à¥€ (Special Veg Thali)',
    'à¤ªà¤¨à¥€à¤° à¤¬à¤Ÿà¤° à¤®à¤¸à¤¾à¤²à¤¾ (Paneer Butter Masala)',
    'à¤šà¥€à¤œ à¤®à¤¾à¤°à¥à¤—à¤°à¥€à¤Ÿà¤¾ à¤ªà¤¿à¤à¥à¤à¤¾ (Cheese Margherita Pizza)',
    'à¤¦à¤® à¤¬à¤¿à¤°à¥à¤¯à¤¾à¤£à¥€ (Dum Biryani)'
  ];
  const choice = prompt(`ðŸŽ™ï¸ Voice Recognition:\nChoose or enter your food craving to search:\n\n1. ${samples[0]}\n2. ${samples[1]}\n3. ${samples[2]}\n4. ${samples[3]}\n5. ${samples[4]}\n\nEnter dish name:`, 'à¤®à¤¿à¤¸à¤³ à¤ªà¤¾à¤µ');
  if (choice) {
    const searchInput = document.getElementById('foodSearchInput');
    if (searchInput) {
      searchInput.value = choice.split('(')[0].trim();
      renderCustomerView();
    }
    playSound('chime');
    showToast(`ðŸŽ™ï¸ Voice Search Applied: "${choice}"`, 'success');
  }
}

// -------------------------------------------------------------
// PHASE 15: IN-APP LIVE CHAT DRAWER (CUSTOMER ↔ COURIER ↔ KITCHEN)
// -------------------------------------------------------------
let activeChatOrderId = null;

function openOrderChat(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;
  activeChatOrderId = orderId;

  if (!Array.isArray(order.chatHistory) || !order.chatHistory.length) {
    order.chatHistory = [
      {
        id: 'msg_1',
        sender: 'rider',
        senderName: order.deliveryBoy || 'Pravin Courier',
        text: `Namaskar! I am your delivery partner for Order #${order.id}. On my way to ${order.restaurantName}!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  }

  const nameEl = document.getElementById('chatPartnerName');
  const refEl = document.getElementById('chatOrderRef');
  if (nameEl) nameEl.textContent = `🛵 ${order.deliveryBoy || 'Pravin Courier'}`;
  if (refEl) refEl.textContent = `Order #${order.id} • ${order.restaurantName}`;

  renderChatMessages();
  openModal('orderChatDrawer');
  playSound('chime');
}

function renderChatMessages() {
  const container = document.getElementById('chatMessagesContainer');
  if (!container || !activeChatOrderId) return;
  const order = appData.orders.find(o => o.id === activeChatOrderId);
  if (!order) return;

  container.innerHTML = (order.chatHistory || []).map(m => `
    <div class="chat-bubble ${m.sender === 'customer' ? 'sent' : 'received'}">
      ${m.sender !== 'customer' ? `<div style="font-size: 10px; font-weight: 700; opacity: 0.8; margin-bottom: 2px;">${m.senderName}</div>` : ''}
      <div>${m.text}</div>
      <div class="chat-bubble-meta">
        <span>${m.time}</span>
        ${m.sender === 'customer' ? '<span>✓✓</span>' : ''}
      </div>
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
}

function sendPresetChatMessage(text) {
  const input = document.getElementById('chatMessageInput');
  if (input) input.value = text;
  sendChatMessage();
}

function sendChatMessage() {
  const input = document.getElementById('chatMessageInput');
  const text = (input?.value || '').trim();
  if (!text || !activeChatOrderId) return;

  const order = appData.orders.find(o => o.id === activeChatOrderId);
  if (!order) return;

  if (!Array.isArray(order.chatHistory)) order.chatHistory = [];

  const userMsg = {
    id: 'msg_' + Date.now(),
    sender: 'customer',
    senderName: appData.currentUser?.name || 'Customer',
    text: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  order.chatHistory.push(userMsg);
  input.value = '';
  renderChatMessages();
  playSound('chime');
  saveState();

  // Simulated instant smart courier / kitchen reply
  setTimeout(() => {
    let reply = 'Noted! I will make sure this is taken care of. Safe delivery in progress!';
    const lower = text.toLowerCase();
    if (lower.includes('bell') || lower.includes('doorbell')) {
      reply = 'Sure! I will ring the doorbell gently when I reach your flat.';
    } else if (lower.includes('gate') || lower.includes('security')) {
      reply = 'Understood! I will hand it over to your society security guard and notify you.';
    } else if (lower.includes('spoon') || lower.includes('cutlery') || lower.includes('napkin')) {
      reply = 'Checked with the restaurant chef: extra cutlery and tissues are packed in your bag!';
    } else if (lower.includes('call')) {
      reply = 'Will do! Calling you as soon as I arrive at your building gate.';
    }

    order.chatHistory.push({
      id: 'msg_' + (Date.now() + 1),
      sender: 'rider',
      senderName: order.deliveryBoy || 'Pravin Courier',
      text: reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    renderChatMessages();
    playSound('kitchen_alert');
    saveState();
  }, 1200);
}

// -------------------------------------------------------------
// PHASE 15: DIGITAL WAITER BUZZER (DINE-IN TABLE CALLS)
// -------------------------------------------------------------
let activeWaiterTable = 'Table #01 (AC Family Hall)';
let vendorWaiterAlerts = [];

function openWaiterCallModal(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  activeWaiterTable = order?.tableNumber || 'Table #01 (AC Family Hall)';
  const desc = document.getElementById('waiterModalTableDesc');
  if (desc) desc.textContent = `${activeWaiterTable} • Immediate Staff Alert`;
  openModal('waiterCallModal');
  playSound('chime');
}

function triggerWaiterCall(serviceType) {
  closeModal('waiterCallModal');
  playSound('classic_bell');
  showToast(`🔔 Waiter Buzzed: "${serviceType}" dispatched for ${activeWaiterTable}!`, 'success');

  const alertItem = {
    id: 'wtr_' + Date.now(),
    table: activeWaiterTable,
    service: serviceType,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  vendorWaiterAlerts.unshift(alertItem);
  renderVendorWaiterAlerts();
  pushNotification('🔔', `Dine-In Alert: ${activeWaiterTable} requested ${serviceType}`);
  speakVoiceAlert(`Attention waiter! ${activeWaiterTable} requested ${serviceType}`);
}

function renderVendorWaiterAlerts() {
  const container = document.getElementById('vendorWaiterCallAlerts');
  if (!container) return;

  if (!vendorWaiterAlerts.length) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');
  container.innerHTML = `
    <div style="background: #fefce8; border: 1.5px solid #f59e0b; border-radius: var(--radius-sm); padding: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span style="font-weight: 800; font-size: 14px; color: #b45309;">🔔 Live Table Buzzers (${vendorWaiterAlerts.length})</span>
        <button class="btn-secondary" onclick="clearAllWaiterAlerts()" style="padding: 2px 8px; font-size: 11px;">Clear All</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${vendorWaiterAlerts.map(a => `
          <div class="vendor-waiter-alert-card">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 22px;">ðŸ›Žï¸</span>
              <div>
                <div style="font-weight: 800; font-size: 13px;">${a.table}</div>
                <div style="font-size: 12px; opacity: 0.9;">Requested: <b>${a.service}</b> (${a.time})</div>
              </div>
            </div>
            <button class="btn-primary" onclick="dismissWaiterAlert('${a.id}')" style="margin: 0; padding: 6px 12px; font-size: 12px; background: #059669; border-color: #059669;">
              ✅ Attended
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function dismissWaiterAlert(id) {
  vendorWaiterAlerts = vendorWaiterAlerts.filter(a => a.id !== id);
  renderVendorWaiterAlerts();
  playSound('chime');
  showToast('Table call marked as Attended ✅', 'info');
}

function clearAllWaiterAlerts() {
  vendorWaiterAlerts = [];
  renderVendorWaiterAlerts();
  playSound('chime');
}

// -------------------------------------------------------------
// DELIVERY AREA & CITY SELECTOR ENGINE (SWIGGY/ZOMATO GEOFENCING)
// -------------------------------------------------------------
let deliveryZonesList = appData.deliveryZones || [
  { id: 'zone_sakoli_1', city: 'Sakoli', name: 'Main Market & Station Road', eta: '20-25 mins', baseFee: 30, active: true },
  { id: 'zone_sakoli_2', city: 'Sakoli', name: 'Ward 3, 4 & Green Avenue', eta: '20 mins', baseFee: 30, active: true },
  { id: 'zone_sakoli_3', city: 'Sakoli', name: 'College Campus & Bypass Chowk', eta: '25-30 mins', baseFee: 35, active: true },
  { id: 'zone_sakoli_4', city: 'Sakoli', name: 'Sendurwafa Flyover Corridor', eta: '30-35 mins', baseFee: 40, active: true },
  { id: 'zone_sakoli_5', city: 'Sakoli', name: 'Bus Depot & Civil Hospital Area', eta: '20-25 mins', baseFee: 30, active: true },
  { id: 'zone_lakhani_1', city: 'Lakhani', name: 'Lakhani Town Hub & Main Chowk', eta: '35-45 mins', baseFee: 50, active: true },
  { id: 'zone_bhandara_1', city: 'Bhandara', name: 'Bhandara City Central & Gandhi Chowk', eta: '45-55 mins', baseFee: 70, active: true }
];

let currentSelectedCity = 'Sakoli';
let currentSelectedZone = deliveryZonesList[0];

function renderLocationCityTabs() {
  const container = document.getElementById('locationCityTabs');
  if (!container) return;

  const cities = [...new Set(deliveryZonesList.map(z => z.city))];
  if (!cities.some(c => c.toLowerCase() === currentSelectedCity.toLowerCase())) {
    currentSelectedCity = cities[0] || 'Sakoli';
  }

  container.innerHTML = cities.map(city => `
    <button type="button" class="category-pill ${city.toLowerCase() === currentSelectedCity.toLowerCase() ? 'active' : ''}" onclick="switchLocationCity('${city}', this)">
      🏙️ ${city}
    </button>
  `).join('');
}

function openLocationModal() {
  renderLocationCityTabs();
  renderServiceZones(currentSelectedCity);
  openModal('locationSelectorModal');
  playSound('chime');
}

function renderServiceZones(cityFilter = 'Sakoli', searchQuery = '') {
  const container = document.getElementById('serviceZonesContainer');
  if (!container) return;

  let zones = deliveryZonesList.filter(z => z.city.toLowerCase() === cityFilter.toLowerCase() && z.active !== false);

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    zones = deliveryZonesList.filter(z => (z.name.toLowerCase().includes(q) || z.city.toLowerCase().includes(q)) && z.active !== false);
  }

  if (!zones.length) {
    container.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text-muted);">
        <div style="font-size: 32px; margin-bottom: 6px;">🛵💨</div>
        <div style="font-weight: 700;">No active service zones found</div>
        <div style="font-size: 12px; margin-top: 4px;">We are rapidly expanding. Try selecting another city above or contact support.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = zones.map(z => {
    const isSelected = currentSelectedZone && currentSelectedZone.id === z.id;
    return `
      <div class="location-zone-card ${isSelected ? 'selected' : ''}" onclick="selectDeliveryZone('${z.id}'); setTimeout(() => document.getElementById('restaurantGrid')?.scrollIntoView({behavior: 'smooth', block: 'start'}), 150);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">${isSelected ? '🔘' : '⚪'}</span>
          <div>
            <div style="font-weight: 800; font-size: 13px;">${z.name}</div>
            <div style="font-size: 11px; color: var(--text-muted);">
              ⏱️ ${z.eta} • Base Delivery: ₹${z.baseFee}
            </div>
          </div>
        </div>
        <span class="zone-badge-active">🟢 Active Zone</span>
      </div>
    `;
  }).join('');
}

function switchLocationCity(city, btnEl) {
  currentSelectedCity = city;
  const tabs = document.querySelectorAll('#locationCityTabs .category-pill');
  tabs.forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  const searchInput = document.getElementById('locationSearchInput');
  if (searchInput) searchInput.value = '';

  renderServiceZones(city);
  playSound('chime');
}

function searchDeliveryZones(query) {
  renderServiceZones(currentSelectedCity, (query || '').trim());
}

function selectDeliveryZone(zoneId) {
  const zone = deliveryZonesList.find(z => z.id === zoneId);
  if (!zone) return;

  currentSelectedZone = zone;
  currentSelectedCity = zone.city;

  // Update header & search labels
  const label = document.getElementById('currentSelectedAreaLabel');
  if (label) {
    label.textContent = `${zone.city} (${zone.name.split('&')[0].trim()})`;
  }
  const searchLabel = document.getElementById('searchAreaLabel');
  if (searchLabel) {
    searchLabel.textContent = `${zone.city} (${zone.name.split('&')[0].trim()})`;
  }

  // Update settings delivery base if zone has specific fee
  if (appData.settings && zone.baseFee) {
    appData.settings.deliveryBase = zone.baseFee;
  }

  // Pre-fill delivery address in Cart if available
  const custAddr = document.getElementById('custAddress');
  if (custAddr && (!custAddr.value || custAddr.value.startsWith('['))) {
    custAddr.value = `[${zone.city}] ${zone.name}, Landmark, House/Flat No...`;
  }

  closeModal('locationSelectorModal');
  playSound('delivered');
  showToast(`📍 Delivery Area Set: ${zone.city} - ${zone.name}`, 'success');
  updateBillTotals();
  renderCustomerView();
}

// -------------------------------------------------------------
// SUPER ADMIN DELIVERY ZONES MANAGEMENT CRUD ENGINE
// -------------------------------------------------------------
let adminSelectedZoneCityFilter = 'All';

function renderAdminDeliveryZones(cityFilter = null) {
  if (cityFilter !== null) adminSelectedZoneCityFilter = cityFilter;
  const table = document.getElementById('adminDeliveryZonesTable');
  const cityRow = document.getElementById('adminZoneCityFilterRow');
  if (!table) return;

  const cities = ['All', ...new Set(deliveryZonesList.map(z => z.city))];
  
  if (cityRow) {
    cityRow.innerHTML = cities.map(c => `
      <button type="button" class="category-pill ${c === adminSelectedZoneCityFilter ? 'active' : ''}" onclick="renderAdminDeliveryZones('${c}')">
        ${c === 'All' ? '✨  All Cities' : '🏙️ ' + c} (${c === 'All' ? deliveryZonesList.length : deliveryZonesList.filter(z => z.city === c).length})
      </button>
    `).join('');
  }

  let list = deliveryZonesList;
  if (adminSelectedZoneCityFilter !== 'All') {
    list = list.filter(z => z.city === adminSelectedZoneCityFilter);
  }

  if (!list.length) {
    table.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted); background: var(--bg); border-radius: var(--radius-sm);">
        <div style="font-size: 28px; margin-bottom: 6px;">📍</div>
        <div style="font-weight: 700;">No delivery areas found for this city.</div>
        <div style="font-size: 12px; margin-top: 4px;">Click "+ Add New Delivery Area 📍" button above to create one.</div>
      </div>
    `;
    return;
  }

  table.innerHTML = `
    <table class="invoice-table">
      <thead>
        <tr>
          <th>City</th>
          <th>Area / Ward / Landmark</th>
          <th>ETA Speed</th>
          <th>Delivery Fee</th>
          <th>Service Status</th>
          <th style="text-align: right;">Admin Actions</th>
        </tr>
      </thead>
      <tbody>
        ${list.map(z => `
          <tr>
            <td><b style="font-size: 13px; color: var(--primary);">🏙️ ${z.city}</b></td>
            <td>
              <b style="font-size: 13px;">${z.name}</b><br>
              <span style="font-size: 11px; color: var(--text-muted);">Zone ID: <code>${z.id}</code></span>
            </td>
            <td>⏱️ ${z.eta}</td>
            <td><b>₹${z.baseFee}</b></td>
            <td>
              <button type="button" class="status-pill ${z.active !== false ? 'delivered' : 'cancelled'}" onclick="toggleAdminZoneStatus('${z.id}')" title="Click to toggle status" style="cursor: pointer; border: none;">
                ${z.active !== false ? '🟢 Active' : '⏸️ Paused'}
              </button>
            </td>
            <td style="text-align: right;">
              <div style="display: flex; gap: 6px; justify-content: flex-end;">
                <button type="button" class="btn-secondary" onclick="openAdminEditZoneModal('${z.id}')" style="padding: 4px 8px; font-size: 11px;">✏️ Edit</button>
                <button type="button" class="btn-danger" onclick="deleteAdminDeliveryZone('${z.id}')" style="padding: 4px 8px; font-size: 11px;">🗑‘ï¸ Delete</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function openAdminAddZoneModal() {
  document.getElementById('adminZoneModalTitle').textContent = '📍 Add New Delivery Area / Zone';
  document.getElementById('adminZoneEditId').value = '';
  document.getElementById('adminZoneCityInput').value = adminSelectedZoneCityFilter !== 'All' ? adminSelectedZoneCityFilter : 'Sakoli';
  document.getElementById('adminZoneNameInput').value = '';
  document.getElementById('adminZoneEtaInput').value = '20-25 mins';
  document.getElementById('adminZoneFeeInput').value = '30';
  document.getElementById('adminZoneStatusSelect').value = 'active';
  openModal('adminZoneModal');
}

function openAdminEditZoneModal(zoneId) {
  const zone = deliveryZonesList.find(z => z.id === zoneId);
  if (!zone) return;

  document.getElementById('adminZoneModalTitle').textContent = `✏️ Edit Delivery Area (${zone.city})`;
  document.getElementById('adminZoneEditId').value = zone.id;
  document.getElementById('adminZoneCityInput').value = zone.city;
  document.getElementById('adminZoneNameInput').value = zone.name;
  document.getElementById('adminZoneEtaInput').value = zone.eta;
  document.getElementById('adminZoneFeeInput').value = zone.baseFee;
  document.getElementById('adminZoneStatusSelect').value = zone.active !== false ? 'active' : 'paused';
  openModal('adminZoneModal');
}

function saveAdminDeliveryZone() {
  const editId = (document.getElementById('adminZoneEditId')?.value || '').trim();
  const city = (document.getElementById('adminZoneCityInput')?.value || '').trim();
  const name = (document.getElementById('adminZoneNameInput')?.value || '').trim();
  const eta = (document.getElementById('adminZoneEtaInput')?.value || '').trim() || '20-25 mins';
  const fee = parseInt(document.getElementById('adminZoneFeeInput')?.value || '30', 10);
  const active = document.getElementById('adminZoneStatusSelect')?.value === 'active';

  if (!city || !name) {
    showToast('Please enter both City Name and Area / Ward Name', 'warning');
    return;
  }

  if (editId) {
    const existing = deliveryZonesList.find(z => z.id === editId);
    if (existing) {
      existing.city = city;
      existing.name = name;
      existing.eta = eta;
      existing.baseFee = isNaN(fee) ? 30 : fee;
      existing.active = active;
      showToast(`Updated area: ${city} - ${name} ✅`, 'success');
    }
  } else {
    const newId = `zone_${city.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now()}`;
    const newZone = {
      id: newId,
      city,
      name,
      eta,
      baseFee: isNaN(fee) ? 30 : fee,
      active
    };
    deliveryZonesList.push(newZone);
    showToast(`Added new delivery zone for ${city}! 📍`, 'success');
  }

  appData.deliveryZones = deliveryZonesList;
  saveState();
  closeModal('adminZoneModal');
  playSound('order_placed');

  renderAdminDeliveryZones();
  renderLocationCityTabs();
  renderServiceZones(currentSelectedCity);
}

function toggleAdminZoneStatus(zoneId) {
  const zone = deliveryZonesList.find(z => z.id === zoneId);
  if (!zone) return;
  zone.active = zone.active === false ? true : false;
  appData.deliveryZones = deliveryZonesList;
  saveState();
  showToast(`${zone.city} - ${zone.name} is now ${zone.active ? 'Active 🟢' : 'Paused ⏸️'}`, 'info');
  renderAdminDeliveryZones();
  renderServiceZones(currentSelectedCity);
}

function sendPartnerApprovalNotification(rest) {
  const content = document.getElementById('mockNotificationContent');
  const vendorLink = window.location.origin + window.location.pathname + '?vendor=true';
  
  content.innerHTML = `
    <div style="font-size: 13px; color: var(--text-main); margin-bottom: 12px;">
      <b>To:</b> ${rest.email || 'Partner'}<br>
      <b>Subject:</b> Congratulations! Your BhookIt Partnership is Approved 🎉
    </div>
    <div style="background: var(--bg-card); padding: 12px; border-radius: 8px; border: 1px solid var(--border); font-size: 13px;">
      <p>Hi <b>${rest.name}</b>,</p>
      <p>Your KYC and registration documents have been verified and approved by the BhookIt Admin team.</p>
      <p>You can now log in to the Vendor Portal to manage your menu, track orders, and view payouts.</p>
      <div style="margin: 16px 0;">
        <a href="${vendorLink}" target="_blank" style="display:inline-block; background: #2563eb; color: #fff; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: 700;">Open Vendor App</a>
      </div>
      <p>Commission Rate: <b>${rest.commissionRate}%</b></p>
      <p>Welcome aboard!<br>- BhookIt Team</p>
    </div>
  `;
  
  openModal('mockNotificationModal');
}

function deleteAdminDeliveryZone(zoneId) {
  const zone = deliveryZonesList.find(z => z.id === zoneId);
  if (!zone) return;
  if (!confirm(`Are you sure you want to delete delivery area "${zone.city} - ${zone.name}"?`)) return;

  deliveryZonesList = deliveryZonesList.filter(z => z.id !== zoneId);
  appData.deliveryZones = deliveryZonesList;
  saveState();
  showToast(`Deleted delivery area "${zone.name}"`, 'info');
  renderAdminDeliveryZones();
  renderLocationCityTabs();
  renderServiceZones(currentSelectedCity);
}

function detectGpsLocation() {
  const btn = document.querySelector('.gps-detect-btn');
  if (btn) btn.innerHTML = '<span style="font-size: 18px;">⏳</span> <span style="font-size: 12px; font-weight:700;">Acquiring GPS Satellite Lock...</span>';

  if (!navigator.geolocation) {
    selectDeliveryZone('zone_sakoli_1');
    showToast('GPS hardware not detected. Defaulted to Sakoli Main Hub.', 'info');
    setTimeout(() => document.getElementById('restaurantGrid')?.scrollIntoView({behavior: 'smooth', block: 'start'}), 150);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      selectDeliveryZone('zone_sakoli_1');
      showToast(`🎯 GPS Location Locked (${lat.toFixed(3)}, ${lng.toFixed(3)}): Welcome to Sakoli Main Zone!`, 'success');
      playSound('delivered');
    },
    (err) => {
      console.warn('Geolocation error:', err);
      selectDeliveryZone('zone_sakoli_1');
      showToast('📍 Switched to Sakoli Central Service Zone', 'info');
      playSound('chime');
    },
    { timeout: 5000 }
  );
}

// -------------------------------------------------------------
// INITIALIZATION
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('foodSearchInput');
  if (searchInput) searchInput.addEventListener('input', renderCustomerView);

  const langSel = document.getElementById('langSelect');
  if (langSel) langSel.value = currentLanguage;

  const chimeToneSelect = document.getElementById('kitchenChimeToneSelect');
  if (chimeToneSelect) chimeToneSelect.value = kitchenAudioSettings.chimeTone || 'modern_chime';

  const voiceSpeedSelect = document.getElementById('kitchenVoiceSpeedSelect');
  if (voiceSpeedSelect) voiceSpeedSelect.value = String(kitchenAudioSettings.voiceSpeed || 1.0);

  initTheme();
  renderNotifications();
  applyLanguageTranslations();
  updateUserBadge();
  updateCartBadge();
  updateWalletUI();
  updateWeatherPillUI();
  renderLocationCityTabs();
  selectDeliveryZone('zone_sakoli_1');
  renderCustomerTableBookings();
  renderCustomerView();
  renderVendorInventory();
  renderAdminDisputes();
  renderAdminSurgeSwitchboard();
  renderAdminHeatmap();
  renderAdminFleetTelemetry();
  renderAdminDeliveryZones();
  renderRiderBatchMode();

  // Check deep link parameter for live order tracking (?track=FB-XXXXX)
  const urlParams = new URLSearchParams(window.location.search);
  const trackParam = urlParams.get('track');
  if (trackParam) {
    currentTrackedOrderId = trackParam;
    show('track');
    showToast(`📍 Showing live delivery tracking for Order #${trackParam}`, 'info');
  }

  const partyParam = urlParams.get('party');
  if (partyParam) {
    groupOrderState.roomCode = partyParam;
    openGroupOrderModal();
    showToast(`👥 Joined Group Order Room: ${partyParam}`, 'info');
  }

  const kdsParam = urlParams.get('kds');
  if (kdsParam) {
    openKdsModal();
  }
});

// === Phase 15: Voice Search Engine ===
function initVoiceSearch() {
  const btnVoice = document.getElementById('btnVoiceSearch');
  const searchInput = document.getElementById('foodSearchInput');
  
  if (!btnVoice || !searchInput) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    btnVoice.style.display = 'none'; // Not supported
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US'; // Could be 'en-US' or 'mr-IN' based on preference

  let isRecording = false;

  btnVoice.addEventListener('click', () => {
    if (isRecording) {
      recognition.stop();
      return;
    }
    recognition.start();
  });

  recognition.onstart = () => {
    isRecording = true;
    btnVoice.classList.add('voice-search-active');
    searchInput.placeholder = 'Listening...';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    searchInput.value = transcript;
    
    // Trigger the search input event so filters run
    const inputEvent = new Event('input', { bubbles: true });
    searchInput.dispatchEvent(inputEvent);
    showToast(`Voice Search: "${transcript}"`, 'success');
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    showToast('Voice search failed. Please try again.', 'error');
  };

  recognition.onend = () => {
    isRecording = false;
    btnVoice.classList.remove('voice-search-active');
    searchInput.placeholder = 'Search for dishes, restaurants, or cuisines (e.g. Pizza, Thali, Biryani)...';
  };
}

document.addEventListener('DOMContentLoaded', () => {
  initVoiceSearch();
});

// ==========================================
// RESTAURANT PARTNER REGISTRATION & KYC
// ==========================================

function openInvitePartnerModal() {
  openModal('invitePartnerModal');
}

function sendInvite() {
  const email = document.getElementById('inviteEmail').value;
  if (!email) {
    showToast('Please enter an email address.', 'error');
    return;
  }
  
  closeModal('invitePartnerModal');
  showToast('Invitation sent to ' + email, 'success');
  
  // Simulate showing the registration panel directly for testing
  setTimeout(() => {
    show('partnerRegistration');
    showToast('Simulating: Partner opened registration link from email.', 'info');
  }, 1000);
}

function submitPartnerRegistration(event) {
  event.preventDefault();
  
  const name = document.getElementById('prName').value;
  const email = document.getElementById('prEmail').value;
  const phone = document.getElementById('prPhone').value;
  const fssai = document.getElementById('prFssai').value;
  const gst = document.getElementById('prGst').value;
  const category = document.getElementById('prCategory').value;
  const address = document.getElementById('prAddress').value;
  
  const newId = appData.restaurants.length > 0 ? Math.max(...appData.restaurants.map(r => r.id)) + 1 : 1;
  
  const newRestaurant = {
    id: newId,
    name: name,
    email: email,
    phone: phone,
    fssai: fssai,
    gstin: gst,
    category: category,
    address: address,
    commissionRate: 15, // Default
    approved: false,
    rating: 0,
    deliveryTime: '30-45 mins',
    coverImg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    foods: []
  };
  
  appData.restaurants.push(newRestaurant);
  saveState();
  renderAdminView();
  
  document.getElementById('prName').value = '';
  document.getElementById('prEmail').value = '';
  document.getElementById('prPhone').value = '';
  document.getElementById('prFssai').value = '';
  document.getElementById('prGst').value = '';
  document.getElementById('prCategory').value = '';
  document.getElementById('prAddress').value = '';
  
  showToast('Registration submitted successfully! Pending Admin Approval.', 'success');
  
  // Return to admin view to simulate normal app behavior
  setTimeout(() => {
    show('admin');
  }, 1500);
}

function sendPartnerApprovalNotification(rest) {
  const content = document.getElementById('mockNotificationContent');
  const vendorLink = window.location.origin + window.location.pathname + '?vendor=true';
  
  content.innerHTML = `
    <div style="font-size: 13px; color: var(--text-main); margin-bottom: 12px;">
      <b>To:</b> ${rest.email || 'Partner'}<br>
      <b>Subject:</b> Congratulations! Your BhookIt Partnership is Approved 🎉
    </div>
    <div style="background: var(--bg-card); padding: 12px; border-radius: 8px; border: 1px solid var(--border); font-size: 13px;">
      <p>Hi <b>${rest.name}</b>,</p>
      <p>Your KYC and registration documents have been verified and approved by the BhookIt Admin team.</p>
      <p>You can now log in to the Vendor Portal to manage your menu, track orders, and view payouts.</p>
      <div style="margin: 16px 0;">
        <a href="${vendorLink}" target="_blank" style="display:inline-block; background: #2563eb; color: #fff; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: 700;">Open Vendor App</a>
      </div>
      <p>Commission Rate: <b>${rest.commissionRate}%</b></p>
      <p>Welcome aboard!<br>- BhookIt Team</p>
    </div>
  `;
  
  openModal('mockNotificationModal');
}

// Partner Registration Logic
function openInvitePartnerModal() {
  openModal('invitePartnerModal');
}

function sendInvite() {
  const email = document.getElementById('inviteEmail').value;
  if (!email) {
    showToast('Please enter an email address', 'error');
    return;
  }
  closeModal('invitePartnerModal');
  showToast(`Registration link sent to ${email}`, 'success');
  
  // Show mock notification to simulate email received
  const msg = `Click here to register your restaurant: <a href="#" onclick="closeModal('mockNotificationModal'); show('partnerRegistration')">Partner Registration Form</a>`;
  showMockNotification('Email', email, msg, '');
}

function submitPartnerRegistration(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.restName.value;
  const phone = form.restPhone.value;
  const address = form.restAddress.value;
  const docs = form.restDocs.value;
  
  const newRest = {
    id: Date.now(),
    name: name,
    rating: 0,
    deliveryTime: '30-45 mins',
    fssai: 'Pending',
    hygiene: 'N/A',
    minOrder: 100,
    approved: false, // Pending approval
    open: false,
    coverImg: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    foods: []
  };
  
  appData.restaurants.push(newRest);
  saveState();
  
  form.reset();
  showToast('Registration submitted! Awaiting Admin Approval.', 'success');
  
  // Go back to main
  show('explore');
}

function showMockNotification(type, to, message, link) {
  document.getElementById('mockNotifType').innerText = type + ' Notification';
  document.getElementById('mockNotifTo').innerText = to;
  document.getElementById('mockNotifMsg').innerHTML = message;
  
  const btn = document.getElementById('mockNotifAction');
  if (link) {
    btn.style.display = 'inline-block';
    btn.onclick = () => {
      closeModal('mockNotificationModal');
      // Set role to vendor and show vendor portal if applicable
      appData.currentUser.role = 'vendor';
      saveState();
      show('vendor');
    };
  } else {
    btn.style.display = 'none';
  }
  
  openModal('mockNotificationModal');
}
