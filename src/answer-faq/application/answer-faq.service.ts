import { ConfigService } from '@nestjs/config';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientRestService } from '../infrastructure/http/rest/client-rest.service';
import { AssistantAdapter } from '../infrastructure/ai/assistant/assistant-adapter.service';
import { CacheAdapterService } from '../infrastructure/cache/cache-adapter.service';
import { normalizeText } from '../../shared/utils/common-utils';
import { BusinessExceptionDto } from '../../shared/domain/business-exceptions.dto';
import { ApiResponseDto } from '../../shared/domain/api-response.dto';
import { QuestionDto } from '../domain/dto/answer-faq.dto';
import { HttpResponse } from '../../shared/domain/http-client-options.dto';
import { AssistantMessage } from '../../shared/domain/llm-message.dto';
import { CODE_200, CODE_400, LEGACY, LEGACY_AI, LEGACY_OCP, MSG_200, MSG_400 } from '../../shared/constants/constants';

/**
 * Maneja la logica de negocio del modulo 
 */
@Injectable()
export class AnswerFaqService {
    private readonly logger = new Logger(AnswerFaqService.name);

    constructor(private readonly configService: ConfigService,
        @Inject('TransactionId') private readonly transactionId: string,
        private readonly clientRestService: ClientRestService,
        private readonly assistantAdapter: AssistantAdapter,
        private readonly cacheAdapterService: CacheAdapterService
    ) { }

    /**
     * managementConversation
     * @description Realiza el manejo de conversacion con el LLM
     * @param questionDto 
     * @returns 
     */
    public async managementConversation(questionDto: QuestionDto): Promise<ApiResponseDto> {
        try {
            let response: ApiResponseDto;
            const { question } = questionDto;
            response = await this.getCache(question);
            if (response) return response;
            const answerBack: HttpResponse<ApiResponseDto> = await this.getAnswerBack(question);
            this.validateResponseLegacy(answerBack);
            const responseLlm = await this.conversationRagllm(question, answerBack.data.data[0].answer)
            response = new ApiResponseDto({
                responseCode: HttpStatus.OK,
                messageCode: CODE_200,
                message: MSG_200,
                legacy: LEGACY,
                transactionId: this.transactionId,
                data: responseLlm
            });
            this.saveCache(question, response);
            return response;
        } catch (error) {
            if (error instanceof BusinessExceptionDto) throw error;
            this.logger.error(error.message, { transactionId: this.transactionId, stack: error.stack });
            throw new BusinessExceptionDto({
                legacy: LEGACY_AI,
                transactionId: this.transactionId,
                data: {
                    message: error.message

                },
            });
        }
    }

    /**
     * conversationRagllm
     * @description Realiza la comunicacion con LLM
     * @param question Pregunta realizada por el usuario
     * @param answer Pregunta sumisnistrada por el BACK
     * @returns AssistantMessage[]
     */
    public async conversationRagllm(question: string, answer: string): Promise<AssistantMessage[]> {
        return await this.assistantAdapter.runRag(question, answer);
    }

    /**
     * getAnswerBack
     * @description Obtiene la respuesta del BACK
     * @param question Pregunta del usuario
     * @returns HttpResponse<ApiResponseDto>
     */
    public async getAnswerBack(question: string): Promise<HttpResponse<ApiResponseDto>> {
        return this.clientRestService.getFaqs(normalizeText(question));
    }

    /**
     * Realiza la validacion de la respuesta del legado externo code http 200
     * @param responseLegacy Respuesta del legado
     */
    public validateResponseLegacy(responseLegacy: HttpResponse<ApiResponseDto>): void {
        if (responseLegacy.status !== HttpStatus.OK) {
            this.throwBusinessError({
                legacy: LEGACY_OCP,
                messageCode: 'GET_FAQS_FAILED',
                message: 'Error Obteniendo las FAQS del OCP.',
                additionalData: { responseLegacy },
            });
        }
        if (!this.isValidFaqAnswerResponse(responseLegacy)) {
            this.throwBusinessError({
                legacy: LEGACY_OCP,
                messageCode: 'INVALID_FAQS_RESPONSE',
                message: 'La respuesta del OCP no contiene FAQ Validas.',
                additionalData: { responseLegacy },
            });
        }
    }

    /**
     * isValidFaqAnswerResponse
     * @description Valida si la respuesta de FAQ contiene un campo `answer` válido.
     * @param responseLegacy Objeto recibido del backend con estructura tipo FAQ.
     * @returns `true` si hay al menos una entrada con un `answer` válido, `false` en caso contrario.
     */
    public isValidFaqAnswerResponse(responseLegacy: HttpResponse<ApiResponseDto>): boolean {
        const data = responseLegacy.data?.data;
        if (!Array.isArray(data) || data.length === 0) return false;
        const answer = data[0]?.answer;
        return typeof answer === 'string' && answer.trim().length > 0;
    }

    /**
     * Lanza una excepción de negocio personalizada.
     * @param params Objeto de Exception Comun
     */
    public throwBusinessError(params: {
        legacy: string;
        messageCode: string;
        message: string;
        additionalData?: Record<string, any>;
    }): never {
        const { legacy, messageCode, message, additionalData } = params;
        throw new BusinessExceptionDto({
            responseCode: HttpStatus.BAD_REQUEST,
            messageCode: CODE_400,
            message: MSG_400,
            legacy,
            transactionId: this.transactionId,
            data: {
                message,
                messageCode,
                ...additionalData,
            },
        });
    }

    /**
     * getCache
     * @description Obtiene la cache de la pregunta recurrente
     * @param question Pregunta recurrente
     * @returns ApiResponseDto|undefined
     */
    public async getCache(question: string): Promise<ApiResponseDto | undefined> {
        return this.cacheAdapterService.getFaqConcurrent(normalizeText(question));
    }

    /**
     * saveCache
     * @description Guarda en cache la pregunta recurrente 
     * @param question Pregunta recurrente
     * @param response Respuesta del servicio
     * @returns void
     */
    public async saveCache(question: string, response: ApiResponseDto): Promise<void> {
        return this.cacheAdapterService.setFaqConcurrent(normalizeText(question), response);
    }
}
