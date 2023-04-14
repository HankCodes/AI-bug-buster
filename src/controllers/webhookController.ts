
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

      // Ask chatGPT about error message
      const answer = [
        {
          filenName: "testFile.js",
          prompt: "can you find the error in this file and update the content accordin to you suggestions.",
        },
        // {
        //   filenName: "testFile2.js",
        //   prompt: "Error description from chatGPT with potential changes",
        // }
      ]
      answer.forEach(async (item) => {
        const file = await fileService.search("src", item.filenName)

        if (file) {
          const fileContent = await fileService.getContent(file)

          const ai = new AiService({ apiKey: process.env.OPENAI_API_KEY || "key", model: "text-davinci-003" })

          const prompt = ai.generatePrompt(item.prompt, fileContent)
          console.log("prompt", prompt);

          const chatGPTChanges = await ai.getAnswer(prompt)

          console.log("chatGPTChanges", chatGPTChanges);

          fileService.replaceFileContent(file, chatGPTChanges)
        }
      })


      res.json({ status: 'ok' })
    } catch (error) {
      console.log("here I am");

      res.status(500).json({ status: 'error', error: "bo" })
    }
  }
}
