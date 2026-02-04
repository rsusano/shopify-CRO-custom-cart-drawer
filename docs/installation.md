# Installation

Install the standalone Cart Drawer on any Shopify theme (Online Store 2.0).

## 1. Copy files

Copy into your theme root:

| From this repo | To your theme |
|----------------|----------------|
| `sections/cart-drawer.liquid` | `sections/` |
| `assets/cart-drawer-standalone.js` | `assets/` |
| `assets/section-cart-drawer.css` | `assets/` |
| `snippets/cart-drawer-items.liquid` | `snippets/` |
| `snippets/cart-drawer-summary.liquid` | `snippets/` |

## 2. Include the section in layout

In your theme layout (e.g. `layout/theme.liquid`), add the cart drawer section before `</body>`:

```liquid
{% section 'cart-drawer' %}
</body>
```

## 3. Add a cart opener (header / icon)

Add a button or link that opens the drawer. The drawer listens for the **`cart-drawer:open`** event:

```html
<button type="button" aria-label="Open cart" onclick="document.dispatchEvent(new CustomEvent('cart-drawer:open'))">
  Cart ({{ cart.item_count }})
</button>
```

Or use JavaScript:

```javascript
document.querySelector('#your-cart-icon').addEventListener('click', function () {
  document.dispatchEvent(new CustomEvent('cart-drawer:open'));
});
```

Optional: to open programmatically you can use the global helper (after the script loads):

```javascript
if (window.CartDrawerStandalone) window.CartDrawerStandalone.open();
```

## 4. Optional: Cart icon that shows item count

Update the cart icon’s label or text with the current item count when the cart changes. Listen for `cart-drawer:loaded` or `cart:update` and fetch `/cart.js` to get `item_count`, then update your header.

## 5. Compatibility with add-to-cart (theme or apps)

- **Theme add-to-cart:** After your theme adds to cart via AJAX, dispatch `cart-drawer:open` (and optionally `cart:update` with section HTML) so the drawer opens and shows the updated cart. See [App integration](app-integration.md).
- **Bundle / subscription apps (e.g. Kaching, Recharge):** Have the app (or a small script) dispatch `cart-drawer:open` or `bundle:cart-added` after adding to cart so this drawer opens and refreshes. See [App integration](app-integration.md).

No extra step is required for the drawer to work when the customer clicks your cart icon; compatibility with apps is achieved by having them fire the same events.
