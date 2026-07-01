import { InvoiceEntity } from '../entities/invoice.entity';

export function renderInvoicePdfHtml(invoice: InvoiceEntity): string {
  const invoiceNumber = escapeHtml(invoice.invoiceNumber);
  const customerName = escapeHtml(invoice.customerFullname);
  const customerEmail = escapeHtml(invoice.customerEmail);
  const customerAddress = escapeHtml(invoice.customerAddress ?? 'Customer address');
  const customerMobile = escapeHtml(invoice.customerMobileNumber ?? '');
  const currency = escapeHtml(invoice.currency);

  const subtotal = formatMoney(invoice.invoiceSubTotal, invoice.currency);
  const taxAmount = formatMoney(invoice.totalTax, invoice.currency);
  const discountAmount = formatMoney(invoice.totalDiscount, invoice.currency);
  const totalAmount = formatMoney(invoice.totalAmount, invoice.currency);
  const balanceAmount =
    invoice.status === 'Draft'
      ? 'Not issued'
      : formatMoney(invoice.balanceAmount, invoice.currency);

  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @page {
      size: A4;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      font-family: Inter, Arial, sans-serif;
      color: #172033;
      background: #e8eff8;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 8mm;
      background: #e8eff8;
    }

    .invoice-card {
      background: #ffffff;
      border-radius: 18px;
      padding: 10mm;
      min-height: calc(297mm - 16mm);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 18mm;
      border-bottom: 1px solid #d8e0ec;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 30px;
      font-weight: 800;
      letter-spacing: -1px;
    }

    .brand-blue {
      color: #2563eb;
    }

    .logo-box {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: #2563eb;
      color: white;
      display: grid;
      place-items: center;
      font-weight: 800;
      font-size: 20px;
    }

    .invoice-number {
      text-align: right;
      color: #60718d;
      font-size: 18px;
      font-weight: 500;
    }

    .invoice-number-pill {
      display: inline-block;
      margin-top: 12px;
      padding: 10px 18px;
      border-radius: 999px;
      background: #eef2f7;
      color: #26364d;
      font-size: 19px;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .section {
      padding: 9mm 0;
      border-bottom: 1px solid #d8e0ec;
    }

    .two-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18mm;
    }

    .three-cols {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12mm;
    }

    .label {
      color: #60718d;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .value {
      font-size: 15px;
      font-weight: 700;
      color: #111827;
      line-height: 1.4;
    }

    .muted {
      color: #53647f;
      font-size: 15px;
      line-height: 1.5;
      margin-top: 12px;
    }

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-top: 9mm;
      border: 1px solid #dbe3ee;
      border-radius: 14px;
      overflow: hidden;
    }

    th {
      background: #f7f9fc;
      color: #60718d;
      font-size: 14px;
      text-align: left;
      padding: 14px 18px;
      border-bottom: 1px solid #dbe3ee;
    }

    td {
      padding: 18px;
      font-size: 15px;
      color: #111827;
    }

    .right {
      text-align: right;
    }

    .totals {
      width: 55%;
      margin-left: auto;
      margin-top: 8mm;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      font-size: 16px;
      color: #26364d;
    }

    .grand-total {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-top: 8mm;
      font-weight: 800;
      font-size: 18px;
    }

    .grand-total .amount {
      color: #2563eb;
      font-size: 28px;
      letter-spacing: -0.5px;
    }

    .payment-panel {
      margin-top: 9mm;
      border: 1px solid #dbe3ee;
      border-radius: 16px;
      padding: 7mm;
      background: #fbfcff;
    }

    .payment-title {
      font-size: 17px;
      font-weight: 800;
      margin-bottom: 7mm;
    }

    .payment-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
    }

    .metric {
      padding-right: 8mm;
      border-right: 1px solid #d8e0ec;
    }

    .metric:last-child {
      border-right: 0;
      padding-left: 8mm;
    }

    .metric:nth-child(2) {
      padding-left: 8mm;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 999px;
      background: #eef2f7;
      color: #53647f;
      font-weight: 800;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: #60718d;
    }
  </style>
