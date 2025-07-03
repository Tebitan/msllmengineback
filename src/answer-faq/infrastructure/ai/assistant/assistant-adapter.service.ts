import { ConfigService } from "@nestjs/config";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { AssistantProvider } from "../../../../shared/infrastructure/ai/assistant-provider.service";
import { IAssistantAdapter } from "./interfaces/assistant-adapter.interfaces";
import { AssistantMessage } from "../../../../shared/domain/llm-message.dto";
import { FIELD_RETRIEVED_CONTEXT, FIELD_TOPIC, LEGACY_AI} from "../../../../shared/constants/constants";

/**
 * Adaptador de asistente de LLM
 */
@Injectable()
export class AssistantAdapter implements IAssistantAdapter {
    private readonly logger = new Logger(AssistantAdapter.name);
    private readonly topic: string;
    private readonly systemPromptConf: string;

    constructor(private readonly configService: ConfigService,
        private readonly assistantProvider: AssistantProvider,
        @Inject('TransactionId') private readonly transactionId: string,
    ) {
        this.topic = this.configService.get<string>('TOPIC');
        this.systemPromptConf = this.configService.get<string>('AI_SYSTEM_PROMPT');
    }

    /**
     * runRag
     * @description Ejecuta una interacción estilo RAG (Retrieval-Augmented Generation) utilizando un `systemPrompt` 
     * generado dinámicamente a partir de información contextual recuperada desde el backend, y un mensaje 
     * del usuario. Esta conversación se envía a `chat.completions` para generar una respuesta del modelo.
     * @param question Pregunta del Usario
     * @param answer La respuesta dada por el BACK
     * @returns AssistantMessage[]
     */
    async runRag(question: string, answer: string): Promise<AssistantMessage[]> {
        const start = Date.now();
        const systemPrompt = this.systemPromptConf.replace(FIELD_TOPIC, this.topic).replace(FIELD_RETRIEVED_CONTEXT, answer).replace(/\\n/g, '\n');
        const messages = [
            {
                role: 'system' as const,
                content: systemPrompt
            },
            {
                role: 'user' as const,
                content: question
            }
        ];
        const logData = {
            transactionId: this.transactionId,
            legacy: LEGACY_AI,
            request: {
                action: 'run-rag',
                messages
            },
        };
        this.logger.log('START Consumer AI', logData);
        const response = await this.assistantProvider.chatCompletion(messages);
        this.logger.log('END Consumer AI', {
            ...logData,
            response,
            processingTime: `${Date.now() - start}ms`,
        });
        return response;
    }
}