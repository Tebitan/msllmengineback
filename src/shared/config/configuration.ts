/**
 * Configuracion de variables de entorno
 */
export default () => ({
    port: parseInt(process.env.PORT ?? '8080', 10),
    globalTimeoutMs: parseInt(process.env.GLOBAL_TIMEOUT_MS ?? '5000', 10),
    restTimeout: parseInt(process.env.REST_TIMEOUT ?? '2000', 10),
    topic: process.env.TOPIC,
    enpointFaqs: process.env.OCP_ENDPOINT_GET_FAQS,    
    aiApiKey: process.env.AI_API_KEY,
    aiBaseUrl: process.env.AI_BASE_URL || '',
    aiTimeout: parseInt(process.env.AI_TIMEOUT ?? '2000', 10),
    aiModel: process.env.AI_MODEL || 'llama-3.1-8b-instant',
    aiSystemPrompt: process.env.AI_SYSTEM_PROMPT || '',
    aiMaxTokens: parseInt(process.env.AI_MAX_TOKENS ?? '512', 10),
    aiTemperature: parseInt(process.env.AI_TEMPERATURE ?? '0.7', 10),
    aiTopP: parseInt(process.env.AI_TOP_P ?? '1', 10),
    aiPresencePenalty: parseInt(process.env.AI_PRESENCE_PENALTY ?? '0.1', 10),
    aiFrequencyPenalty: parseInt(process.env.AI_FREQUENCY_PENALTY ?? '0.1', 10),
    cacheTtl:parseInt(process.env.CACHE_TTL ?? '0', 10),
});
