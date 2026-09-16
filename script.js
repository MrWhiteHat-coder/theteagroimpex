const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const header = document.getElementById('header');
const progress = document.getElementById('scrollProgress');
const topBtn = document.getElementById('topBtn');
const year = document.getElementById('year');

if (year) year.textContent = new Date().getFullYear();

menuBtn?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', String(Boolean(isOpen)));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn?.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
});

function updateScrollState() {
  const page = document.documentElement;
  const maxScroll = page.scrollHeight - page.clientHeight;
  const scrollPercent = maxScroll > 0 ? (page.scrollTop / maxScroll) * 100 : 0;

  if (progress) progress.style.width = `${scrollPercent}%`;
  if (header) header.style.boxShadow = window.scrollY > 12 ? '0 8px 28px rgba(18, 61, 44, .08)' : 'none';
  topBtn?.classList.toggle('show', window.scrollY > 600);
}

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || '';
    const start = performance.now();

    function animate(now) {
      const progressValue = Math.min((now - start) / 1000, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progressValue < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
    observer.unobserve(element);
  });
}, { threshold: .6 });
counters.forEach((counter) => counterObserver.observe(counter));

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -60% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

const revealItems = document.querySelectorAll('.product-card, .product-more, .process-step, .quote-grid, .contact-form');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: .12 });
revealItems.forEach((item) => {
  item.classList.add('reveal-item');
  revealObserver.observe(item);
});

const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMsg');
let toastTimer;

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (toast && toastMessage) {
    toastMessage.textContent = 'Thanks — we’ll be in touch soon.';
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 4200);
  }
  form.reset();
});
