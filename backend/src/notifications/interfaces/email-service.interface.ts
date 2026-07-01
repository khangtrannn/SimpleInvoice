export type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

export type SendInvoiceIssuedEmailInput = {
  to: string;
  customerFullname: string;
  invoiceNumber: string;
  paymentUrl: string;
  balanceAmount: string;
  currency: string;
  attachments?: EmailAttachment[];
};

export interface EmailService {
  sendInvoiceIssuedEmail(input: SendInvoiceIssuedEmailInput): Promise<void>;
}
