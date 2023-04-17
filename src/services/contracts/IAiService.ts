

export interface IAiService {

    getFilesAndPrompts(errorMessage: string): Promise<string>
    getUpdatedFileContent(prompt: string, fileContent: string): Promise<string>
}