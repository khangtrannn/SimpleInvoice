import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { AppLayout } from '@/shared/ui/layout/AppLayout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { PublicOnlyRoute } from '@/features/auth/components/PublicOnlyRoute';
import { setAccessToken, setStoredAuthUser } from '@/features/auth/auth-storage';
import { LoginPage } from '@/features/auth/login/LoginPage';
import { TEST_ACCESS_TOKEN } from '@/test/mocks/constants';
import { reviewerUser } from '@/test/mocks/auth-fixtures';
import { renderWithRouter } from '@/test/test-utils';

function renderAuthRoutes(initialEntries: string[]) {
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
            element: <AppLayout />,
            children: [
              {
                path: '/invoices',
                element: <div>Invoices page</div>,
              },
            ],
          },
        ],
      },
    ],
  });
}

describe('auth routes', () => {
  it('redirects unauthenticated users from protected routes to login', async () => {
    // Arrange — no auth state; localStorage is empty after afterEach cleanup.

    // Act
    renderAuthRoutes(['/invoices']);

    // Assert
    expect(await screen.findByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });

  it('restores authenticated session and allows protected route access', async () => {
    // Arrange
    setAccessToken(TEST_ACCESS_TOKEN);

    // Act
    renderAuthRoutes(['/invoices']);

    // Assert
    expect(await screen.findByText(/invoices page/i)).toBeInTheDocument();
    expect(screen.getByText(reviewerUser.fullname)).toBeInTheDocument();
    expect(screen.getByText(reviewerUser.email)).toBeInTheDocument();
  });

  it('redirects authenticated users away from login page', async () => {
    // Arrange
    setAccessToken(TEST_ACCESS_TOKEN);

    // Act
    renderAuthRoutes(['/login']);

    // Assert
    expect(await screen.findByText(/invoices page/i)).toBeInTheDocument();
  });

  it('logs out and redirects back to login', async () => {
    // Arrange
    const user = userEvent.setup();
    setAccessToken(TEST_ACCESS_TOKEN);
    setStoredAuthUser(reviewerUser);
    renderAuthRoutes(['/invoices']);
    await screen.findByText(/invoices page/i); // wait for session restore to finish

    // Act
    await user.click(screen.getByRole('button', { name: /log out/i }));

    // Assert
    expect(await screen.findByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(window.localStorage.getItem('simple_invoice_access_token')).toBeNull();
  });
});
