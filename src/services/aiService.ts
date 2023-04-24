import { IAiClient } from "../clients/contracts/IAiClient";
import { PromptFactory } from "../factories/PromptFactry";
import { IAiService } from "./contracts/IAiService";

export class AiService implements IAiService {
    private aiClient: IAiClient;

    constructor(aiClient: IAiClient) {
        this.aiClient = aiClient;
    }

    async getFilesAndPrompts(errorMessage: string): Promise<[{ fileName: string, prompt: string }]> {
        const prompt = PromptFactory.analyzeErrorPrompt(1)(errorMessage);
        console.log("[AiService]: Analyze error prompt:\n", prompt);

        let answer = await this.askAi(prompt);
        if (answer.includes("Answer: ")) {
            answer = answer.split("Answer: ")[1].trim();
        }
        console.log("[AiService]: Answer:\n", answer);
        return JSON.parse(answer)
    }

    async getUpdatedFileContent(prompt: string, fileContent: string): Promise<string> {

        const fileUpdatesPrompt = PromptFactory.fileUpdatePrompt(1)(prompt, fileContent);
        console.log("[AiService]: File updates prompt:\n", fileUpdatesPrompt);

        return await this.askAi(fileUpdatesPrompt);
    }

    private async askAi(prompt: string): Promise<string> {

        const completion = await this.aiClient.createCompletion(prompt);

        // console.log("\n\ncompletion", completion.data, "\n\n");
        console.log("\n[AiService]: finish_reason: ", completion.data.choices[0].finish_reason, "\n");

        return completion.data.choices[0].text || "";
    }
}