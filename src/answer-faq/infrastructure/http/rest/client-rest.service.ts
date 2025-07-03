import { ConfigService } from "@nestjs/config";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { HttpProvider } from "../../../../shared/infrastructure/http/rest-http-provider.service";
import { IClientRestService } from "./interfaces/client-rest.interface";
import { HttpRequestOptions, HttpResponse } from "../../../../shared/domain/http-client-options.dto";
import { LEGACY_OCP } from "../../../../shared/constants/constants";

/**
 * Cliente para realizar las peticiones HTTP 
 */
@Injectable()
export class ClientRestService implements IClientRestService {
    private readonly logger = new Logger(ClientRestService.name);
    private readonly maxTimeRest: number;
    private readonly endPoint: string;

    constructor(private readonly configService: ConfigService,
        private readonly http: HttpProvider,
        @Inject('TransactionId') private readonly transactionId: string,
    ) {
        this.maxTimeRest = this.configService.get<number>('REST_TIMEOUT', 2000);
        this.endPoint = this.configService.get<string>('OCP_ENDPOINT_GET_FAQS');
    }

    /**
     * getFaqs
     * @description Realiza la peticion HTTP hacia MS FAQS para la obtencion de informacion
     * @param question Pregunta realiza por el usuario
     * @returns HttpResponse<ApiResponseDto>
     */
    async getFaqs<ApiResponseDto>(question: string): Promise<HttpResponse<ApiResponseDto>> {
        const start = Date.now();
        const request: HttpRequestOptions = {
            method: 'GET',
            url: `${this.endPoint}?question=${question}`,
            timeout: this.maxTimeRest
        };
        const logData = {
            transactionId: this.transactionId,
            legacy: LEGACY_OCP,
            request,
        };
        this.logger.log('START Consumer HTTP', logData);
        const response = await this.http.request<ApiResponseDto>(request);
        this.logger.log('END Consumer HTTP', {
            ...logData,
            response,
            processingTime: `${Date.now() - start}ms`,
        });
        return response;
    }   
}