
import { Configuration, CreateCompletionResponse, OpenAIApi } from "openai"
import { IAiClient } from "./contracts/IAiClient";

export type ChatGptClientConfig = {
    apiKey: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
}

export default class ChatGptClient implements IAiClient {
    private aiClient: OpenAIApi;

    private model: string;
    private temperature: number;
    private maxTokens: number;

    constructor(config: ChatGptClientConfig) {
        this.model = config.model || "text-davinci-003";
        this.maxTokens = config.maxTokens || 300;
        this.temperature = config.temperature || 0.6;

        this.aiClient = new OpenAIApi(new Configuration({
            apiKey: config.apiKey,
        }));
    }

    async createCompletion(prompt: string): Promise<import("axios").AxiosResponse<CreateCompletionResponse, any>> {
        return (await this.aiClient.createCompletion({
            model: this.model,
            prompt: prompt,
            temperature: this.temperature,
            max_tokens: this.maxTokens,
        }));
    }
}