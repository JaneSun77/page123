// =====================
// Config
// =====================
const CONFIG = {
  contactEndpoint: window.ENV_CONTACT_ENDPOINT || null,
};

// =====================
// i18n
// =====================
const I18N = {
  feedback: {
    zh: {
      success:      '// 信号传输成功。我们会尽快回复。',
      error:        '// 传输失败，请稍后重试。',
      emptyFields:  '// 错误：请填写所有必填字段。',
      invalidEmail: '// 错误：通信地址格式无效。',
      sending:      '传输中...',
      send:         '发送信号',
    },
    en: {
      success:      '// SIGNAL TRANSMITTED. We will respond shortly.',
      error:        '// TRANSMISSION FAILED. Please retry.',
      emptyFields:  '// ERROR: All fields are required.',
      invalidEmail: '// ERROR: Invalid signal address.',
      sending:      'Transmitting...',
      send:         'Transmit',
    },
  },
};

let currentLang = localStorage.getItem('lang') || 'zh';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  // Update html lang attribute
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

  // Swap all [data-zh] / [data-en] text nodes
  document.querySelectorAll('[data-zh]').forEach((el) => {
    el.textContent = lang === 'zh' ? el.dataset.zh : el.dataset.en;
  });

  // Swap placeholders
  document.querySelectorAll('[data-zh-placeholder]').forEach((el) => {
    el.placeholder =
      lang === 'zh' ? el.dataset.zhPlaceholder : el.dataset.enPlaceholder;
  });

  // Update toggle button label (shows the OTHER language)
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中文';

  // Update submit button text to match current lang
  const submitBtn = document.querySelector('#contactForm button[type="submit"] span[data-zh]');
  // Already handled by the data-zh sweep above
}

function initLangToggle() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    applyLang(currentLang === 'zh' ? 'en' : 'zh');
  });
  // Apply stored preference on load
  applyLang(currentLang);
}

// =====================
// DOM Ready
// =====================
document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
  initLangToggle();
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
  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();
    const t       = I18N.feedback[currentLang];

    if (!name || !email || !message) {
      showFeedback(feedback, t.emptyFields, 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFeedback(feedback, t.invalidEmail, 'error');
      return;
    }

    if (CONFIG.contactEndpoint) {
      await submitToEndpoint(
        CONFIG.contactEndpoint,
        { name, email, message },
        form,
        feedback
      );
    } else {
      showFeedback(feedback, t.success, 'success');
      form.reset();
    }
  });
}

async function submitToEndpoint(endpoint, data, form, feedback) {
  const submitBtn  = form.querySelector('button[type="submit"]');
  const submitSpan = submitBtn.querySelector('span[data-zh]');
  const t          = I18N.feedback[currentLang];

  submitBtn.disabled = true;
  if (submitSpan) submitSpan.textContent = t.sending;

  try {
    const res = await fetch(endpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    showFeedback(feedback, t.success, 'success');
    form.reset();
  } catch {
    showFeedback(feedback, t.error, 'error');
  } finally {
    submitBtn.disabled = false;
    // Restore button label to match current language
    if (submitSpan) {
      submitSpan.textContent =
        currentLang === 'zh' ? submitSpan.dataset.zh : submitSpan.dataset.en;
    }
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
// Nav Highlight
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

  sections.forEach((s) => observer.observe(s));
}
