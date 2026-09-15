// lib/supabaseClient.js
// Initializes Supabase client from build-time injected config
// Exposes window.supabaseClient for app.js consumption
// Does not overwrite window.supabase (CDN namespace)

(function() {
  const config = window.__SUPABASE_CONFIG__;
  if (!config?.url || !config?.anonKey) {
    throw new Error('Supabase config missing. Ensure supabase-config.js loads before this script.');
  }

  if (!window.supabase?.createClient) {
    throw new Error('@supabase/supabase-js CDN script not loaded. Check script order.');
  }

  window.supabaseClient = window.supabase.createClient(config.url, config.anonKey);
})();