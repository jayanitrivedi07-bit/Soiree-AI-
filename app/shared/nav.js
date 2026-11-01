/**
 * nav.js — Soiree AI shared navigation
 * Handles: active link highlighting, mobile hamburger menu, page routing constants.
 */

const PAGES = {
  landing:     '../../index.html',
  createEvent: '../pages/create-event.html',
  dashboard:   '../pages/dashboard.html',
  budget:      '../pages/budget.html',
  timeline:    '../pages/timeline.html',
  vendors:     '../pages/vendors.html',
  aiAssistant: '../pages/ai-assistant.html',
  artisan:     '../pages/artisan.html',
};

/**
 * Inject the mobile hamburger button into every header that has the shared nav.
 * The header must have id="main-header" or class="site-header".
 * Called automatically on DOMContentLoaded.
 */
function initNav() {
  // Mark active link based on current page filename
  const currentFile = window.location.pathname.split('/').pop();
  document.querySelectorAll('[data-nav-page]').forEach(link => {
    if (link.getAttribute('data-nav-page') === currentFile) {
      link.classList.add('bg-surface-container-high', 'text-primary', 'font-semibold');
      link.classList.remove('text-on-surface-variant');
    }
  });

  // Mobile hamburger toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !isOpen);
      mobileMenu.classList.toggle('flex', isOpen);
      const icon = menuBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = isOpen ? 'close' : 'menu';
    });
    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        const icon = menuBtn.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
      });
    });
  }
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNav);
} else {
  initNav();
}

window.SoireeNav = { PAGES, initNav };
