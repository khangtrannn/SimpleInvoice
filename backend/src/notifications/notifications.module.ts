import { Module } from '@nestjs/common';

import { EMAIL_SERVICE } from './constants/notification-tokens';
import { ConsoleEmailService } from './services/console-email.service';

@Module({
  providers: [
    {
      provide: EMAIL_SERVICE,
      useClass: ConsoleEmailService,
    },
  ],
  exports: [EMAIL_SERVICE],
})
export class NotificationsModule {}
