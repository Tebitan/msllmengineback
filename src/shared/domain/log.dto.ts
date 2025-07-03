export interface LogMetadata {
  legacy?: string;
  request?: any;
  response?: any;
  processingTime?: number;
  transactionId?: string;
  context?: string;
}