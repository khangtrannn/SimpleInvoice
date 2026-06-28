import { HttpResponse, http } from 'msw';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link } from 'react-router';
import type { RouteObject } from 'react-router';
import { describe, expect, it } from 'vitest';

import { InvoiceListPage } from '@/features/invoices/list/InvoiceListPage';
import { API_BASE_URL, TEST_ACCESS_TOKEN } from '@/test/mocks/auth-handlers';
import { server } from '@/test/mocks/server';
import { renderWithRouter } from '@/test/test-utils';
import { setAccessToken } from '@/features/auth/auth-storage';

function LocationDisplay() {
  return <div data-testid="location-display">{window.location.pathname}</div>;
}

function renderInvoiceList(initialEntries = ['/invoices']) {
  setAccessToken(TEST_ACCESS_TOKEN);

  const routes: RouteObject[] = [
    {
      path: '/invoices',
      element: (
        <>
          <InvoiceListPage />
          <LocationDisplay />
        </>
      ),
    },
    {
      path: '/invoices/new',
      element: <div>Create invoice page</div>,
    },
    {
      path: '/invoices/:invoiceId',
      element: <div>Invoice detail page</div>,
    },
    {
      path: '/login',
      element: <div>Login page</div>,
    },
    {
      path: '/',
      element: <Link to="/invoices">Invoices</Link>,
    },
  ];

  return renderWithRouter({
    routes,
    initialEntries,
  });
}

