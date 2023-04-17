import { CreateCompletionResponse } from "openai";


export interface IAiClient {
    // TODO: make the return type simpler?
    createCompletion(prompt: string): Promise<import("axios").AxiosResponse<CreateCompletionResponse, any>>
}