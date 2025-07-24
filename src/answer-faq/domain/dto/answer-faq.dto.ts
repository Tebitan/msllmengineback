import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { normalizeText } from '../../../shared/utils/common-utils';

/** 
 * DTO para la realizacion de preguntas
 */
export class QuestionDto{
    @ApiProperty({
    description: 'Pregunta frecuente del usuario',
    example: 'Puedo llevar mascotas',
  })
  @IsString({ message: 'El campo $property debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El campo $property no puede estar vacío.' })
  @MaxLength(300, {
    message: 'El campo $property no puede tener más de $constraint1 caracteres.',
  })
  @Transform(({ value }) => normalizeText(value.trim().toLowerCase()))
  readonly question: string;
}