describe('InvoiceListPage', () => {
  it('renders invoice rows returned from the API', async () => {
    // Arrange
    renderInvoiceList();

    // Act - Wait for invoice number to appear in desktop table (first link matching the pattern)
    await screen.findAllByRole('link', {
      name: /inv-2026-001/i,
    });

    // Assert
    const acmeElements = screen.getAllByText(/acme corporation/i);
    expect(acmeElements.length).toBeGreaterThan(0);
    const brightElements = screen.getAllByText(/bright ideas pty ltd/i);
    expect(brightElements.length).toBeGreaterThan(0);
    expect(await screen.findByText(/8 invoices found/i)).toBeInTheDocument();
  });

  it('searches invoices by invoice number or customer name', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    await screen.findAllByRole('link', {
      name: /inv-2026-001/i,
    });

    // Act
    await user.type(
      screen.getByPlaceholderText(/search by invoice number or customer name/i),
      'creative',
    );

    // Assert
    await screen.findAllByRole('link', {
      name: /inv-2026-003/i,
    });

    await waitFor(() => {
      const acmeElements = screen.queryAllByText(/acme corporation/i);
      expect(acmeElements.length).toBe(0);
    });

    const creativeElements = screen.getAllByText(/creative studio/i);
    expect(creativeElements.length).toBeGreaterThan(0);
  });

  it('filters invoices by status', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    const names = await screen.findAllByText(/acme corporation/i);
    expect(names.length).toBeGreaterThan(0);

    // Act
    await user.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'Paid');

    // Assert
    const paidNames = await screen.findAllByText(/acme corporation/i);
    expect(paidNames.length).toBeGreaterThan(0);
    const enterpriseNames = screen.getAllByText(/echo enterprises/i);
    expect(enterpriseNames.length).toBeGreaterThan(0);

    await waitFor(() => {
      const brightElements = screen.queryAllByText(/bright ideas pty ltd/i);
      const creativeElements = screen.queryAllByText(/creative studio/i);
      expect(brightElements.length).toBe(0);
      expect(creativeElements.length).toBe(0);
    });
  });

  it('clears filters and returns to the default invoice list', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    const names = await screen.findAllByText(/acme corporation/i);
    expect(names.length).toBeGreaterThan(0);
    await user.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'Paid');

    const filteredNames = await screen.findAllByText(/echo enterprises/i);
    expect(filteredNames.length).toBeGreaterThan(0);

    // Act
    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    // Assert
    const brightNames = await screen.findAllByText(/bright ideas pty ltd/i);
    expect(brightNames.length).toBeGreaterThan(0);
    const creativeNames = screen.getAllByText(/creative studio/i);
    expect(creativeNames.length).toBeGreaterThan(0);
    expect(screen.getByText(/showing 1 to 8 of 8 invoices/i)).toBeInTheDocument();
  });

  it('sorts invoices by total amount in ascending order', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    const names = await screen.findAllByText(/acme corporation/i);
    expect(names.length).toBeGreaterThan(0);

    // Act
    await user.selectOptions(screen.getByRole('combobox', { name: /sort by/i }), 'Amount: Low to High');

    // Assert
    await waitFor(() => {
      const invoiceLinks = screen.getAllByRole('link', {
        name: /inv-2026-/i,
      });

      expect(invoiceLinks[0]).toHaveTextContent('INV-2026-008');
    });

    expect(screen.getByText(/au\$750.00 aud/i)).toBeInTheDocument();
  });

  it('changes page size and updates the number of visible rows', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    const links = await screen.findAllByRole('link', {
      name: /inv-2026-001/i,
    });
    expect(links.length).toBeGreaterThan(0);

    // Act
    await user.selectOptions(screen.getByDisplayValue('10'), '20');

    // Assert
    expect(await screen.findByText(/showing 1 to 8 of 8 invoices/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /rows per page/i })).toHaveValue('20');
  });

  it('navigates to invoice detail when invoice number is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    const invoiceLinks = await screen.findAllByRole('link', {
      name: /inv-2026-001/i,
    });
    const invoiceLink = invoiceLinks[0];

    // Act
    await user.click(invoiceLink);

    // Assert
    expect(await screen.findByText(/invoice detail page/i)).toBeInTheDocument();
  });

  it('navigates to invoice detail when the invoice row is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    await screen.findByRole('table');
    const customerCell = within(screen.getByRole('table')).getByText(/acme corporation/i);

    // Act
    await user.click(customerCell);

    // Assert
    expect(await screen.findByText(/invoice detail page/i)).toBeInTheDocument();
  });

  it('navigates to create invoice page from the create button', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    const names = await screen.findAllByText(/acme corporation/i);
    expect(names[0]).toBeInTheDocument();

    // Act
    await user.click(screen.getByRole('link', { name: /create invoice/i }));

    // Assert
    expect(await screen.findByText(/create invoice page/i)).toBeInTheDocument();
  });

  it('shows empty state when no invoices match the filters', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    const names = await screen.findAllByText(/acme corporation/i);
    expect(names[0]).toBeInTheDocument();

    // Act
    await user.type(
      screen.getByPlaceholderText(/search by invoice number or customer name/i),
      'not-existing-customer',
    );

    // Assert
    expect(await screen.findByText(/no invoices found/i)).toBeInTheDocument();
    expect(screen.getByText(/try changing your search/i)).toBeInTheDocument();
  });

  it('shows error state when invoice list API fails', async () => {
    // Arrange
    server.use(
      http.get(`${API_BASE_URL}/invoices`, () => {
        return HttpResponse.json(
          {
            statusCode: 500,
            message: 'Failed to load invoices',
            error: 'Internal Server Error',
            timestamp: '2026-06-27T10:00:00.000Z',
            path: '/invoices',
          },
          { status: 500 },
        );
      }),
    );

    // Act
    renderInvoiceList();

    // Assert
    expect(await screen.findByText(/failed to load invoices/i)).toBeInTheDocument();
  });

  it('does not display client/customer select filter', async () => {
    // Arrange
    renderInvoiceList();

    // Act - Wait for page to load
    await screen.findAllByRole('link', {
      name: /inv-2026-001/i,
    });

    // Assert
    expect(screen.queryByLabelText(/client/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/all clients/i)).not.toBeInTheDocument();
  });
});
