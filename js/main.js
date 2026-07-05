/* ============================================================
   BLOOM CHIROPRACTIC — main.js
   Animations: scroll reveals, hover micro-interactions,
   hero entrance, pricing counters, scroll progress bar,
   button ripple, image scale on scroll
   All animations respect prefers-reduced-motion
   ============================================================ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Year ── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Scroll progress bar ── */
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
progressBar.style.cssText = `
  position:fixed;top:0;left:0;height:3px;width:0%;
  background:var(--gold);z-index:200;
  transition:width .1s linear;
  pointer-events:none;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
}, { passive: true });

/* ── Nav scroll shadow ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ── Mobile menu ── */
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

/* ── Smooth scroll ── */
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

/* ── Active nav link ── */
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

/* ── Scroll-triggered animations ── */
if ('IntersectionObserver' in window && !reducedMotion) {

  // Inject animation styles
  const animStyle = document.createElement('style');
  animStyle.textContent = `
    /* Fade up — default for most elements */
    .anim-fade-up {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.6s cubic-bezier(.22,1,.36,1),
                  transform 0.6s cubic-bezier(.22,1,.36,1);
    }
    .anim-fade-up.visible { opacity: 1; transform: translateY(0); }

    /* Fade in — for images */
    .anim-fade-in {
      opacity: 0;
      transition: opacity 0.8s ease;
    }
    .anim-fade-in.visible { opacity: 1; }

    /* Scale up — for hero image */
    .anim-scale {
      opacity: 0;
      transform: scale(0.96);
      transition: opacity 0.8s ease, transform 0.8s cubic-bezier(.22,1,.36,1);
    }
    .anim-scale.visible { opacity: 1; transform: scale(1); }

    /* Slide in from left */
    .anim-slide-left {
      opacity: 0;
      transform: translateX(-32px);
      transition: opacity 0.7s cubic-bezier(.22,1,.36,1),
                  transform 0.7s cubic-bezier(.22,1,.36,1);
    }
    .anim-slide-left.visible { opacity: 1; transform: translateX(0); }

    /* Slide in from right */
    .anim-slide-right {
      opacity: 0;
      transform: translateX(32px);
      transition: opacity 0.7s cubic-bezier(.22,1,.36,1),
                  transform 0.7s cubic-bezier(.22,1,.36,1);
    }
    .anim-slide-right.visible { opacity: 1; transform: translateX(0); }

    /* Section headings — fade up with slight scale */
    .anim-heading {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.7s ease, transform 0.7s cubic-bezier(.22,1,.36,1);
    }
    .anim-heading.visible { opacity: 1; transform: translateY(0); }

    /* Stagger delays for grids */
    .stagger-1 { transition-delay: 0ms !important; }
    .stagger-2 { transition-delay: 80ms !important; }
    .stagger-3 { transition-delay: 160ms !important; }
    .stagger-4 { transition-delay: 240ms !important; }
    .stagger-5 { transition-delay: 320ms !important; }
    .stagger-6 { transition-delay: 400ms !important; }
  `;
  document.head.appendChild(animStyle);

  // Helper: add class and observe
  function animateEl(selector, animClass, stagger = false) {
    const els = document.querySelectorAll(selector);
    els.forEach((el, i) => {
      el.classList.add(animClass);
      if (stagger) {
        el.classList.add(`stagger-${(i % 6) + 1}`);
      }
      observer.observe(el);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Hero image — scale in
  animateEl('.hero__image, .hero__image-placeholder', 'anim-scale');

  // Hero content — fade up
  animateEl('.hero__eyebrow', 'anim-fade-up');
  animateEl('.hero__heading', 'anim-heading');
  animateEl('.hero__sub',     'anim-fade-up');
  animateEl('.hero__actions', 'anim-fade-up');
  animateEl('.hero__trust',   'anim-fade-up');

  // Section headings
  document.querySelectorAll('.section__eyebrow, .section__heading, .section__sub').forEach(el => {
    el.classList.add('anim-heading');
    observer.observe(el);
  });

  // About — image from left, content from right
  animateEl('.about__image-wrap',  'anim-slide-left');
  animateEl('.about__lead',        'anim-fade-up');
  animateEl('.about__value',       'anim-fade-up', true);

  // Service cards — staggered
  animateEl('.service-card', 'anim-fade-up', true);

  // Condition pills — staggered
  animateEl('.condition-pill', 'anim-fade-up', true);

  // Why items — staggered
  animateEl('.why__item', 'anim-fade-up', true);

  // Pricing cards — staggered
  animateEl('.pricing-card', 'anim-scale', true);

  // Testimonials — staggered
  animateEl('.testimonial-card', 'anim-fade-up', true);

  // FAQ items
  animateEl('.faq__item', 'anim-fade-up', true);

  // Contact details
  animateEl('.contact__detail', 'anim-fade-up', true);
  animateEl('.map-placeholder, .contact__map', 'anim-slide-right');
}

/* ── Pricing counter animation ── */
if (!reducedMotion) {
  const counters = document.querySelectorAll('.pricing-card__amount');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.textContent, 10);
      const start  = Math.max(0, target - 200);
      const duration = 800;
      const startTime = performance.now();

      function update(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + (target - start) * eased);
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
}

/* ── Button ripple effect ── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';

  btn.addEventListener('click', function(e) {
    if (reducedMotion) return;
    const rect   = this.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const ripple = document.createElement('span');
    const size   = Math.max(rect.width, rect.height) * 2;

    ripple.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      left:${x - size/2}px;top:${y - size/2}px;
      background:rgba(255,255,255,0.25);
      border-radius:50%;
      transform:scale(0);
      animation:ripple-anim 0.5s ease-out forwards;
      pointer-events:none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple-anim { to { transform:scale(1); opacity:0; } }`;
document.head.appendChild(rippleStyle);

/* ── Card hover enhancement — image zoom on about photo ── */
if (!reducedMotion) {
  const aboutImg = document.querySelector('.about__image');
  if (aboutImg) {
    aboutImg.style.transition = 'transform 0.6s cubic-bezier(.22,1,.36,1)';
    aboutImg.closest('.about__image-wrap').addEventListener('mouseenter', () => {
      aboutImg.style.transform = 'scale(1.03)';
    });
    aboutImg.closest('.about__image-wrap').addEventListener('mouseleave', () => {
      aboutImg.style.transform = 'scale(1)';
    });
  }
}

/* ── Sticky Book Now ── */
if ('IntersectionObserver' in window) {
  const mobileBar  = document.querySelector('.book-sticky-mobile');
  const desktopBtn = document.querySelector('.book-sticky-desktop');

  // Watch ALL buttons linking to #book (excluding footer and sticky itself)
  const allBookBtns = [...document.querySelectorAll('a[href="#book"]')]
    .filter(el => !el.closest('.footer') && !el.classList.contains('book-sticky-desktop') && !el.closest('.book-sticky-mobile') && !el.closest('.nav__links'));

  const watchTargets = [
    ...allBookBtns,
    document.querySelector('#book')
  ].filter(Boolean);

  // Use a Set instead of a counter — immune to multi-entry desync bugs
  const visibleSet = new Set();

  const bookObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleSet.add(entry.target);
      else visibleSet.delete(entry.target);
    });
    const hide = visibleSet.size > 0;
    if (mobileBar) mobileBar.classList.toggle('hidden', hide);
  }, { threshold: 0.15 });

  watchTargets.forEach(el => bookObserver.observe(el));
}
