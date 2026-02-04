# Start Here – Cart Drawer (Standalone)

A **theme- and app-agnostic** cart drawer for Shopify. Works with **any theme** and **any app** (bundle widgets, subscription apps, custom add-to-cart).

## What you get

- **Slide-out cart drawer** – Opens from the side; shows line items, subtotal, and checkout button.
- **Event-driven** – Any theme or app can open and refresh the drawer by dispatching `cart-drawer:open` or `cart:update`.
- **App-friendly** – Compatible with Kaching, Recharge, and other apps; they only need to fire one event after adding to cart.

## Quick links

| I want to… | Go to |
|------------|--------|
| Install on a theme | [GETTING_STARTED.md](GETTING_STARTED.md) or [docs/installation.md](docs/installation.md) |
| Integrate from my theme or app | [docs/app-integration.md](docs/app-integration.md) |
| See features and architecture | [README.md](README.md) |

## Repo structure

```
shopify-CRO-custom-cart-drawer/
├── sections/     → Copy to your theme sections/
├── assets/       → Copy to your theme assets/
├── snippets/     → Copy to your theme snippets/
├── docs/         → Installation and app integration
├── README.md     → Overview, architecture diagram
├── GETTING_STARTED.md
├── START_HERE.md → This file
└── LICENSE
```

Copy the contents of `sections/`, `assets/`, and `snippets/` into your theme, add `{% section 'cart-drawer' %}` to your layout, and add a cart icon that dispatches `cart-drawer:open`. Done.
