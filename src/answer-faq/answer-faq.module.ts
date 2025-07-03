import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiWorkflowModule } from '../shared/infrastructure/ai/ai-workflow.module';
import { CacheProviderModule } from '../shared/infrastructure/cache/cache-provider.module';
import { HttpProviderModule } from '../shared/infrastructure/http/http-provider.module';
import { TransactionIdProvider } from '../shared/providers/transaction-id.provider';
import { AssistantAdapter } from './infrastructure/ai/assistant/assistant-adapter.service';
import { ClientRestService } from './infrastructure/http/rest/client-rest.service';
import { CacheAdapterService } from './infrastructure/cache/cache-adapter.service';
import { AnswerFaqService } from './application/answer-faq.service';
import { AnswerFaqController } from './controllers/answer-faq.controller';

/**
 * Módulo de NestJS que agrupa el controller, service y las dependencias necesarias para su funcionamiento
 */
@Module({
  imports: [ConfigModule, AiWorkflowModule, HttpProviderModule,
    CacheProviderModule],
  controllers: [AnswerFaqController],
  providers: [TransactionIdProvider, AssistantAdapter, ClientRestService, CacheAdapterService, AnswerFaqService],
})
export class AnswerFaqModule { }
