import { createBrowserRouter, Navigate } from 'react-router';

import { AppLayout } from '@/components/layout/AppLayout';
import { ScrollToTop } from '@/app/ScrollToTop';
import { AUTH_ROUTES } from '@/features/auth/auth-route.constants';
import { LoginPage } from '@/features/auth/login/LoginPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { PublicOnlyRoute } from '@/features/auth/components/PublicOnlyRoute';
import { CreateInvoicePage } from '@/features/invoices/create/CreateInvoicePage';
import { InvoiceDetailPage } from '@/features/invoices/detail/InvoiceDetailPage';
import { InvoiceListPage } from '@/features/invoices/list/InvoiceListPage';

export const router = createBrowserRouter([
  {
    element: <ScrollToTop />,
    children: [
      {
        path: '/',
        element: <Navigate to={AUTH_ROUTES.authenticatedHome} replace />,
      },
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
                element: <InvoiceListPage />,
              },
              {
                path: '/invoices/new',
                element: <CreateInvoicePage />,
              },
              {
                path: '/invoices/:invoiceId',
                element: <InvoiceDetailPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
