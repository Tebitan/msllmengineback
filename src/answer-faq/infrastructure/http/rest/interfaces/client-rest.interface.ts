import { HttpResponse } from '../../../../../shared/domain/http-client-options.dto';

export abstract class IClientRestService {
  abstract getFaqs<ApiResponseDto>(question: string): Promise<HttpResponse<ApiResponseDto>>;
}
