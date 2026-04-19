/* ============================================
   THEME MANAGEMENT - Centralized Theme System
   ============================================ */

const Theme = (() => {
  const STORAGE_KEY = 'theme-preference';
  const LIGHT_THEME = 'light';
  const DARK_THEME = 'dark';

  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === LIGHT_THEME) {
      html.setAttribute('data-theme', LIGHT_THEME);
    } else {
      html.removeAttribute('data-theme');
    }
    updateCheckbox(theme);
  }

  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY) || null;
  }

  function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function getCurrentTheme() {
    const html = document.documentElement;
    return html.getAttribute('data-theme') || DARK_THEME;
  }

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? LIGHT_THEME : DARK_THEME;
  }

  function init() {
    const stored = getStoredTheme();
    let themeToApply;

    if (stored !== null) {
      themeToApply = stored;
    } else {
      themeToApply = getSystemPreference();
    }

    applyTheme(themeToApply);
  }

  function toggle() {
    const current = getCurrentTheme();
    const next = current === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    applyTheme(next);
    saveTheme(next);
  }

  function updateCheckbox(theme) {
    const checkbox = document.getElementById('theme-toggle-checkbox');
    if (checkbox) {
      checkbox.checked = (theme === LIGHT_THEME);
    }
  }

  // Expose public API
  return {
    init,
    toggle,
    get current() {
      return getCurrentTheme();
    },
    get stored() {
      return getStoredTheme();
    }
  };
})();

// Initialize theme on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Theme.init());
} else {
  Theme.init();
}

// Make toggleTheme globally available for HTML onclick handlers
function toggleTheme() {
  Theme.toggle();
}

// Make initTheme globally available for backwards compatibility
function initTheme() {
  Theme.init();
}
