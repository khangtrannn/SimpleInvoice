import { Injectable, Logger } from '@nestjs/common';

import {
  EmailService,
  SendInvoiceIssuedEmailInput,
} from '../interfaces/email-service.interface';

@Injectable()
export class ConsoleEmailService implements EmailService {
  private readonly logger = new Logger(ConsoleEmailService.name);

  async sendInvoiceIssuedEmail(
    input: SendInvoiceIssuedEmailInput,
  ): Promise<void> {
    const attachmentInfo = input.attachments
      ? `Attachments: ${input.attachments.map((a) => a.filename).join(', ')}`
      : 'No attachments';

    this.logger.log(
      [
        'Invoice issued email',
        `To: ${input.to}`,
        `Customer: ${input.customerFullname}`,
        `Invoice: ${input.invoiceNumber}`,
        `Balance: ${input.currency} ${input.balanceAmount}`,
        `Payment URL: ${input.paymentUrl}`,
        attachmentInfo,
      ].join('\n'),
    );
  }
}
