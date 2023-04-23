
import { CreateCompletionResponse } from "openai";
import { IAiClient } from "./contracts/IAiClient";

export class DummyAiClient implements IAiClient {

    async createCompletion(prompt: string): Promise<import("axios").AxiosResponse<CreateCompletionResponse, any>> {
        let response;
        if (prompt.includes("As a senior developer with")) {
            response = JSON.stringify([
                { fileName: "src/dummyFiles/file1.ts", prompt: "Fix the bug" },
                // { fileName: "src/dummyFiles/file2.ts", prompt: "Fix the bug" }
            ])
        } else {
            response = `const a = ${Math.random()};`
        }

        return {
            data: {
                choices: [
                    {
                        text: response
                    }
                ]
            }
        } as import("axios").AxiosResponse<CreateCompletionResponse, any>;
    }
}