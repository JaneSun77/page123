// =====================
// Environment Config
// =====================
// In a pure static site, env vars must be injected at build time or
// configured here directly. See .env.example for reference.
const CONFIG = {
  siteName: 'page123',
  // Replace with your actual API endpoint if needed
  contactEndpoint: window.ENV_CONTACT_ENDPOINT || null,
};

// =====================
// DOM Ready
// =====================
document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
  initContactForm();
  initNavHighlight();
});

// =====================
// Year
// =====================
function setCurrentYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// =====================
// Contact Form
// =====================
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showFeedback(feedback, '请填写所有必填字段。', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFeedback(feedback, '请输入有效的邮箱地址。', 'error');
      return;
    }

    if (CONFIG.contactEndpoint) {
      await submitToEndpoint(CONFIG.contactEndpoint, { name, email, message }, form, feedback);
    } else {
      // No endpoint configured — simulate success for demonstration
      showFeedback(feedback, '感谢你的留言！我们会尽快与你联系。', 'success');
      form.reset();
    }
  });
}

async function submitToEndpoint(endpoint, data, form, feedback) {
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = '发送中...';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    showFeedback(feedback, '感谢你的留言！我们会尽快与你联系。', 'success');
    form.reset();
  } catch {
    showFeedback(feedback, '发送失败，请稍后再试。', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '发送';
  }
}

function showFeedback(el, message, type) {
  el.textContent = message;
  el.className = `form-feedback form-feedback--${type}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =====================
// Nav Active Highlight
// =====================
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}
