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

// Product buttons — pre-fill message field
document.querySelectorAll('[data-product]').forEach(btn => {
  btn.addEventListener('click', function() {
    const product = this.dataset.product;
    const isSample = this.dataset.sample === 'true';
    const msg = isSample
      ? 'Sample request for: ' + product
      : 'Inquiry about: ' + product;
    const textarea = document.getElementById('message');
    if (textarea) {
      textarea.value = msg;
      textarea.focus();
    }
  });
});

// Contact form — submit to HubSpot API
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const success = document.getElementById('formSuccess');
    const error   = document.getElementById('formError');
    const btn     = form.querySelector('.form-submit');
    if (error)   error.style.display   = 'none';
    if (success) success.style.display = 'none';
    if (btn)     btn.disabled          = true;

    const getCookie = name => {
      const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return m ? m[2] : undefined;
    };

    const payload = {
      fields: [
        { name: 'firstname', value: document.getElementById('fname').value },
        { name: 'lastname',  value: document.getElementById('lname').value },
        { name: 'email',     value: document.getElementById('email').value },
        { name: 'company',   value: document.getElementById('company').value },
        { name: 'phone',     value: document.getElementById('phone').value },
        { name: 'message',   value: document.getElementById('message').value },
      ],
      context: { pageUri: window.location.href, pageName: document.title }
    };
    const hutk = getCookie('hubspotutk');
    if (hutk) payload.context.hutk = hutk;

    try {
      const res = await fetch(
        'https://api.hsforms.com/submissions/v3/integration/submit/246608904/92ca0967-c6f3-461b-995f-57c24f5bf623',
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );
      if (!res.ok) throw new Error();
      if (success) { success.style.display = 'block'; form.reset(); }
    } catch {
      if (error) error.style.display = 'block';
    } finally {
      if (btn) btn.disabled = false;
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
