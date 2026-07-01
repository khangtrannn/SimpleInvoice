import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EMAIL_SERVICE } from './constants/notification-tokens';
import { ConsoleEmailService } from './services/console-email.service';
import { GmailEmailService } from './services/gmail-email.service';

@Module({
  providers: [
    ConsoleEmailService,
    GmailEmailService,
    {
      provide: EMAIL_SERVICE,
      inject: [ConfigService, ConsoleEmailService, GmailEmailService],
      useFactory: (
        configService: ConfigService,
        consoleEmailService: ConsoleEmailService,
        gmailEmailService: GmailEmailService,
      ) => {
        const provider = configService.get<string>('EMAIL_PROVIDER') ?? 'console';

        if (provider === 'gmail') {
          return gmailEmailService;
        }

        return consoleEmailService;
      },
    },
  ],
  exports: [EMAIL_SERVICE],
})
export class NotificationsModule {}
