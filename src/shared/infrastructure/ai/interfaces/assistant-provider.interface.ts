import { AssistantMessage } from "../../../domain/llm-message.dto";

export interface IAssistantProvider {

    /**
     * chatCompletion
     * @description Ejecuta una respuesta directa del modelo usando chat.completions.
     *
     * @param messages Historial completo del chat (incluye roles: system, user, assistant)
     * @param model Modelo a utilizar (por defecto GPT-3.5 o superior)
     * @returns  AssistantMessage[]
    */
    chatCompletion(
        messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
    ): Promise<AssistantMessage[]>;
}
