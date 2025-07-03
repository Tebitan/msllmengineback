import { ApiResponseDto } from "../../../../shared/domain/api-response.dto";

export abstract class ICacheAdapter {
  abstract getFaqConcurrent(question: string): Promise<ApiResponseDto|undefined>;
  abstract setFaqConcurrent(question: string, value:ApiResponseDto): Promise<void>;
  abstract delFaqConcurrent(question: string): Promise<void>;
}