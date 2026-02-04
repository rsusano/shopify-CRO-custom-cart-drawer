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
| `assets/cart-drawer-app-bridge.js` | `assets/` (optional – see step 5) |

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

## 5. Optional: Auto-open with any bundle or subscription app

For **client stores** that use a **bundle app** (e.g. Kaching) or **subscription app** (e.g. Recharge), you can make the drawer open automatically after any add-to-cart without changing the app:

1. Copy `assets/cart-drawer-app-bridge.js` into your theme `assets/`.
2. In your layout (e.g. `layout/theme.liquid`), load it **after** the cart drawer section:

```liquid
{% section 'cart-drawer' %}
<script src="{{ 'cart-drawer-app-bridge.js' | asset_url }}" defer></script>
</body>
```

The bridge listens for successful `fetch` requests to `/cart/add` or `/cart/add.js` (from your theme or from apps that use fetch to add to cart) and dispatches `cart-drawer:open`. The drawer then opens and refreshes with the updated cart.

- **Theme add-to-cart:** The bridge also works for your theme’s AJAX add-to-cart if it uses fetch.
- **Without the bridge:** You can still have the theme or app dispatch `cart-drawer:open` after add-to-cart. See [App integration](app-integration.md).

No extra step is required for the drawer to work when the customer clicks your cart icon.
