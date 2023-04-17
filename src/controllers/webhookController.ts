
import { Request, Response } from 'express';
import { WebhookRequest } from '../data/request/WebhookRequest';
import { IAiService } from '../services/contracts/IAiService';
import { fileService } from '../services/fileService';
import { IWebhookController } from './contracts/IWebhookController';

export default class WebhookController implements IWebhookController {
  private ai: IAiService;

  constructor(aiService: IAiService) {
    this.ai = aiService;

  }

  async receiveWebhook(req: Request, res: Response): Promise<void> {
    try {
      const body: WebhookRequest = req.body

      const filesToUpdate = await getFilesToUpdate(this.ai, body.payload)

      await updateFiles(this.ai, filesToUpdate)

      res.json({ status: 'ok' })
    } catch (error: any) {
      console.log("error", error);

      res.status(500).json({ status: 'error', error: error.message || "boo" })
    }
  }
}

const getFilesToUpdate = async (ai1: IAiService, errorMessage: string): Promise<[{ fileName: string, prompt: string }]> => {
  const prompt = ai1.generatePromptForErrorMessageAnalysis(errorMessage)
  const filesAndPrompts = (await ai1.getAnswer(prompt)).trim().replace("\n", "")
  console.log("getFilesToUpdate filesAndPrompts", filesAndPrompts);

  return filesAndPrompts as unknown as [{ fileName: string, prompt: string }] // TODO: fix thi
}

const updateFiles = async (ai2: IAiService, prompts: [{ fileName: string, prompt: string }]) => {
  prompts.forEach(async (item) => {
    const file = await fileService.search("src", item.fileName)

    if (file) {
      const fileContent = await fileService.getContent(file)


      const prompt = ai2.generatePromptForFileUpdates(item.prompt, fileContent)
      console.log("updateFiles prompt", prompt);

      const chatGPTChanges = await ai2.getAnswer(prompt)

      console.log("updateFiles  chatGPTChanges", chatGPTChanges);

      fileService.replaceFileContent(file, chatGPTChanges)
    } else {
      console.log("file not found: ", item.fileName);

    }
  })

}
