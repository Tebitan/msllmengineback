import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CacheProvider } from "../../../shared/infrastructure/cache/cache-provider.service";
import { ICacheAdapter } from "./interfaces/cache-adapter.interface";
import { LEGACY_CACHE } from "../../../shared/constants/constants";
import { ApiResponseDto } from "../../../shared/domain/api-response.dto";

/**
 * Manejo de cache
 */
@Injectable()
export class CacheAdapterService implements ICacheAdapter {
    private readonly logger = new Logger(CacheAdapterService.name);
    private readonly ttlCache: number;

    constructor(private readonly configService: ConfigService,
        private readonly cache: CacheProvider,
        @Inject('TransactionId') private readonly transactionId: string,

    ) {
        this.ttlCache = this.configService.get<number>('CACHE_TTL', 0);
    }

    /**
     * getFaqConcurrent
     * @description Obtiene la respuesta recurrente 
     * @param question Pregunta del Usuario
     * @returns ApiResponseDto | undefined
     */
    async getFaqConcurrent(question: string): Promise<ApiResponseDto | undefined> {
        const start = Date.now();
        const logData = {
            transactionId: this.transactionId,
            legacy: LEGACY_CACHE,
            request: question,
        };
        this.logger.log('START GET CACHE', logData);
        const response: any = await this.cache.get<ApiResponseDto>(question);
        this.logger.log('END GET CACHE', {
            ...logData,
            response,
            processingTime: `${Date.now() - start}ms`,
        });
        return response;
    }

    /**
     * setFaqConcurrent
     * @description Guarda en cache la pregunta recurrente
     * @param question Pregunta del usuario
     * @param value Respuesta dada por el MS
     */
    async setFaqConcurrent(question: string, value: ApiResponseDto): Promise<void> {
        const start = Date.now();
        const logData = {
            transactionId: this.transactionId,
            legacy: LEGACY_CACHE,
            request: question,
        };
        this.logger.log('START SET CACHE', logData);
        const response = await this.cache.set(question, value, this.ttlCache);
        this.logger.log('END SET CACHE', {
            ...logData,
            response,
            processingTime: `${Date.now() - start}ms`,
        });
    }

    /**
     * delFaqConcurrent
     * @description Elimina la pregunta recurrente
     * @param question Pregunta del usuario
     */
    async delFaqConcurrent(question: string): Promise<void> {
        const start = Date.now();
        const logData = {
            transactionId: this.transactionId,
            legacy: LEGACY_CACHE,
            request: question,
        };
        this.logger.log('START DELETE CACHE', logData);
        const response = await this.cache.del(question);
        this.logger.log('END DELETE CACHE', {
            ...logData,
            response,
            processingTime: `${Date.now() - start}ms`,
        });
    }
}