import { Scope } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

/**
 * Implementacion que Maneja la asignacion de TransactionId 
 */
export const TransactionIdProvider = {
  provide: 'TransactionId',
  useFactory: () => uuidv4(),
  scope: Scope.REQUEST,
};
