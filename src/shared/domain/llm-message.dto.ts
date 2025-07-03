export type MessageContent = {
  type: 'text';
  text: { value: string };
};

export type MessageRole = 'user' | 'assistant' | 'system';

export type AssistantMessage = {
  role: MessageRole;
  content: MessageContent[];
};

export interface ChatCompletionOptions {
  max_tokens: number;
  temperature: number;
  top_p: number;
  presence_penalty: number;
  frequency_penalty: number;
}

