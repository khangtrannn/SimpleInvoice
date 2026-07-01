import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

import {
  EmailService,
  SendInvoiceIssuedEmailInput,
} from '../interfaces/email-service.interface';

@Injectable()
export class GmailEmailService implements EmailService {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.getOrThrow<string>('GMAIL_USER');
    const pass = this.configService.getOrThrow<string>('GMAIL_APP_PASSWORD');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }

  async sendInvoiceIssuedEmail(
    input: SendInvoiceIssuedEmailInput,
  ): Promise<void> {
    const fromName =
      this.configService.get<string>('GMAIL_FROM_NAME') ?? 'SimpleInvoice';

    const fromEmail =
      this.configService.get<string>('GMAIL_FROM_EMAIL') ??
      this.configService.getOrThrow<string>('GMAIL_USER');

    await this.transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: input.to,
      subject: `Invoice ${input.invoiceNumber} from SimpleInvoice`,
      text: this.buildText(input),
      html: this.buildHtml(input),
      attachments: input.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
  }

  private buildText(input: SendInvoiceIssuedEmailInput): string {
    return [
      `Hi ${input.customerFullname},`,
      '',
      `Your invoice ${input.invoiceNumber} has been issued.`,
      `Outstanding balance: ${input.currency} ${input.balanceAmount}`,
      '',
      `You can pay your invoice using this secure link:`,
      input.paymentUrl,
      '',
      'The invoice PDF is attached to this email.',
      '',
      'Thank you,',
      'SimpleInvoice',
    ].join('\n');
  }

  private buildHtml(input: SendInvoiceIssuedEmailInput): string {
    return `
      <div style="font-family: Arial, sans-serif; color: #172033; line-height: 1.6;">
        <p>Hi ${escapeHtml(input.customerFullname)},</p>

        <p>
          Your invoice <strong>${escapeHtml(input.invoiceNumber)}</strong>
          has been issued.
        </p>

        <p>
          Outstanding balance:
          <strong>${escapeHtml(input.currency)} ${escapeHtml(input.balanceAmount)}</strong>
        </p>

        <p>
          <a
            href="${escapeHtml(input.paymentUrl)}"
            style="
              display: inline-block;
              padding: 12px 18px;
              background: #2563eb;
              color: #ffffff;
              text-decoration: none;
              border-radius: 10px;
              font-weight: 700;
            "
          >
            Pay invoice
          </a>
        </p>

        <p>The invoice PDF is attached to this email.</p>

        <p>Thank you,<br />SimpleInvoice</p>
      </div>
    `;
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
