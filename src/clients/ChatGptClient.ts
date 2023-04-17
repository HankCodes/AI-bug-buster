
import { Configuration, CreateCompletionResponse, OpenAIApi } from "openai"
import { IAiClient } from "./contracts/IAiClient";

export default class ChatGptClient implements IAiClient {
    private aiClient: OpenAIApi;

    // TODO: make this configurable through envs and pass to constructor or function calls?
    private model: string;
    private temperature: number = 0.6;
    private maxTokens: number = 200;

    constructor(apiKey: string, model: string = "text-davinci-003") {
        this.model = model;

        this.aiClient = new OpenAIApi(new Configuration({
            apiKey: apiKey,
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