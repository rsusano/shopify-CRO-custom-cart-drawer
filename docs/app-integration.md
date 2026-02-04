# App & theme integration

The Cart Drawer is **app-friendly** and **theme-agnostic**. It does not depend on a specific theme or app. Any script (theme or app) that adds to cart can open and refresh this drawer by dispatching standard events.

## Events the drawer listens for

| Event | When to use | Effect |
|-------|-------------|--------|
| **`cart-drawer:open`** | After adding to cart (theme or app) | Opens the drawer and refreshes content (fetches section HTML). |
| **`cart:update`** | When cart has been updated and you have section HTML | Replaces drawer content with `detail.sections[sectionId]` if provided; otherwise fetches section. |
| **`cart-drawer:loaded`** | Fired by the drawer when refresh is done | Use to update cart icon count or remove loading state. |
| **`bundle:cart-added`** | From [Bundle Offers Widget v2](https://github.com/rsusano/shopify-bundle-offers-widget-v2) (or any bundle widget that uses this event) | Opens the drawer and refreshes from `detail.sections` if present. |

## How to integrate from your theme

After your theme adds to cart via fetch (e.g. product form, quick add):

```javascript
// 1. Add items to cart (your existing fetch to /cart/add.js)
// 2. Then open the drawer (and optionally pass section HTML)
fetch('/cart/add.js', { method: 'POST', ... })
  .then(function () {
    document.dispatchEvent(new CustomEvent('cart-drawer:open'));
  });
```

If you use the Section Rendering API and want to pass section HTML (faster, no extra request):

```javascript
var sectionId = 'cart-drawer'; // or your section's ID, e.g. from data-section-id
fetch(window.location.pathname + '?section_id=' + sectionId)
  .then(function (r) { return r.text(); })
  .then(function (html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    var section = doc.getElementById('shopify-section-' + sectionId);
    if (!section) return;
    var sections = {};
    sections[sectionId] = section.outerHTML;
    document.dispatchEvent(new CustomEvent('cart:update', { detail: { sections: sections } }));
    document.dispatchEvent(new CustomEvent('cart-drawer:open'));
  });
```

## How to integrate from an app (Kaching, Recharge, etc.)

Apps that add to cart via the Storefront API or fetch do not automatically open the theme’s drawer. You have two options. **Option A (easiest for client stores):** Add optional **cart-drawer-app-bridge.js** to the theme layout (see [Installation](installation.md) step 5). It opens the drawer after any fetch to /cart/add, so any bundle or subscription app that uses fetch works with no per-app code. **Option B:** Have the app or a script dispatch the event:

1. **After the app adds to cart**, have the app (or a script the app injects) dispatch one of the events above.
2. **Recommended:** Dispatch **`cart-drawer:open`** so the drawer opens and refreshes by fetching the section. No section ID is required; the drawer uses its own `data-section-id`.
3. **Optional:** If the app can request section HTML (e.g. via Section Rendering API), it can dispatch **`cart:update`** with `detail.sections = { sectionId: html }` and then **`cart-drawer:open`** so the drawer uses that HTML and avoids an extra request.

### Example (injected script or app script)

```javascript
// After app adds to cart (e.g. bundle widget, subscription widget)
document.dispatchEvent(new CustomEvent('cart-drawer:open'));
```

If your app uses the same event as the Bundle Offers Widget v2:

```javascript
// Bundle widget v2 already dispatches bundle:cart-added with { cart, itemCount, sections }
// This drawer listens for it and will open and refresh from sections if present.
// No extra code needed if the bundle widget is installed.
```

### Finding the section ID

The drawer section’s ID is in the section wrapper: `data-section-id="{{ section.id }}"`. In the DOM it appears as `data-section-id` on the element with `data-cart-drawer-standalone`. Apps that need to request section HTML should read this attribute or use the section ID from the theme (e.g. `cart-drawer` if the section file is `cart-drawer.liquid`; Shopify may also use a numeric ID).

## Summary

- **Theme:** After add-to-cart, dispatch `cart-drawer:open` (and optionally `cart:update` with section HTML). Or use the optional app bridge script for automatic open.
- **Any app (Kaching, Recharge, custom bundle, etc.):** Use the optional **cart-drawer-app-bridge.js** for one-click compatibility (no app changes), or have the app dispatch `cart-drawer:open` after add-to-cart. Optionally pass section HTML via `cart:update` or `bundle:cart-added` for a faster update.
