/**
 * Cart Drawer Standalone – theme- and app-agnostic
 * Listens for cart-drawer:open, cart:update, bundle:cart-added. Refreshes via Section Rendering API.
 * No @theme dependencies. Works with any theme and any app (Kaching, Recharge, etc.).
 */
(function () {
  'use strict';

  const SECTION_PREFIX = 'shopify-section-';

  function normalizeSectionId(id) {
    return (id || '').replace(new RegExp('^' + SECTION_PREFIX), '');
  }

  function buildSectionSelector(id) {
    return SECTION_PREFIX + normalizeSectionId(id);
  }

  /**
   * Fetch section HTML and return the section element's inner HTML (for replacing drawer content).
   */
  async function getSectionHTML(sectionId) {
    const url = new URL(window.location.href);
    url.searchParams.set('section_id', normalizeSectionId(sectionId));
    const res = await fetch(url.toString());
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const sectionEl = doc.getElementById(buildSectionSelector(sectionId));
    return sectionEl ? sectionEl.outerHTML : '';
  }

  /**
   * Replace drawer content with new HTML (from section render or event detail).
   */
  function replaceDrawerContent(drawer, sectionId, html) {
    const target = drawer.querySelector('[data-cart-drawer-replace]');
    if (!target || !html) return;
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const newSection = parsed.getElementById(buildSectionSelector(sectionId));
    if (!newSection) return;
    const inner = newSection.querySelector('[data-cart-drawer-replace]');
    if (inner) {
      target.innerHTML = inner.innerHTML;
    } else {
      target.innerHTML = newSection.innerHTML;
    }
  }

  /**
   * Open drawer and optionally refresh content.
   */
  async function openAndRefresh(drawer, sectionId, sectionsFromEvent) {
    const dialog = drawer.querySelector('dialog');
    if (!dialog) return;
    if (!dialog.open) {
      const scrollY = window.scrollY;
      document.body.style.setProperty('position', 'fixed');
      document.body.style.setProperty('top', `-${scrollY}px`);
      document.body.style.setProperty('width', '100%');
      dialog.showModal();
    }
    drawer.classList.remove('cart-drawer--empty');
    const html = sectionsFromEvent && sectionsFromEvent[sectionId]
      ? sectionsFromEvent[sectionId]
      : await getSectionHTML(sectionId).catch(() => '');
    if (html) replaceDrawerContent(drawer, sectionId, html);
    document.dispatchEvent(new CustomEvent('cart-drawer:loaded'));
  }

  function closeDrawer(drawer) {
    const dialog = drawer.querySelector('dialog');
    if (!dialog || !dialog.open) return;
    dialog.close();
    const scrollY = document.body.style.top ? Math.abs(parseInt(document.body.style.top, 10)) || 0 : 0;
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, scrollY);
  }

  function init() {
    const drawer = document.querySelector('[data-cart-drawer-standalone]');
    if (!drawer) return;

    const sectionId = drawer.getAttribute('data-section-id');
    if (!sectionId) return;

    const dialog = drawer.querySelector('dialog');
    if (!dialog) return;

    const closeBtn = drawer.querySelector('[data-cart-drawer-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () { closeDrawer(drawer); });
    }

    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) closeDrawer(drawer);
    });
    dialog.addEventListener('cancel', function () { closeDrawer(drawer); });

    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer(drawer);
    });

    document.addEventListener('cart-drawer:open', function (e) {
      openAndRefresh(drawer, sectionId, e.detail && e.detail.sections ? e.detail.sections : null);
    });

    document.addEventListener('cart:update', function (e) {
      const sections = e.detail && e.detail.sections;
      if (sections && sections[sectionId]) {
        replaceDrawerContent(drawer, sectionId, sections[sectionId]);
      } else {
        getSectionHTML(sectionId).then(function (html) {
          if (html) replaceDrawerContent(drawer, sectionId, html);
        });
      }
      document.dispatchEvent(new CustomEvent('cart-drawer:loaded'));
    });

    document.addEventListener('bundle:cart-added', function (e) {
      const sections = e.detail && e.detail.sections;
      openAndRefresh(drawer, sectionId, sections || null);
    });

    window.CartDrawerStandalone = { open: function () { openAndRefresh(drawer, sectionId, null); }, close: function () { closeDrawer(drawer); } };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
