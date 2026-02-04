# Getting Started – Cart Drawer (Standalone)

Quick path to a working cart drawer on any Shopify theme, with any app (bundle, subscription, etc.).

## 1. Copy files into your theme

| From this repo | To your theme |
|----------------|----------------|
| `sections/cart-drawer.liquid` | `sections/` |
| `assets/cart-drawer-standalone.js` | `assets/` |
| `assets/section-cart-drawer.css` | `assets/` |
| `snippets/cart-drawer-items.liquid` | `snippets/` |
| `snippets/cart-drawer-summary.liquid` | `snippets/` |
| `assets/cart-drawer-app-bridge.js` | `assets/` (optional – for auto-open with any app) |

## 2. Add the section to your layout

In **layout/theme.liquid** (or your main layout), before `</body>`:

```liquid
{% section 'cart-drawer' %}
</body>
```

## 3. Add a cart opener (icon / button)

Your header (or wherever you show the cart) needs to open the drawer. Use a button that dispatches the event:

```html
<button type="button" onclick="document.dispatchEvent(new CustomEvent('cart-drawer:open'))">
  Cart ({{ cart.item_count }})
</button>
```

Or call the global helper after the script has loaded:

```javascript
document.querySelector('#cart-icon').addEventListener('click', function () {
  if (window.CartDrawerStandalone) window.CartDrawerStandalone.open();
});
```

## 4. Optional: Auto-open with any bundle or subscription app

For stores that use a **bundle app** (e.g. Kaching) or **subscription app** (e.g. Recharge): add **cart-drawer-app-bridge.js** to your layout (after the cart drawer section). The drawer will then open automatically after any add-to-cart from the theme or app – no per-app code needed. See [Installation](docs/installation.md) step 5 and [App integration](docs/app-integration.md).

## Next steps

- [Full installation guide](docs/installation.md)
- [App & theme integration](docs/app-integration.md)
- [README](README.md) – features, architecture, compatibility
