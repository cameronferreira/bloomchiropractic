/* ============================================================
   BLOOM CHIROPRACTIC — tracking.js
   Contact-click events for Google Tag Manager. Every WhatsApp,
   email and phone link pushes one dataLayer event when tapped:
     whatsapp_click · email_click · phone_click
   In GTM, use a Custom Event trigger with the matching name.
   ============================================================ */

(function () {
  window.dataLayer = window.dataLayer || [];

  function eventFor(href) {
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) return 'whatsapp_click';
    if (/^mailto:/i.test(href)) return 'email_click';
    if (/^tel:/i.test(href)) return 'phone_click';
    return null;
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    var name = eventFor(link.href);
    if (name) window.dataLayer.push({ event: name });
  });
})();
