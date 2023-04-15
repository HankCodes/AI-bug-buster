
import { Request, Response } from 'express';
import { WebhookRequest } from '../data/request/WebhookRequest';
import { AiService } from '../services/aiService';
import { fileService } from '../services/fileService';
import { IWebhookController } from './contracts/IWebhookController';

export default class WebhookController implements IWebhookController {

  async receiveWebhook(req: Request, res: Response): Promise<void> {
    try {
      const body: WebhookRequest = req.body
      console.log('the body:', body.payload);

      const ai = new AiService({ apiKey: process.env.OPENAI_API_KEY || "key", model: "text-davinci-003" })

      const filesToUpdate = await getFilesToUpdate(ai, body.payload)

      await updateFiles(ai, filesToUpdate)

      res.json({ status: 'ok' })
    } catch (error: any) {
      console.log("here I am");

      res.status(500).json({ status: 'error', error: error.message || "boo" })
    }
  }
}

const getFilesToUpdate = async (ai: AiService, errorMessage: string): Promise<[{ fileName: string, prompt: string }]> => {
  const prompt = ai.generatePromptForErrorMessageAnalysis(errorMessage)
  const filesAndPrompts = (await ai.getAnswer(prompt)).trim().replace("\n", "")
  console.log("getFilesToUpdate filesAndPrompts", filesAndPrompts);

  return JSON.parse(filesAndPrompts.trim().replace("\n", ""))
}

const updateFiles = async (ai: AiService, prompts: [{ fileName: string, prompt: string }]) => {
  prompts.forEach(async (item) => {
    const file = await fileService.search("src", item.fileName)

    if (file) {
      const fileContent = await fileService.getContent(file)


      const prompt = ai.generatePromptForFileUpdates(item.prompt, fileContent)
      console.log("updateFiles prompt", prompt);

      const chatGPTChanges = await ai.getAnswer(prompt)

      console.log("updateFiles  chatGPTChanges", chatGPTChanges);

      // fileService.replaceFileContent(file, chatGPTChanges)
    }
  })

}
