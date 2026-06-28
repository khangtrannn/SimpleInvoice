import { createBrowserRouter, Navigate } from 'react-router';

import { AppLayout } from '@/components/layout/AppLayout';
import { ScrollToTop } from '@/app/ScrollToTop';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { PublicOnlyRoute } from '@/features/auth/components/PublicOnlyRoute';
import { CreateInvoicePage } from '@/features/invoices/pages/CreateInvoicePage';
import { InvoiceDetailPage } from '@/features/invoices/pages/InvoiceDetailPage';
import { InvoiceListPage } from '@/features/invoices/pages/InvoiceListPage';

export const router = createBrowserRouter([
  {
    element: <ScrollToTop />,
    children: [
      {
        path: '/',
        element: <Navigate to="/invoices" replace />,
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
