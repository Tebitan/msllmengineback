import { FastifyReply } from 'fastify';
import { Controller, Get, HttpStatus, Inject, Logger, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnswerFaqService } from '../application/answer-faq.service';
import { ApiResponseDto } from '../../shared/domain/api-response.dto';
import { QuestionDto } from '../domain/dto/answer-faq.dto';
import { END_POINT_METHOD_FAQ, LEGACY, SERVICE_NAME, SERVICE_PREFIX } from '../../shared/constants/constants';

/**
 * @description Archivo controlador responsable de manejar las solicitudes entrantes que llegan a un end point.
 */
@ApiTags(SERVICE_NAME)
@Controller()
export class AnswerFaqController {
  private readonly logger = new Logger(AnswerFaqController.name);
  constructor(@Inject('TransactionId') private readonly transactionId: string,
    private readonly answerFaqService: AnswerFaqService) { }

  @Get(END_POINT_METHOD_FAQ)
  async generateResponseLLM(@Res() res: FastifyReply, @Query() questionDto: QuestionDto) {
    const start = Date.now();
    let response: ApiResponseDto;
    const logData = {
      transactionId: this.transactionId,
      legacy: LEGACY,
      request: questionDto
    };
    try {
      this.logger.log(`START [GET] END_POINT ${SERVICE_PREFIX}/${END_POINT_METHOD_FAQ}`, logData);
      response = await this.answerFaqService.managementConversation(questionDto);
      res.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
      res.status(response.responseCode).send(response);
    } finally {
      this.logger.log(`END [GET] END_POINT ${SERVICE_PREFIX}/${END_POINT_METHOD_FAQ}`, {
        ...logData,
        response,
        processingTime: `${Date.now() - start}ms`,
      });
    }
  }
}
