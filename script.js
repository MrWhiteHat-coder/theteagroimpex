/* Shared site behaviour: navigation, scroll effects, enquiry forms. */
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

/* Counters */
const counters = document.querySelectorAll('[data-count]');
if (counters.length > 0) {
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
}

/* Scroll reveal */
const revealItems = document.querySelectorAll('.product-card, .product-more, .process-step, .quote-grid, .contact-form, .catalog-card, .contact-card');
if (revealItems.length > 0) {
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
}

/* Toast */
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMsg');
const toastIcon = toast?.querySelector('.toast-icon');
let toastTimer;

function showToast(message, isError = false) {
  if (!toast || !toastMessage) return;
  toastMessage.textContent = message;
  if (toastIcon) toastIcon.textContent = isError ? '!' : '✓';
  toast.classList.toggle('toast-error', isError);
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 6000);
}

const SUCCESS_MESSAGE = 'Thank you. Your enquiry has been received. Our team will get back to you shortly.';
const ERROR_MESSAGE = "We couldn't send your enquiry right now. Please try again or contact our team directly.";

/* ---- Enquiry submission (shared by home form and product modal) ---- */
async function submitEnquiry(form, submitBtn, onSuccess) {
  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  const nameVal = nameInput ? nameInput.value.trim() : '';
  const emailVal = emailInput ? emailInput.value.trim() : '';

  if (!nameVal) {
    showToast('Please enter your name.', true);
    nameInput?.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal || !emailRegex.test(emailVal)) {
    showToast('Please enter a valid email address.', true);
    emailInput?.focus();
    return;
  }

  if (submitBtn) {
    if (submitBtn.disabled) return; // duplicate submission guard
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending enquiry...</span> <span class="spinner" aria-hidden="true">⏳</span>';
  }

  const payload = {
    name: nameVal,
    company: form.querySelector('input[name="company"]')?.value.trim() || '',
    email: emailVal,
    phone: form.querySelector('input[name="phone"]')?.value.trim() || '',
    product: form.querySelector('input[name="product"]')?.value.trim() || '',
    requirement: form.querySelector('input[name="requirement"]')?.value.trim() || '',
    destination: form.querySelector('input[name="destination"]')?.value.trim() || '',
    packaging: form.querySelector('input[name="packaging"]')?.value.trim() || '',
    deliveryDate: form.querySelector('input[name="deliveryDate"]')?.value.trim() || '',
    message: form.querySelector('textarea[name="message"]')?.value.trim() || '',
    'bot-field': form.querySelector('input[name="bot-field"]')?.value || '',
    sourcePage: window.location.href
  };

  const send = (url) => fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  });

  try {
    let response;
    try {
      response = await send('/api/contact');
    } catch (fetchErr) {
      response = await send('/.netlify/functions/contact');
    }
    if (response && response.status === 404) {
      response = await send('/.netlify/functions/contact');
    }

    const resData = await response.json().catch(() => null);

    if (response.ok && resData && resData.success) {
      showToast(resData.message || SUCCESS_MESSAGE, false);
      form.reset();
      if (typeof onSuccess === 'function') onSuccess();
    } else {
      const errorMsg = resData && resData.error ? resData.error : ERROR_MESSAGE;
      showToast(errorMsg, true);
    }
  } catch (err) {
    console.error('Contact form submission error:', err);
    showToast(ERROR_MESSAGE, true);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-text">Send enquiry</span> <span class="btn-arrow" aria-hidden="true">↗</span>';
    }
  }
}

/* ---- Home / contact page form ---- */
const form = document.getElementById('contactForm');
const requirementInput = form?.querySelector('input[name="requirement"]');
const productInput = form?.querySelector('input[name="product"]');

if (form) {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedProduct = urlParams.get('product');
  if (requestedProduct && productInput) productInput.value = requestedProduct;

  document.querySelectorAll('a[data-product]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prodName = btn.getAttribute('data-product');
      if (prodName && productInput) productInput.value = prodName;
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitEnquiry(form, submitBtn);
  });
}

/* ---- Product detail enquiry modal ---- */
const enquiryModal = document.getElementById('enquiryModal');
const modalForm = document.getElementById('modalForm');
const modalSubmitBtn = document.getElementById('modalSubmitBtn');

function openEnquiryModal(prefillProduct) {
  if (!enquiryModal) return;
  const productField = enquiryModal.querySelector('input[name="product"]');
  if (productField && prefillProduct) productField.value = prefillProduct;
  enquiryModal.removeAttribute('hidden');
  document.body.classList.add('modal-open');
  const first = enquiryModal.querySelector('input[name="name"]');
  if (first) first.focus();
}

function closeEnquiryModal() {
  if (!enquiryModal) return;
  enquiryModal.setAttribute('hidden', '');
  document.body.classList.remove('modal-open');
}

document.getElementById('enquiryModalClose')?.addEventListener('click', closeEnquiryModal);

enquiryModal?.addEventListener('click', (e) => {
  if (e.target === enquiryModal) closeEnquiryModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && enquiryModal && !enquiryModal.hasAttribute('hidden')) closeEnquiryModal();
});

/* Mobile sticky CTA opens the modal (product pages) */
document.getElementById('mobileEnquiryCta')?.addEventListener('click', (e) => {
  const detailBtn = document.getElementById('detailEnquireBtn');
  if (detailBtn) {
    e.preventDefault();
    detailBtn.click();
  }
});

/* Auto-open modal when arriving with ?enquire=1 (from card "Enquire" buttons) */
window.addEventListener('DOMContentLoaded', () => {
  if (new URLSearchParams(window.location.search).get('enquire') === '1') {
    const detailBtn = document.getElementById('detailEnquireBtn');
    const productName = document.querySelector('.product-detail-title')?.textContent.trim();
    if (detailBtn) detailBtn.click();
    else if (productName) openEnquiryModal(productName);
  }
});

if (modalForm) {
  modalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitEnquiry(modalForm, modalSubmitBtn, closeEnquiryModal);
  });
}
