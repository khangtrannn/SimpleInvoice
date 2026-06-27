import { HttpResponse, http } from 'msw';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, RouteObject } from 'react-router';
import { describe, expect, it } from 'vitest';

import { InvoiceListPage } from '@/features/invoices/pages/InvoiceListPage';
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

    // Act
    const acmeInvoiceLink = await screen.findByRole('link', {
      name: /inv-2026-001/i,
    });

    // Assert
    expect(acmeInvoiceLink).toBeInTheDocument();
    expect(screen.getByText(/acme corporation/i)).toBeInTheDocument();
    expect(screen.getByText(/bright ideas pty ltd/i)).toBeInTheDocument();
    expect(screen.getByText(/2,450.00 aud/i)).toBeInTheDocument();
    expect(screen.getByText(/showing 1 to 8 of 8 results/i)).toBeInTheDocument();
  });

  it('searches invoices by invoice number or customer name', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    await screen.findByRole('link', {
      name: /inv-2026-001/i,
    });

    // Act
    await user.type(
      screen.getByPlaceholderText(/search by invoice number or customer name/i),
      'creative',
    );

    // Assert
    expect(
      await screen.findByRole('link', {
        name: /inv-2026-003/i,
      }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/acme corporation/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/creative studio/i)).toBeInTheDocument();
    expect(screen.getByText(/showing 1 to 1 of 1 results/i)).toBeInTheDocument();
  });

  it('filters invoices by status', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    await screen.findByText(/acme corporation/i);

    // Act
    await user.click(screen.getByRole('button', { name: /paid/i }));

    // Assert
    expect(await screen.findByText(/acme corporation/i)).toBeInTheDocument();
    expect(screen.getByText(/echo enterprises/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/bright ideas pty ltd/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/creative studio/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/showing 1 to 2 of 2 results/i)).toBeInTheDocument();
  });

  it('clears filters and returns to the default invoice list', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    await screen.findByText(/acme corporation/i);
    await user.click(screen.getByRole('button', { name: /paid/i }));

    expect(await screen.findByText(/echo enterprises/i)).toBeInTheDocument();

    // Act
    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    // Assert
    expect(await screen.findByText(/bright ideas pty ltd/i)).toBeInTheDocument();
    expect(screen.getByText(/creative studio/i)).toBeInTheDocument();
    expect(screen.getByText(/showing 1 to 8 of 8 results/i)).toBeInTheDocument();
  });

  it('sorts invoices by total amount in ascending order', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    await screen.findByText(/acme corporation/i);

    // Act
    await user.selectOptions(screen.getByRole('combobox', { name: /sort by/i }), 'totalAmount');
    await user.selectOptions(screen.getByRole('combobox', { name: /ordering/i }), 'ASC');

    // Assert
    await waitFor(() => {
      const invoiceLinks = screen.getAllByRole('link', {
        name: /inv-2026-/i,
      });

      expect(invoiceLinks[0]).toHaveTextContent('INV-2026-008');
    });

    expect(screen.getByText(/750.00 aud/i)).toBeInTheDocument();
  });

  it('changes page size and updates the number of visible rows', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    await screen.findByRole('link', {
      name: /inv-2026-001/i,
    });

    // Act
    await user.selectOptions(screen.getByDisplayValue('10'), '20');

    // Assert
    expect(await screen.findByText(/showing 1 to 8 of 8 results/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /rows per page/i })).toHaveValue('20');
  });

  it('navigates to invoice detail when invoice number is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    const invoiceLink = await screen.findByRole('link', {
      name: /inv-2026-001/i,
    });

    // Act
    await user.click(invoiceLink);

    // Assert
    expect(await screen.findByText(/invoice detail page/i)).toBeInTheDocument();
  });

  it('navigates to create invoice page from the create button', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    await screen.findByText(/acme corporation/i);

    // Act
    await user.click(screen.getByRole('link', { name: /create invoice/i }));

    // Assert
    expect(await screen.findByText(/create invoice page/i)).toBeInTheDocument();
  });

  it('shows empty state when no invoices match the filters', async () => {
    // Arrange
    const user = userEvent.setup();
    renderInvoiceList();

    await screen.findByText(/acme corporation/i);

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
});
