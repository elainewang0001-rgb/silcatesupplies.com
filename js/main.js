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

// Contact form
const HUBSPOT_PORTAL_ID = '246608904';
const HUBSPOT_FORM_GUID = '92ca0967-c6f3-461b-995f-57c24f5bf623';

const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const success = document.getElementById('formSuccess');
    const error = document.getElementById('formError');
    const submitBtn = form.querySelector('.form-submit');
    if (error) error.style.display = 'none';
    if (submitBtn) submitBtn.disabled = true;

    const getCookie = name => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : undefined;
    };

    const payload = {
      submittedAt: Date.now().toString(),
      fields: [
        { name: 'firstname', value: document.getElementById('fname').value },
        { name: 'lastname',  value: document.getElementById('lname').value },
        { name: 'email',     value: document.getElementById('email').value },
        { name: 'company',   value: document.getElementById('company').value },
        { name: 'phone',     value: document.getElementById('phone').value },
        { name: 'message',   value: `Product of Interest: ${document.getElementById('product').value}\n\n${document.getElementById('message').value}` },
      ],
      context: {
        pageUri: window.location.href,
        pageName: document.title,
      },
    };

    const hutk = getCookie('hubspotutk');
    if (hutk) payload.context.hutk = hutk;

    try {
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error('Submission failed');

      if (success) {
        success.style.display = 'block';
        form.reset();
        setTimeout(() => { success.style.display = 'none'; }, 5000);
      }
    } catch (err) {
      if (error) error.style.display = 'block';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
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
