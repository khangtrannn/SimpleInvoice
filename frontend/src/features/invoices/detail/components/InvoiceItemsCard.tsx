import type { InvoiceDetail } from '@/api/types';
import {
  getFormattedInvoiceItemRate,
  getInvoiceItemLineTotal,
} from '@/features/invoices/detail/invoice-detail.mapper';
import { SectionCard } from '@/shared/ui/SectionCard';

type InvoiceItemsCardProps = {
  invoice: InvoiceDetail;
};

export function InvoiceItemsCard({ invoice }: InvoiceItemsCardProps) {
  if (invoice.items.length === 0) {
    return null;
  }

  return (
    <SectionCard title="Invoice Items">
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Rate</th>
              <th className="px-6 py-4 text-right">Line Total</th>
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
                <td className="px-6 py-4 text-right font-semibold text-slate-800">
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
            <div>
              <p className="text-sm text-slate-500">Item #{index + 1}</p>
              <div className="mt-1 flex items-start justify-between gap-4">
                <p className="font-semibold text-slate-950">{item.name}</p>
                <p className="font-bold text-slate-950 shrink-0">
                  {getInvoiceItemLineTotal(invoice, item)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Quantity</p>
                <p className="mt-1 font-medium text-slate-800">{item.quantity}</p>
              </div>

              <div>
                <p className="text-slate-500">Rate</p>
                <p className="mt-1 font-medium text-slate-800">
                  {getFormattedInvoiceItemRate(invoice, item)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
