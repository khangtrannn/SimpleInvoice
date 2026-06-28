# SimpleInvoice — Frontend

React + TypeScript + Vite frontend for the SimpleInvoice application.

## Value-Added Features

### Print Invoice

The Invoice Detail page includes a **Print Invoice** button that produces a clean, print-ready A4 document directly from the browser — no PDF export library, no server round-trip.

**How it works:**

- The detail page renders two parallel subtrees side by side in the DOM at all times:
  - `invoice-detail-screen` — the normal on-screen card layout.
  - `InvoicePrintDocument` (`invoice-print-root`) — a hidden print-only document, `display: none` by default.
- Clicking **Print Invoice** calls `window.print()`. A `@media print` block in `index.css` then swaps visibility: the app shell header and the on-screen detail view are hidden (`display: none !important`) and the print document becomes the only content on the page.
- The print stylesheet sets `@page { size: A4; margin: 0 }` and uses `print-color-adjust: exact` so status badge background colors are preserved by the printer driver. All spacing inside the document uses mm units for layout precision that is independent of screen DPI.
- `break-inside: avoid` / `page-break-inside: avoid` is applied to the items table, totals block, and status panel so multi-page invoices do not split those sections across a page boundary.

**Print document layout:**

| Section | Content |
|---------|---------|
| Header | SimpleInvoice logo (left) · Invoice number (right) |
| Parties | Billed By (SimpleInvoice) · Billed To (customer name, address, email, mobile) |
| Metadata | Invoice date · Due date · Currency · Reference · Description |
| Line items | Table of items with quantity, rate, and line total |
| Totals | Subtotal · Tax · Discount · Total invoice amount |
| Payment Status | Status pill (color-coded) · Due date · Balance / payment summary |

**Status-aware color coding on the printed page:**

| Status | Badge color |
|--------|-------------|
| Draft | Slate |
| Pending | Amber |
| Paid | Green |
| Overdue | Red |

This matches the on-screen `InvoiceStatusBadge` colors so the printed document is visually consistent with what the user sees in the browser.

---

## Design Decisions

### Invoice Summary Tiles — Currency Display

The summary tiles on the invoice list page (Total Revenue, Paid, Pending, Overdue, Draft) display amounts as **plain numbers without a currency symbol** (e.g. `94,737.54`).

**Why:** The invoice list supports a status filter, and the summary tiles respond to that filter. When filtered to a single status (e.g. "Paid"), all tile amounts are computed from only the matching invoices. This means the currency detected from that filtered set may differ from what you would see under a different filter — showing `£` for Paid, `AU$` for Draft, and no symbol for mixed-currency Pending invoices. Dynamically switching the currency symbol based on whichever status happens to be selected is confusing and inconsistent.

Since the application already supports invoices in multiple currencies, displaying a currency symbol on aggregate tiles would be misleading regardless. Plain numbers make it clear that the tile values are sums that may span multiple currencies, and avoids the symbol flickering as the user switches status tabs.
