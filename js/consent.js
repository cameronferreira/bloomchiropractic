/* ============================================================
   BLOOM CHIROPRACTIC — consent.js
   Cookie banner. Consent Mode defaults are set inline in <head>,
   before Google Tag Manager loads; this file shows the banner,
   records the visitor's choice and tells Google tags about it.
   ============================================================ */

(function () {
  var KEY = 'bloom-consent';

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  // Same shape as gtag('consent', 'update', ...)
  function update(granted) {
    var s = granted ? 'granted' : 'denied';
    window.dataLayer = window.dataLayer || [];
    (function () { window.dataLayer.push(arguments); })('consent', 'update', {
      analytics_storage: s,
      ad_storage: s,
      ad_user_data: s,
      ad_personalization: s
    });
  }

  var year = document.getElementById('year');
  if (year && !year.textContent) year.textContent = new Date().getFullYear();

  var banner = document.getElementById('cookieBanner');
  if (!banner) return;

  function choose(granted) {
    save(granted ? 'granted' : 'denied');
    update(granted);
    banner.hidden = true;
  }

  banner.querySelector('[data-consent="accept"]').addEventListener('click', function () { choose(true); });
  banner.querySelector('[data-consent="decline"]').addEventListener('click', function () { choose(false); });

  document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
    el.addEventListener('click', function () { banner.hidden = false; });
  });

  if (!read()) banner.hidden = false;
})();
