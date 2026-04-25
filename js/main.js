

'use strict';

// --- Announce hover quotes to screen readers on card focus ---
function setupCardAccessibility() {
  const cards = document.querySelectorAll('.card-link');

  cards.forEach(card => {
    const quoteEl = card.querySelector('.hover-quote');
    if (!quoteEl) return;

    const quoteText = quoteEl.textContent.trim();

    // Add live region to card for screen readers
    const liveRegion = document.createElement('span');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap';
    card.appendChild(liveRegion);

    card.addEventListener('focus', () => {
      liveRegion.textContent = quoteText;
    });

    card.addEventListener('blur', () => {
      liveRegion.textContent = '';
    });
  });
}

// --- Intersection Observer: animate cards on scroll if JS runs after paint ---
function setupScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.flower-card');
  if (!cards.length) return;

  // Cards are already animated via CSS delay on load;
  // this handles cases where cards are below the fold
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
}

// --- Keyboard navigation: Enter/Space on card links ---
function setupKeyboardNav() {
  const cards = document.querySelectorAll('.card-link');
  cards.forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  injectSkipLink();
  setupCardAccessibility();
  setupScrollAnimations();
  setupKeyboardNav();
});
