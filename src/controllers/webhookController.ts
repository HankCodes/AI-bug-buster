
import { Request, Response } from 'express';
import { WebhookRequest } from '../data/request/WebhookRequest';
import { BugBusterService } from '../services/BugBusterService';
import { IWebhookController } from './contracts/IWebhookController';

export default class WebhookController implements IWebhookController {
  private bugBusterService: BugBusterService;

  constructor(bugBusterService: BugBusterService) {
    this.bugBusterService = bugBusterService;
  }

  async receiveWebhook(req: Request, res: Response): Promise<void> {
    try {
      const body: WebhookRequest = req.body

      if (!body.payload) throw new Error("No payload found in the request body");

      this.bugBusterService.bustTheBugs(body.payload)

      // const filesAndPrompts = await this.ai.getFilesAndPrompts(body.payload)
      // console.log("The files to update and the corresponding prompts", filesAndPrompts);
      // await this.updateFiles(filesAndPrompts)

      res.json({ status: 'ok' })
    } catch (error: any) {
      console.log("error", error);

      res.status(500).json({ status: 'error', error: error.message || "boo" })
    }
  }

  // private updateFiles = async (prompts: [{ fileName: string, prompt: string }]) => {
  //   prompts.forEach(async (item) => {
  //     const file = await this.fileService.search(this.repositoryLocation, item.fileName)
  //     if (!file) {
  //       return console.log("file not found: ", item.fileName);
  //     }

  //     const fileContent = await this.fileService.getContent(file)
  //     const chatGPTChanges = await this.ai.getUpdatedFileContent(item.prompt, fileContent)

  //     console.log(`Changes to be applied to the file ${file}: \n\n`, chatGPTChanges);
  //     this.fileService.replaceContent(file, chatGPTChanges.trim())
  //   })
  // }
}
