import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { PublicOnlyRoute } from '@/features/auth/components/PublicOnlyRoute';
import { LoginPage } from '@/features/auth/login/LoginPage';
import { TEST_ACCESS_TOKEN } from '@/test/mocks/constants';
import { reviewerCredentials } from '@/test/mocks/auth-fixtures';
import { renderWithRouter } from '@/test/test-utils';

function renderLoginFlow(initialEntries = ['/login']) {
  return renderWithRouter({
    initialEntries,
    routes: [
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/invoices',
            element: <div>Invoices page</div>,
          },
        ],
      },
    ],
  });
}

describe('LoginPage', () => {
  it('shows validation errors when the form is submitted empty', async () => {
    // Arrange
    const user = userEvent.setup();
    renderLoginFlow();

    // Act
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert
    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid email format', async () => {
    // Arrange
    const user = userEvent.setup();
    renderLoginFlow();

    // Act
    await user.type(screen.getByLabelText(/email address/i), 'invalid-email');
    // Anchored regex avoids matching the "Show password" toggle button's aria-label.
    await user.type(screen.getByLabelText(/^password$/i), 'Password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert
    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
  });

  it('logs in successfully and redirects to invoices page', async () => {
    // Arrange
    const user = userEvent.setup();
    renderLoginFlow();

    // Act
    await user.type(screen.getByLabelText(/email address/i), reviewerCredentials.email);
    await user.type(screen.getByLabelText(/^password$/i), reviewerCredentials.password);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert
    expect(await screen.findByText(/invoices page/i)).toBeInTheDocument();
    expect(window.localStorage.getItem('simple_invoice_access_token')).toBe(TEST_ACCESS_TOKEN);
  });

  it('shows API error when credentials are invalid', async () => {
    // Arrange
    const user = userEvent.setup();
    renderLoginFlow();

    // Act
    await user.type(screen.getByLabelText(/email address/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert
    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
    expect(screen.queryByText(/invoices page/i)).not.toBeInTheDocument();
  });
});
