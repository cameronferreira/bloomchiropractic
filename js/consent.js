/* ============================================================
   BLOOM CHIROPRACTIC — consent.js
   Cookie consent (opt-out, Google Consent Mode v2).

   Defaults are set inline in <head>, before Google Tag Manager
   loads: granted unless the visitor turned tracking off. The notice
   is information only (one "Crack on" button); opting out happens on
   the privacy page (#cookies), via [data-consent-toggle]. Choices
   reach GTM as:
     1. gtag('consent', 'update', ...)       read by Google tags'
                                             built-in consent checks
     2. dataLayer event 'cookie_consent_update'  for GTM triggers,
                                             e.g. non-Google tags
   ============================================================ */

(function () {
  var KEY = 'bloom-consent-2';
  // Renamed from 'bloom-consent' in Nov 2026 so earlier choices (incl. Decline) reset
  try { localStorage.removeItem('bloom-consent'); } catch (e) {}

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

  function choose(granted) {
    save(granted ? 'granted' : 'denied');
    update(granted);
    if (!granted) clearAnalyticsCookies();
  }

  // Privacy page: turn tracking off or back on
  var toggle = document.querySelector('[data-consent-toggle]');
  var status = document.querySelector('[data-consent-status]');
  function renderToggle() {
    var off = read() === 'denied';
    status.textContent = off ? 'Tracking is off for this browser.' : 'Tracking is on for this browser.';
    toggle.textContent = off ? 'Turn tracking back on' : 'Turn off tracking';
  }
  if (toggle && status) {
    renderToggle();
    toggle.addEventListener('click', function () { choose(read() === 'denied'); renderToggle(); });
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

  // While the notice is open, <html> carries .cookie-pending so the mobile
  // sticky Book bar can step aside; it slides back once a choice is made.
  function open() {
    dialog.hidden = false;
    document.documentElement.classList.add('cookie-pending');
    if (!modal) return;
    lastFocus = document.activeElement;
    document.documentElement.classList.add('cookie-open');
    document.addEventListener('keydown', trapTab);
    card.focus();
  }

  function close() {
    dialog.hidden = true;
    document.documentElement.classList.remove('cookie-pending');
    if (!modal) return;
    document.documentElement.classList.remove('cookie-open');
    document.removeEventListener('keydown', trapTab);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  dialog.querySelector('[data-consent="accept"]').addEventListener('click', function () { choose(true); close(); });

  // The notice is information only, so it also fades away once the visitor
  // has scrolled about one screen height, and is remembered as seen.
  function fadeOnScroll() {
    var startY = window.scrollY;
    function onScroll() {
      if (Math.abs(window.scrollY - startY) < window.innerHeight) return;
      window.removeEventListener('scroll', onScroll);
      choose(true);
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) { close(); return; }
      dialog.style.transition = 'opacity .4s ease';
      dialog.style.opacity = '0';
      setTimeout(function () { close(); dialog.style.transition = dialog.style.opacity = ''; }, 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (!read()) { open(); fadeOnScroll(); }
})();
