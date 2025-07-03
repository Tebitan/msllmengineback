import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { IAssistantProvider } from './interfaces/assistant-provider.interface';
import { AssistantMessage, ChatCompletionOptions } from '../../domain/llm-message.dto';

/**
 * Adaptador que implementa la interfaz `AssistantAdapter` utilizando el SDK de OpenAI
 * compatible con Groq. Permite crear hilos y ejecutar mensajes contra un assistant.
 */
@Injectable()
export class AssistantProvider implements IAssistantProvider {
    private readonly client: OpenAI;
    private readonly model: string;
    private readonly options: ChatCompletionOptions;

    constructor(apiKey: string, baseURL: string, timeout: number, model: string, options: ChatCompletionOptions) {
        this.model = model;
        this.options = options;
        this.client = new OpenAI({
            apiKey,
            baseURL,
            timeout
        });
    }

    /**
     * chatCompletion
     * @description Ejecuta una respuesta directa del modelo usando chat.completions.
     * @param messages Historial completo del chat (incluye roles: system, user, assistant)
     * @param model Modelo a utilizar (por defecto GPT-3.5 o superior)
     * @returns AssistantMessage[]
     */
    async chatCompletion(messages: { role: 'system' | 'user' | 'assistant'; content: string; }[]): Promise<AssistantMessage[]> {
        const response = await this.client.chat.completions.create({
            model: this.model,
            messages,
            ...this.options
        });
        const content = response.choices[0]?.message?.content ?? '';
        const assistantReply: AssistantMessage = {
            role: 'assistant',
            content: [
                {
                    type: 'text',
                    text: { value: content }
                }
            ]
        };
        const mappedMessages: AssistantMessage[] = messages.map(m => ({
            role: m.role,
            content: [
                {
                    type: 'text',
                    text: { value: m.content }
                }
            ]
        }));
        return [...mappedMessages, assistantReply];
    }
}