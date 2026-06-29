/* Bloom Chiropractic — main.js */

document.getElementById('year').textContent = new Date().getFullYear();

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

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

if ('IntersectionObserver' in window) {
  const style = document.createElement('style');
  style.textContent = `.fade-in{opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease}.fade-in.visible{opacity:1;transform:none}`;
  document.head.appendChild(style);

  const targets = ['.service-card','.why__item','.testimonial-card','.pricing-card','.condition-pill','.faq__item','.contact__detail','.about__value'];
  document.querySelectorAll(targets.join(',')).forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

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
