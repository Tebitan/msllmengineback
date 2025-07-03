import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './shared/config/configuration';
import { validationSchema } from './shared/config/validation-configuration';
import { AllExceptionsFilter } from './shared/filters/exceptions-manager.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from './shared/interceptors/timeout.interceptor';
import { AnswerFaqModule } from './answer-faq/answer-faq.module';

/**
 * Modulo Principal del MS
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    AnswerFaqModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const timeout = parseInt(configService.get('GLOBAL_TIMEOUT_MS') || '3000', 10);
        return new TimeoutInterceptor(timeout);
      },
    }
  ],
})
export class AppModule { }
