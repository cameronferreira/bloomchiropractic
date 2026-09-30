/* ============================================================
   BLOOM CHIROPRACTIC — consent.js
   Cookie notice (opt-out). Consent Mode defaults are set inline in
   <head>, before Google Tag Manager loads: granted unless the visitor
   has declined. This file shows the notice, records the choice and
   tells Google tags about it.
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

  // Declining after analytics cookies exist: remove them as well
  function clearAnalyticsCookies() {
    var parts = location.hostname.split('.');
    var domains = [''];
    for (var i = 0; i < parts.length - 1; i++) domains.push('; domain=.' + parts.slice(i).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
      });
    });
  }

  var year = document.getElementById('year');
  if (year && !year.textContent) year.textContent = new Date().getFullYear();

  var banner = document.getElementById('cookieBanner');
  if (!banner) return;

  function choose(granted) {
    save(granted ? 'granted' : 'denied');
    update(granted);
    if (!granted) clearAnalyticsCookies();
    banner.hidden = true;
  }

  banner.querySelector('[data-consent="accept"]').addEventListener('click', function () { choose(true); });
  banner.querySelector('[data-consent="decline"]').addEventListener('click', function () { choose(false); });

  document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
    el.addEventListener('click', function () { banner.hidden = false; });
  });

  if (!read()) banner.hidden = false;
})();
