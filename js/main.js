/* Bloom Chiropractic — main.js */

document.getElementById('year').textContent = new Date().getFullYear();

// ── Nav scroll shadow ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── Mobile menu ──
const toggle   = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

toggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Fade-in on scroll ──
if ('IntersectionObserver' in window) {
  const style = document.createElement('style');
  style.textContent = `.fade-in{opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease}.fade-in.visible{opacity:1;transform:none}`;
  document.head.appendChild(style);

  const targets = ['.service-card','.why__item','.testimonial-card','.pricing-card','.condition-pill','.faq__item','.contact__detail','.about__value'];
  document.querySelectorAll(targets.join(',')).forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
  });

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
}

// ── Active nav link ──
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');
const sections   = document.querySelectorAll('section[id]');
const activeStyle = document.createElement('style');
activeStyle.textContent = `.nav__links a.active{color:var(--sage)}`;
document.head.appendChild(activeStyle);

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      const id = section.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { passive: true });

// ── Sticky Book Now: hide when a Book button or the booking section is visible ──
if ('IntersectionObserver' in window) {
  const mobileBar    = document.querySelector('.book-sticky-mobile');
  const desktopBtn   = document.querySelector('.book-sticky-desktop');

  // Watch all primary book buttons AND the booking widget section
  const watchTargets = [
    ...document.querySelectorAll('.btn--primary[href="#book"], a.btn--primary'),
    document.querySelector('#book')
  ].filter(Boolean);

  let visibleCount = 0;

  const bookObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        visibleCount++;
      } else {
        visibleCount = Math.max(0, visibleCount - 1);
      }
    });

    const hide = visibleCount > 0;
    if (mobileBar)  mobileBar.classList.toggle('hidden', hide);
    if (desktopBtn) desktopBtn.classList.toggle('hidden', hide);

  }, { threshold: 0.5 });

  watchTargets.forEach(el => bookObserver.observe(el));
}
