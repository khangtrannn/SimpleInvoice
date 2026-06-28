import { http, HttpResponse } from 'msw';

import { API_BASE_URL } from '@/test/mocks/constants';
import {
  mockInvoiceDetails,
  mockInvoices,
} from '@/test/mocks/invoice-fixtures';
import {
  buildInvoiceListResponse,
  parseInvoiceRequestUrl,
} from '@/test/mocks/invoice-query';

export const invoiceHandlers = [
  http.get(`${API_BASE_URL}/invoices/:invoiceId`, ({ params }) => {
    const invoiceId = String(params.invoiceId);
    const invoice = mockInvoiceDetails[invoiceId];

    if (!invoice) {
      return HttpResponse.json(
        {
          statusCode: 404,
          message: 'Invoice not found',
          error: 'Not Found',
          timestamp: '2026-06-27T10:00:00.000Z',
          path: `/invoices/${invoiceId}`,
        },
        { status: 404 },
      );
    }

    return HttpResponse.json(invoice, { status: 200 });
  }),

  http.get(`${API_BASE_URL}/invoices`, ({ request }) => {
    const query = parseInvoiceRequestUrl(new URL(request.url));
    const response = buildInvoiceListResponse(mockInvoices, query);

    return HttpResponse.json(response, { status: 200 });
  }),
];
