import { Link } from 'react-router';

export function AppLogo() {
  return (
    <Link to="/invoices" className="flex shrink-0 items-center" aria-label="SimpleInvoice home">
      <img
        src="/brand/simple-invoice-logo.png"
        alt="SimpleInvoice"
        className="h-10 w-auto"
      />
    </Link>
  );
}
