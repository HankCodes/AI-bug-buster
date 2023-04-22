import { IAiService } from "./contracts/IAiService";
import { FileService } from "./FileService";

export class BugBusterService {
    private ai: IAiService;
    private fileService: FileService;
    private repositoryLocation: string;

    constructor(aiService: IAiService, fileService: FileService, repositoryLocation: string) {
        this.ai = aiService;
        this.fileService = fileService;
        this.repositoryLocation = repositoryLocation;
    }

    public async bustTheBugs(errorMessage: string) {

        const filesAndPrompts = await this.ai.getFilesAndPrompts(errorMessage)
        console.log("The files to update and the corresponding prompts", filesAndPrompts);

        await this.updateFiles(filesAndPrompts)
    }

    private updateFiles = async (prompts: [{ fileName: string, prompt: string }]) => {
        prompts.forEach(async (item) => {
            const file = await this.fileService.search(this.repositoryLocation, item.fileName)
            if (!file) {
                return console.log("file not found: ", item.fileName);
            }

            const fileContent = await this.fileService.getContent(file)
            const chatGPTChanges = await this.ai.getUpdatedFileContent(item.prompt, fileContent)

            console.log(`Changes to be applied to the file ${file}: \n\n`, chatGPTChanges);
            this.fileService.replaceContent(file, chatGPTChanges.trim())
        })
    }
}
