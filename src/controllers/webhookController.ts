
import { Request, Response } from 'express';
import { WebhookRequest } from '../data/request/WebhookRequest';
import { IAiService } from '../services/contracts/IAiService';
import { FileService } from '../services/FileService';
import { IWebhookController } from './contracts/IWebhookController';

export default class WebhookController implements IWebhookController {
  private ai: IAiService;
  private fileService: FileService;

  constructor(aiService: IAiService, fileService: FileService) {
    this.ai = aiService;
    this.fileService = fileService;
  }

  async receiveWebhook(req: Request, res: Response): Promise<void> {
    try {
      const body: WebhookRequest = req.body

      const filesToUpdate = await this.getFilesToUpdate(body.payload)
      await this.updateFiles(filesToUpdate)

      res.json({ status: 'ok' })
    } catch (error: any) {
      console.log("error", error);

      res.status(500).json({ status: 'error', error: error.message || "boo" })
    }
  }

  private getFilesToUpdate = async (errorMessage: string): Promise<[{ fileName: string, prompt: string }]> => {
    const filesAndPrompts = await this.ai.getFilesAndPrompts(errorMessage)
    console.log("The files to update and the corresponding prompts", filesAndPrompts);

    return JSON.parse(filesAndPrompts)
  }

  private updateFiles = async (prompts: [{ fileName: string, prompt: string }]) => {
    prompts.forEach(async (item) => {
      const file = await this.fileService.search("src", item.fileName)

      if (file) {
        const fileContent = await this.fileService.getContent(file)
        const chatGPTChanges = await this.ai.getUpdatedFileContent(item.prompt, fileContent)

        console.log(`Changes to be applied to the file ${file}: \n\n`, chatGPTChanges);
        this.fileService.replaceContent(file, chatGPTChanges.trim())
      } else {
        console.log("file not found: ", item.fileName);
      }
    })
  }
}
