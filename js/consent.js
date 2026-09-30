/* ============================================================
   BLOOM CHIROPRACTIC — consent.js
   Cookie consent (opt-out, Google Consent Mode v2).

   Defaults are set inline in <head>, before Google Tag Manager
   loads: granted unless the visitor has declined. This file shows
   the notice and tells GTM about the choice:
     1. gtag('consent', 'update', ...)       read by Google tags'
                                             built-in consent checks
     2. dataLayer event 'cookie_consent_update'  for GTM triggers,
                                             e.g. non-Google tags
   ============================================================ */

(function () {
  var KEY = 'bloom-consent';

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  window.dataLayer = window.dataLayer || [];
  // gtag() pushes the arguments object, which is the format GTM expects for consent commands
  function gtag() { window.dataLayer.push(arguments); }

  function update(granted) {
    var s = granted ? 'granted' : 'denied';
    gtag('consent', 'update', {
      analytics_storage: s,
      ad_storage: s,
      ad_user_data: s,
      ad_personalization: s
    });
    window.dataLayer.push({ event: 'cookie_consent_update', consent_choice: s });
  }

  // Declining after analytics cookies exist (e.g. changing a previous choice): remove them
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

  var dialog = document.getElementById('cookieBanner');
  if (!dialog) return;
  var card = dialog.querySelector('.cookie-banner');
  var modal = !dialog.classList.contains('cookie-consent--inline');
  var lastFocus = null;

  function focusables() {
    return Array.prototype.slice.call(card.querySelectorAll('a[href], button'));
  }

  // Keep keyboard focus inside the dialog while it is open (modal only)
  function trapTab(e) {
    if (e.key !== 'Tab') return;
    var f = focusables(), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === card)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function open() {
    dialog.hidden = false;
    if (!modal) return;
    lastFocus = document.activeElement;
    document.documentElement.classList.add('cookie-open');
    document.addEventListener('keydown', trapTab);
    card.focus();
  }

  function close() {
    dialog.hidden = true;
    if (!modal) return;
    document.documentElement.classList.remove('cookie-open');
    document.removeEventListener('keydown', trapTab);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function choose(granted) {
    save(granted ? 'granted' : 'denied');
    update(granted);
    if (!granted) clearAnalyticsCookies();
    close();
  }

  dialog.querySelector('[data-consent="accept"]').addEventListener('click', function () { choose(true); });
  dialog.querySelector('[data-consent="decline"]').addEventListener('click', function () { choose(false); });

  document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
    el.addEventListener('click', open);
  });

  if (!read()) open();
})();
