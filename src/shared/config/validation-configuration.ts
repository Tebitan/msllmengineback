import * as Joi from 'joi';

/**
 * Realiza la validacion de existencia de las variables de entorno 
 */
export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  GLOBAL_TIMEOUT_MS: Joi.number().required(),
  TOPIC: Joi.string().required(),
  REST_TIMEOUT: Joi.number().required(),
  OCP_ENDPOINT_GET_FAQS:Joi.string().required(),
  AI_API_KEY: Joi.string().required(),
  AI_TIMEOUT: Joi.number().required(),
  AI_MODEL: Joi.string().required(),
  AI_SYSTEM_PROMPT: Joi.string().required(),
  AI_MAX_TOKENS: Joi.number().required(),
  AI_TEMPERATURE: Joi.number().required(),
  AI_TOP_P: Joi.number().required(),
  AI_PRESENCE_PENALTY: Joi.number().required(),
  AI_FREQUENCY_PENALTY: Joi.number().required(),
  CACHE_TTL:Joi.number().required(),
});
