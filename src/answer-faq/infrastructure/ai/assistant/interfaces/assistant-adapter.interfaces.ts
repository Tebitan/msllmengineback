import { AssistantMessage } from "../../../../../shared/domain/llm-message.dto";

export abstract class IAssistantAdapter {
    abstract runRag(question:string, answer: string): Promise<AssistantMessage[]>
}