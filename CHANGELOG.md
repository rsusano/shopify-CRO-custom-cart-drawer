# Changelog

## [1.0.0] – 2026-02

### Added

- Standalone cart drawer section (native `<dialog>`, no theme dialog/events dependency).
- Vanilla JS: open/close, listen for `cart-drawer:open`, `cart:update`, `bundle:cart-added`; refresh via Section Rendering API.
- Minimal snippets: cart line items, summary (subtotal + checkout button).
- App- and theme-friendly: any add-to-cart (theme or app) can open the drawer by dispatching one event.
- Documentation: Installation, App integration, README with Mermaid architecture flow.
