import type { InvoiceDetail } from '@/api/types';
import {
  getFormattedInvoiceItemRate,
  getInvoiceItemLineTotal,
} from '@/features/invoices/detail/invoice-detail.mapper';

import { DetailCard } from './DetailCard';

type InvoiceItemsCardProps = {
  invoice: InvoiceDetail;
};

export function InvoiceItemsCard({ invoice }: InvoiceItemsCardProps) {
  if (invoice.items.length === 0) {
    return null;
  }

  return (
    <DetailCard title="Invoice Items">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-sm text-slate-500">
              <th className="px-6 py-4 font-semibold">#</th>
              <th className="px-6 py-4 font-semibold">Item Name</th>
              <th className="px-6 py-4 font-semibold">Quantity</th>
              <th className="px-6 py-4 font-semibold">Rate</th>
              <th className="px-6 py-4 font-semibold">Line Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 text-sm text-slate-700 last:border-b-0"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-semibold text-slate-800">{item.name}</td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">
                  {getFormattedInvoiceItemRate(invoice, item)}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-800">
                  {getInvoiceItemLineTotal(invoice, item)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {invoice.items.map((item, index) => (
          <div key={item.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Item #{index + 1}</p>
                <p className="mt-1 font-semibold text-slate-950">{item.name}</p>
              </div>

              <p className="font-bold text-slate-950">
                {getInvoiceItemLineTotal(invoice, item)}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Quantity</p>
                <p className="mt-1 font-medium text-slate-800">{item.quantity}</p>
              </div>

              <div>
                <p className="text-slate-500">Rate</p>
                <p className="mt-1 font-medium text-blue-600">
                  {getFormattedInvoiceItemRate(invoice, item)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DetailCard>
  );
}
