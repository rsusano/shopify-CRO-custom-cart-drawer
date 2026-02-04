/**
 * Optional: Cart Drawer app bridge
 * Listens for successful add-to-cart (fetch to /cart/add.js or /cart/add) from any source
 * (theme, bundle app, subscription app) and dispatches cart-drawer:open so the drawer opens.
 * Include this once in your theme (e.g. layout) if you want the drawer to open automatically
 * after any add-to-cart, without modifying each app or theme script.
 */
(function () {
  'use strict';

  function isCartAddUrl(url) {
    if (!url || typeof url !== 'string') return false;
    try {
      var path = new URL(url, window.location.origin).pathname;
      return path === '/cart/add' || path === '/cart/add.js' || path.endsWith('/cart/add') || path.endsWith('/cart/add.js');
    } catch (e) {
      return false;
    }
  }

  function openDrawer() {
    document.dispatchEvent(new CustomEvent('cart-drawer:open'));
  }

  var originalFetch = window.fetch;
  if (typeof originalFetch !== 'function') return;

  window.fetch = function (url, options) {
    var args = arguments;
    return originalFetch.apply(this, args).then(function (response) {
      var method = (options && options.method) ? String(options.method).toUpperCase() : 'GET';
      if ((method === 'POST' || method === 'PUT') && isCartAddUrl(url) && response.ok) {
        response.clone().json().then(function (body) {
          if (body && (body.status === 200 || body.ok === true || body.item_count !== undefined)) {
            openDrawer();
          }
        }).catch(function () {
          openDrawer();
        });
      }
      return response;
    });
  };
})();
