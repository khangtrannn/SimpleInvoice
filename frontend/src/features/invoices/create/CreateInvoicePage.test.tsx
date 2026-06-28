import { HttpResponse, http } from 'msw';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router';
import type { RouteObject } from 'react-router';
import { describe, expect, it } from 'vitest';

import type { CreateInvoiceRequest, InvoiceDetail } from '@/api/types';
import { CreateInvoicePage } from '@/features/invoices/create/CreateInvoicePage';
import { API_BASE_URL, TEST_ACCESS_TOKEN } from '@/test/mocks/constants';
import { server } from '@/test/mocks/server';
import { renderWithRouter } from '@/test/test-utils';
import { setAccessToken } from '@/features/auth/auth-storage';

function LocationDisplay() {
  const location = useLocation();

  return <div data-testid="location-display">{location.pathname}</div>;
}

function renderCreateInvoicePage() {
  setAccessToken(TEST_ACCESS_TOKEN);

  const routes: RouteObject[] = [
    {
      path: '/invoices/new',
      element: (
        <>
          <CreateInvoicePage />
          <LocationDisplay />
        </>
      ),
    },
    {
      path: '/invoices',
      element: (
        <>
          <div>Invoice list page</div>
          <LocationDisplay />
        </>
      ),
    },
  ];

  return renderWithRouter({
    routes,
    initialEntries: ['/invoices/new'],
  });
}

describe('CreateInvoicePage', () => {
  it('shows validation errors for required customer and item fields', async () => {
    const user = userEvent.setup();
    renderCreateInvoicePage();

    await user.click(screen.getByRole('button', { name: /create invoice/i }));

    expect(await screen.findByText(/customer name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/customer email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/item name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/rate must be greater than 0/i)).toBeInTheDocument();
  });

  it('updates preview totals as item values change', async () => {
    const user = userEvent.setup();
    renderCreateInvoicePage();

    await user.type(screen.getByLabelText(/item name/i), 'Website Design');
    await user.clear(screen.getByLabelText(/rate \(aud\)/i));
    await user.type(screen.getByLabelText(/rate \(aud\)/i), '100');
    await user.clear(screen.getByLabelText(/discount \(aud\)/i));
    await user.type(screen.getByLabelText(/discount \(aud\)/i), '15');

    expect(screen.getAllByText('AU$100.00').length).toBeGreaterThan(0);
    expect(screen.getAllByText('AU$10.00').length).toBeGreaterThan(0);
    expect(screen.getAllByText('-AU$15.00').length).toBeGreaterThan(0);
    expect(screen.getAllByText('AU$95.00').length).toBeGreaterThan(0);
  });

  it('posts a valid invoice and redirects to the invoice list', async () => {
    const user = userEvent.setup();
    let capturedPayload: CreateInvoiceRequest | undefined;

    server.use(
      http.post(`${API_BASE_URL}/invoices`, async ({ request }) => {
        capturedPayload = (await request.json()) as CreateInvoiceRequest;

        const response: InvoiceDetail = {
          id: 'invoice-new',
          invoiceNumber: capturedPayload.invoiceNumber,
          invoiceReference: capturedPayload.invoiceReference ?? null,
          invoiceDate: capturedPayload.invoiceDate,
          dueDate: capturedPayload.dueDate,
          currency: capturedPayload.currency,
          currencySymbol: 'AU$',
          description: capturedPayload.description ?? null,
          status: 'Draft',
          customer: {
            fullname: capturedPayload.customerName,
            email: capturedPayload.customerEmail,
            mobileNumber: capturedPayload.customerMobile ?? null,
            address: capturedPayload.customerAddress ?? null,
          },
          items: [
            {
              id: 'invoice-new-item',
              name: capturedPayload.item.name,
              quantity: capturedPayload.item.quantity,
              rate: String(capturedPayload.item.rate),
            },
          ],
          invoiceSubTotal: '250.00',
          taxPercentage: '10.00',
          totalTax: '25.00',
          totalDiscount: '5.00',
          totalAmount: '270.00',
          totalPaid: '0.00',
          balanceAmount: '270.00',
          createdAt: '2026-06-28T00:00:00.000Z',
        };

        return HttpResponse.json(response, { status: 201 });
      }),
    );

    renderCreateInvoicePage();

    await user.type(screen.getByLabelText(/customer name/i), 'Acme Corp');
    await user.type(screen.getByLabelText(/customer email/i), 'billing@acme.test');
    await user.type(screen.getByLabelText(/customer mobile/i), '+61 400 123 456');
    await user.type(screen.getByLabelText(/customer address/i), '123 Market Street');
    await user.type(screen.getByLabelText(/invoice reference/i), 'PO-1234');
    await user.type(screen.getByLabelText(/description/i), 'Website services');
    await user.type(screen.getByLabelText(/item name/i), 'Website Design');
    await user.clear(screen.getByLabelText(/rate \(aud\)/i));
    await user.type(screen.getByLabelText(/rate \(aud\)/i), '250');
    await user.clear(screen.getByLabelText(/discount \(aud\)/i));
    await user.type(screen.getByLabelText(/discount \(aud\)/i), '5');

    const invoiceNumber = (screen.getByLabelText(/invoice number/i) as HTMLInputElement).value;
    await user.click(screen.getByRole('button', { name: /create invoice/i }));

    expect(await screen.findByText(/invoice list page/i)).toBeInTheDocument();
    expect(screen.getByTestId('location-display')).toHaveTextContent('/invoices');

    await waitFor(() => {
      expect(capturedPayload).toMatchObject({
        customerName: 'Acme Corp',
        customerEmail: 'billing@acme.test',
        customerMobile: '+61 400 123 456',
        customerAddress: '123 Market Street',
        invoiceNumber,
        invoiceReference: 'PO-1234',
        currency: 'AUD',
        description: 'Website services',
        item: {
          name: 'Website Design',
          quantity: 1,
          rate: 250,
        },
        taxPercentage: 10,
        discount: 5,
      });
    });
  });
});
