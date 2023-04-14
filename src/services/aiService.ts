import { Configuration, OpenAIApi } from "openai"

export type AiServiceConfig = {
    apiKey: string | "text-davinci-003";
    model: string;
}

export class AiService {
    private config: AiServiceConfig;

    constructor(config: AiServiceConfig) {
        this.config = config;
    }

    generatePrompt = (prompt: string, fileContent: string) => {
        return `Given this file content: ${fileContent}, ${prompt}`
    }

    async getAnswer(prompt: string): Promise<string> {
        const configuration = new Configuration({
            apiKey: this.config.apiKey,
        });

        const openai = new OpenAIApi(configuration);

        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.6,
        });

        console.log("completion", completion.data);

        return completion.data.choices[0].text || "";
    }
}