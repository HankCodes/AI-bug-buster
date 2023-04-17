import { IAiClient } from "../clients/contracts/IAiClient";
import { IAiService } from "./contracts/IAiService";

export class AiService implements IAiService {
    private aiClient: IAiClient;

    constructor(aiClient: IAiClient) {
        this.aiClient = aiClient;
    }

    async getFilesAndPrompts(errorMessage: string): Promise<string> {
        const prompt = this.generatePromptForErrorMessageAnalysis(errorMessage);
        return await this.getAnswer(prompt);
    }

    async getUpdatedFileContent(prompt: string, fileContent: string): Promise<string> {
        const fileUpdatesPrompt = this.generatePromptForFileUpdates(prompt, fileContent);
        return await this.getAnswer(fileUpdatesPrompt);
    }

    private generatePromptForErrorMessageAnalysis(errorMessage: string): string {
        return `
        As a senior developer with great expertise in finding bugs from stacktaces you get the following stacktace:

        ${errorMessage}

        Analyze the stack trace and find in what files the potential bugs may lie. You understand that the response you give will
        be read by a computer so you will respond in the following JSON format:
        [{"fileName": "<name of the file>", "prompt": "<chatGPT prompt>"}]
        If you think that there may be a bug in more than one file, you can add more than one object to the array.

        In the "prompt" property of the object, you will give a prompt to yourself that can be used to instruct you to update the file content.
        `.trim().replace("\n", " ");
    }

    private generatePromptForFileUpdates(prompt: string, fileContent: string): string {
        return `Given this file content: ${fileContent}, ${prompt}, The response you give must be the whole file content with the changes you want to make and nothing else.`
    }

    private async getAnswer(prompt: string): Promise<string> {

        const completion = await this.aiClient.createCompletion(prompt);

        console.log("\n\ncompletion", completion.data, "\n\n");
        console.log("\n\nfinish_reason: ", completion.data.choices[0].finish_reason, "\n\n");

        return completion.data.choices[0].text || "";
    }
}