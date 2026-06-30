export type SendInvoiceIssuedEmailInput = {
  to: string;
  customerFullname: string;
  invoiceNumber: string;
  paymentUrl: string;
  balanceAmount: string;
  currency: string;
};

export interface EmailService {
  sendInvoiceIssuedEmail(input: SendInvoiceIssuedEmailInput): Promise<void>;
}