</head>
<body>
  <main class="page">
    <section class="invoice-card">
      <header class="header">
        <div class="brand">
          <div class="logo-box">S</div>
          <div><span class="brand-blue">Simple</span>Invoice</div>
        </div>

        <div class="invoice-number">
          <div>Invoice Number</div>
          <div class="invoice-number-pill">${invoiceNumber}</div>
        </div>
      </header>

      <section class="section two-cols">
        <div>
          <div class="label">Billed By:</div>
          <div class="value">101 Digital PTE LTD</div>
          <div class="muted">Full Stack Engineering Assessment</div>
          <div class="muted">Singapore</div>
        </div>

        <div>
          <div class="label">Billed To:</div>
          <div class="value">${customerName}</div>
          <div class="muted">${customerAddress}</div>
          <div class="muted">Email: ${customerEmail}</div>
          ${
            customerMobile
              ? `<div class="muted">Mobile: ${customerMobile}</div>`
              : ''
          }
        </div>
      </section>

      <section class="section three-cols">
        <div>
          <div class="label">Invoice Date</div>
          <div class="value">${formatDate(invoice.invoiceDate)}</div>
        </div>

        <div>
          <div class="label">Due Date</div>
          <div class="value">${formatDate(invoice.dueDate)}</div>
        </div>

        <div>
          <div class="label">Currency</div>
          <div class="value">${currency}</div>
        </div>

        <div>
          <div class="label">Reference</div>
          <div class="value">${escapeHtml(invoice.invoiceReference ?? '-')}</div>
        </div>

        <div>
          <div class="label">Description</div>
          <div class="value">${escapeHtml(invoice.description ?? '-')}</div>
        </div>
      </section>

      <table>
        <thead>
          <tr>
            <th style="width: 10%;">#</th>
            <th>Item Name</th>
            <th style="width: 12%;">Qty</th>
            <th style="width: 20%;">Rate</th>
            <th class="right" style="width: 22%;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><strong>${
              invoice.items && invoice.items.length > 0
                ? escapeHtml(invoice.items[0].name)
                : 'Item'
            }</strong></td>
            <td>${
              invoice.items && invoice.items.length > 0
                ? escapeHtml(String(invoice.items[0].quantity))
                : '0'
            }</td>
            <td>${
              invoice.items && invoice.items.length > 0
                ? formatMoney(invoice.items[0].rate, invoice.currency)
                : formatMoney('0', invoice.currency)
            }</td>
            <td class="right"><strong>${subtotal}</strong></td>
          </tr>
        </tbody>
      </table>

      <section class="totals">
        <div class="total-row">
          <span>Subtotal</span>
          <strong>${subtotal}</strong>
        </div>
        <div class="total-row">
          <span>Tax Amount (${escapeHtml(String(invoice.taxPercentage))}%)</span>
          <strong>${taxAmount}</strong>
        </div>
        <div class="total-row">
          <span>Discount Amount</span>
          <strong>-${discountAmount}</strong>
        </div>

        <div class="grand-total">
          <span>Total Amount (${currency})</span>
          <span class="amount">${totalAmount}</span>
        </div>
      </section>

      <section class="payment-panel">
        <div class="payment-title">Payment Status</div>

        <div class="payment-grid">
          <div class="metric">
            <div class="label">Status</div>
            <div class="status-pill">
              <span class="dot"></span>
              ${escapeHtml(invoice.status)}
            </div>
          </div>

          <div class="metric">
            <div class="label">Due Date</div>
            <div class="value">${formatDate(invoice.dueDate)}</div>
          </div>

          <div class="metric">
            <div class="label">Balance</div>
            <div class="value">${balanceAmount}</div>
          </div>
        </div>
      </section>
    </section>
  </main>
</body>
</html>
  `;
}

function formatDate(value: Date | string): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

function formatMoney(value: string | number, currency: string): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
