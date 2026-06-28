# SimpleInvoice — Frontend

React + TypeScript + Vite frontend for the SimpleInvoice application.

## Design Decisions

### Invoice Summary Tiles — Currency Display

The summary tiles on the invoice list page (Total Revenue, Paid, Pending, Overdue, Draft) display amounts as **plain numbers without a currency symbol** (e.g. `94,737.54`).

**Why:** The invoice list supports a status filter, and the summary tiles respond to that filter. When filtered to a single status (e.g. "Paid"), all tile amounts are computed from only the matching invoices. This means the currency detected from that filtered set may differ from what you would see under a different filter — showing `£` for Paid, `AU$` for Draft, and no symbol for mixed-currency Pending invoices. Dynamically switching the currency symbol based on whichever status happens to be selected is confusing and inconsistent.

Since the application already supports invoices in multiple currencies, displaying a currency symbol on aggregate tiles would be misleading regardless. Plain numbers make it clear that the tile values are sums that may span multiple currencies, and avoids the symbol flickering as the user switches status tabs.
