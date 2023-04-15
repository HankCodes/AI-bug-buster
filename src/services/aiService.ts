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

    generatePromptForErrorMessageAnalysis = (errorMessage: string) => {
        return `
        Given this error message: ${errorMessage},
        can you locate the files that are causing this error and give a
        prompt to yourself that can be used to instruct you to update the file content,
        the instruction on what to change needs to be crystal clear.
        respond in the following format:
        [{"fileName": "nameOfFile.js", "prompt": "can you find the error in this file and update the content accordin to you suggestions."}]`.trim().replace("\n", " ")
    }

    generatePromptForFileUpdates = (prompt: string, fileContent: string) => {
        return `Given this file content: ${fileContent}, ${prompt}, The resonse you give must be the whole file content with the changes you want to make and nothing else.`
    }

    async getAnswer(prompt: string): Promise<string> {

        const completion = await this.openai.createCompletion({
            model: this.config.model,
            prompt: prompt,
            temperature: 0.6,
            max_tokens: 200,
        });

        console.log("\n\ncompletion", completion.data, "\n\n");
        console.log("\n\nfinish_reason: ", completion.data.choices[0].finish_reason, "\n\n");

        return completion.data.choices[0].text || "";
    }
}