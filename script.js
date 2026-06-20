/* =========================================
   DECODEONE – JavaScript
   ========================================= */

'use strict';

// ── 1. DOM REFERENCES ──────────────────────
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('nav-links');
const backToTop   = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const footerYear  = document.getElementById('footer-year');

// ── 2. FOOTER YEAR ─────────────────────────
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

// ── 3. STICKY NAVBAR ────────────────────────
let lastScrollY = 0;

function handleNavbarScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run on load

// ── 4. ACTIVE NAV LINK ───────────────────────
const sections = document.querySelectorAll('section[id], footer[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  let currentSectionId = '';
  const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) + 20 || 90;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - offset;
    if (window.scrollY >= sectionTop) {
      currentSectionId = section.getAttribute('id');
    }
  });

  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

// ── 5. HAMBURGER MENU ────────────────────────
function toggleMenu() {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', toggleMenu);

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close menu on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// Close menu when clicking outside
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    closeMenu();
  }
});

// ── 6. BACK TO TOP ──────────────────────────
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── 7. COUNTER ANIMATION ────────────────────
function animateCounter(el, target, duration = 2000) {
  const startTime = performance.now();
  const suffix    = el.nextElementSibling?.classList.contains('stat-suffix')
                    ? el.nextElementSibling
                    : null;

  function step(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(eased * target);

    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(step);
}

// Trigger counters when hero stats enter viewport
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
let countersStarted = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      statNumbers.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
      });
    }
  });
}, { threshold: 0.4 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── 8. SCROLL REVEAL ANIMATIONS ─────────────
function addRevealClasses() {
  const targets = [
    { selector: '.program-card',     delayBase: 0 },
    { selector: '.tech-card',         delayBase: 0 },
    { selector: '.benefit-card',      delayBase: 0 },
    { selector: '.testimonial-card',  delayBase: 0 },
    { selector: '.about-feature',     delayBase: 0 },
    { selector: '.section-heading',   delayBase: 0 },
    { selector: '.section-tag',       delayBase: 0 },
    { selector: '.section-sub',       delayBase: 0 },
    { selector: '.about-grid',        delayBase: 0 },
    { selector: '.contact-grid',      delayBase: 0 },
    { selector: '.contact-form-wrap', delayBase: 0 },
  ];

  targets.forEach(({ selector, delayBase }) => {
    document.querySelectorAll(selector).forEach((el, idx) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        const delayIdx = idx % 4;
        if (delayIdx > 0) {
          el.classList.add(`reveal-delay-${delayIdx}`);
        }
      }
    });
  });
}

addRevealClasses();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ── 9. SMOOTH SCROLL for anchors ────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href    = this.getAttribute('href');
    const target  = document.querySelector(href);

    if (target && href !== '#') {
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')
      ) || 72;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

// ── 10. FORM VALIDATION & SUBMISSION ─────────
const fields = {
  name:    { el: document.getElementById('form-name'),    errorEl: document.getElementById('name-error') },
  email:   { el: document.getElementById('form-email'),   errorEl: document.getElementById('email-error') },
  phone:   { el: document.getElementById('form-phone'),   errorEl: document.getElementById('phone-error') },
  message: { el: document.getElementById('form-message'), errorEl: document.getElementById('message-error') },
};

const validators = {
  name(value) {
    if (!value.trim()) return 'Full name is required.';
    if (value.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  },
  email(value) {
    if (!value.trim()) return 'Email address is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
    return '';
  },
  phone(value) {
    if (!value.trim()) return 'Phone number is required.';
    const phoneRegex = /^[+\d\s\-().]{7,20}$/;
    if (!phoneRegex.test(value.trim())) return 'Please enter a valid phone number.';
    return '';
  },
  message(value) {
    if (!value.trim()) return 'Message is required.';
    if (value.trim().length < 10) return 'Message must be at least 10 characters.';
    return '';
  },
};

function validateField(fieldName) {
  const { el, errorEl } = fields[fieldName];
  const error = validators[fieldName](el.value);

  if (error) {
    errorEl.textContent = error;
    el.classList.add('error-field');
    return false;
  } else {
    errorEl.textContent = '';
    el.classList.remove('error-field');
    return true;
  }
}

// Real-time validation on blur
Object.keys(fields).forEach(name => {
  const { el } = fields[name];
  if (!el) return;

  el.addEventListener('blur', () => validateField(name));
  el.addEventListener('input', () => {
    if (el.classList.contains('error-field')) {
      validateField(name);
    }
  });
});

// Form submit
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const isValid = Object.keys(fields).every(name => validateField(name));
    if (!isValid) {
      // Focus first invalid field
      const firstError = contactForm.querySelector('.error-field');
      if (firstError) firstError.focus();
      return;
    }

    const submitBtn = document.getElementById('contact-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate async submission (replace with actual fetch/API call)
    await new Promise(resolve => setTimeout(resolve, 1500));

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;

    // Show success message
    formSuccess.hidden = false;
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Reset form
    contactForm.reset();
    Object.values(fields).forEach(({ el }) => el.classList.remove('error-field'));

    // Hide success after 6 seconds
    setTimeout(() => { formSuccess.hidden = true; }, 6000);
  });
}

// ── 11. TECH CARDS – keyboard accessibility ─
document.querySelectorAll('.tech-card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('focused');
    }
  });
});

// ── 12. CODE WINDOW TYPING EFFECT ──────────
(function typingEffect() {
  const cursor = document.querySelector('.code-cursor');
  if (!cursor) return;

  // Already animated via CSS blink, nothing extra needed
})();

// ── 13. NAVBAR LOGO CLICK SCROLL ───────────
document.querySelectorAll('.logo').forEach(logo => {
  logo.addEventListener('click', e => {
    if (logo.getAttribute('href') === '#hero') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

// ── 14. PREFERS REDUCED MOTION ──────────────
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition-fast', '0ms');
  document.documentElement.style.setProperty('--transition-base', '0ms');
  document.documentElement.style.setProperty('--transition-slow', '0ms');
}

// ── 15. INIT ON LOAD ────────────────────────
window.addEventListener('load', () => {
  updateActiveLink();
});
