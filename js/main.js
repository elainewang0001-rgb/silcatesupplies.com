// Mobile nav toggle
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
  });
  navItems.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});

// Product button — store selected product and pre-fill form
let hsFormReady = false;
let hsFormEl = null;

function fillProductInForm(product, isSample) {
  if (!hsFormEl) return;
  const msg = isSample
    ? 'I would like to request a sample of: ' + product
    : 'I am inquiring about: ' + product;
  const textarea = hsFormEl.querySelector('textarea[name="message"]');
  if (textarea) {
    textarea.value = msg;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

document.querySelectorAll('[data-product]').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const product = this.dataset.product;
    const isSample = this.dataset.sample === 'true';
    sessionStorage.setItem('hsProduct', product);
    sessionStorage.setItem('hsSample', isSample);
    if (hsFormReady) fillProductInForm(product, isSample);
  });
});

// HubSpot form init
if (typeof hbspt !== 'undefined') {
  hbspt.forms.create({
    region: 'na2',
    portalId: '246608904',
    formId: '92ca0967-c6f3-461b-995f-57c24f5bf623',
    target: '#hubspotForm',
    onFormReady: function($form) {
      hsFormEl = document.querySelector('#hubspotForm form') || ($form && $form[0]);
      hsFormReady = true;
      const product = sessionStorage.getItem('hsProduct');
      const isSample = sessionStorage.getItem('hsSample') === 'true';
      if (product) {
        fillProductInForm(product, isSample);
        sessionStorage.removeItem('hsProduct');
        sessionStorage.removeItem('hsSample');
      }
    }
  });
} else {
  window.addEventListener('load', function() {
    if (typeof hbspt !== 'undefined') {
      hbspt.forms.create({
        region: 'na2',
        portalId: '246608904',
        formId: '92ca0967-c6f3-461b-995f-57c24f5bf623',
        target: '#hubspotForm',
        onFormReady: function($form) {
          hsFormEl = document.querySelector('#hubspotForm form') || ($form && $form[0]);
          hsFormReady = true;
          const product = sessionStorage.getItem('hsProduct');
          const isSample = sessionStorage.getItem('hsSample') === 'true';
          if (product) {
            fillProductInForm(product, isSample);
            sessionStorage.removeItem('hsProduct');
            sessionStorage.removeItem('hsSample');
          }
        }
      });
    }
  });
}

// Animate elements on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.product-card, .feature-item, .contact-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
