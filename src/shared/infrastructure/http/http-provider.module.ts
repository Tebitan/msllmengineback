import { Module } from '@nestjs/common';
import { HttpProvider } from './rest-http-provider.service';

/**
 * Modulo encargado de la comunicacion HTTP REST
 */
@Module({
  providers: [HttpProvider],
  exports: [HttpProvider],
})
export class HttpProviderModule {}