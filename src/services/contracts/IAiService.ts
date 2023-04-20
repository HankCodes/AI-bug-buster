

export interface IAiService {

    getFilesAndPrompts(errorMessage: string): Promise<[{ fileName: string, prompt: string }]>
    getUpdatedFileContent(prompt: string, fileContent: string): Promise<string>
}