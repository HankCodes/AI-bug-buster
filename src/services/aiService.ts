import { Configuration, OpenAIApi } from "openai"

export type AiServiceConfig = {
    apiKey: string;
    model: string | "text-davinci-003";
}

export class AiService {
    private config: AiServiceConfig;
    private openai: OpenAIApi;

    constructor(config: AiServiceConfig) {
        this.config = config;

        const configuration = new Configuration({
            apiKey: this.config.apiKey,

        });

        this.openai = new OpenAIApi(configuration);
    }

    generatePrompt = (prompt: string, fileContent: string) => {
        return `Given this file content: ${fileContent}, ${prompt}`
    }

    async getAnswer(prompt: string): Promise<string> {

        const completion = await this.openai.createCompletion({
            model: this.config.model,
            prompt: prompt,
            temperature: 0.6,
            max_tokens: 100,
        });

        console.log("\n\ncompletion", completion.data, "\n\n");
        console.log("\n\nfinish_reason: ", completion.data.choices[0].finish_reason, "\n\n");

        return completion.data.choices[0].text || "";
    }
}