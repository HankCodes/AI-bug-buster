import { IAiService } from "./contracts/IAiService";
import { FileService } from "./FileService";

enum Mode {
    ANALYZE = "ANALYZE",
    CODE = "CODE"
}

export class BugBusterService {
    private ai: IAiService;
    private fileService: FileService;
    private repositoryLocation: string;
    public mode: Mode;

    constructor(
        aiService: IAiService,
        fileService: FileService,
        repositoryLocation: string,
        mode: Mode = Mode.CODE,) {
        this.ai = aiService;
        this.fileService = fileService;
        this.repositoryLocation = repositoryLocation;
        this.mode = mode;
    }

    public async analyzeError(errorMessage: string) {
        console.log(`[BugBusterService]: Running in ${this.mode} mode, will analyze the error and give a written explanation of a solution`);
        const filesAndPrompts = await this.ai.getFilesAndPrompts(errorMessage)
        console.log("[BugBusterService]: The files to update and the corresponding prompts", filesAndPrompts);
    }

    public async bustTheBugs(errorMessage: string) {
        console.log(`[BugBusterService]: Running in ${this.mode} mode, will create a PR with the changes`);

        const filesAndPrompts = await this.ai.getFilesAndPrompts(errorMessage)
        console.log("[BugBusterService]: The files to update and the corresponding prompts", filesAndPrompts);

        await this.updateFiles(filesAndPrompts)
    }

    private updateFiles = async (prompts: [{ fileName: string, prompt: string }]) => {
        await Promise.all(prompts.map(async (item) => {
            // const fileName = this.fileService.getFileNameFomPath(item.fileName);
            // if (!fileName) return console.log("[BugBusterService]: Filename not resolved: ", item.fileName)

            // const file = await this.fileService.search(this.repositoryLocation, fileName)
            // if (!file) return console.log("[BugBusterService]: File not found: ", fileName);

            // const fileContent = await this.fileService.getContent(file)
            const file = await this.getFile(item.fileName)
            if (!file) return

            const chatGPTChanges = await this.ai.getUpdatedFileContent(item.prompt, file.content)

            console.log(`[BugBusterService]: Changes to be applied to the file ${file}: \n\n`, chatGPTChanges);
            this.fileService.replaceContent(file.path, chatGPTChanges.trim())

        }))
    }

    private async getFile(fileName: string): Promise<{ path: string, content: string } | null> {
        const extractedFileName = this.fileService.getFileNameFomPath(fileName);
        if (!extractedFileName) {
            console.log("[BugBusterService]: Filename not resolved: ", fileName)
            return null
        }

        const pathToFile = await this.fileService.search(this.repositoryLocation, extractedFileName)
        if (!pathToFile) {
            console.log("[BugBusterService]: File not found: ", extractedFileName);
            return null
        }

        const fileContent = await this.fileService.getContent(pathToFile)
        if (!fileContent) {
            console.log("[BugBusterService]: Could not extract content from file: ", pathToFile);
            return null
        }

        return {
            path: pathToFile,
            content: fileContent
        }
    }
}
