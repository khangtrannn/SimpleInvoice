import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Browser, chromium } from 'playwright';

import { InvoiceEntity } from '../entities/invoice.entity';
import { renderInvoicePdfHtml } from './invoice-pdf-template';

@Injectable()
export class InvoicePdfService implements OnModuleDestroy {
  private browserPromise: Promise<Browser> | null = null;

  async generateInvoicePdf(invoice: InvoiceEntity): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage({
      viewport: {
        width: 794,
        height: 1123,
      },
    });

    try {
      const html = renderInvoicePdfHtml(invoice);

      await page.setContent(html, {
        waitUntil: 'networkidle',
      });

      return await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        },
      });
    } finally {
      await page.close();
    }
  }

  private getBrowser(): Promise<Browser> {
    this.browserPromise ??= chromium.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    return this.browserPromise;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.browserPromise) {
      const browser = await this.browserPromise;
      await browser.close();
    }
  }
}
