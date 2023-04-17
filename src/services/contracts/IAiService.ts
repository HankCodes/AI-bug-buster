

export interface IAiService {

    generatePromptForFileUpdates(prompt: string, fileContent: string): string
    generatePromptForErrorMessageAnalysis(errorMessage: string): string
    getAnswer(prompt: string): Promise<string>
}