import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AssistantProvider } from './assistant-provider.service';
import { IAssistantProvider } from './interfaces/assistant-provider.interface';
import { ChatCompletionOptions } from '../../domain/llm-message.dto';

/**
 * Módulo que implementa la interacción con el LLM.
 */
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: AssistantProvider,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): IAssistantProvider => {
        const apiKey = configService.getOrThrow<string>('AI_API_KEY');
        const baseURL = configService.get<string>('AI_BASE_URL');
        const timeout = configService.get<number>('AI_TIMEOUT');
        const model = configService.get<string>('AI_MODEL');
        const options: ChatCompletionOptions = {
          max_tokens: Number(configService.get('AI_MAX_TOKENS', 512)),
          temperature: Number(configService.get('AI_TEMPERATURE', 0.7)),
          top_p: Number(configService.get('AI_TOP_P', 1)),
          presence_penalty: Number(configService.get('AI_PRESENCE_PENALTY', 0.1)),
          frequency_penalty: Number(configService.get('AI_FREQUENCY_PENALTY', 0.1)),
        };
        return new AssistantProvider(apiKey, baseURL, timeout, model, options);
      },
    },
  ],
  exports: [AssistantProvider],
})
export class AiWorkflowModule {}