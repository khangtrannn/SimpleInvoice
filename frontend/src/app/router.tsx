import { createBrowserRouter, Navigate } from 'react-router';

import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { CreateInvoicePage } from '@/features/invoices/pages/CreateInvoicePage';
import { InvoiceDetailPage } from '@/features/invoices/pages/InvoiceDetailPage';
import { InvoiceListPage } from '@/features/invoices/pages/InvoiceListPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/invoices" />,
      },
      {
        path: 'invoices',
        element: <InvoiceListPage />,
      },
      {
        path: 'invoices/new',
        element: <CreateInvoicePage />,
      },
      {
        path: 'invoices/:invoiceId',
        element: <InvoiceDetailPage />,
      },
    ],
  },
]);
