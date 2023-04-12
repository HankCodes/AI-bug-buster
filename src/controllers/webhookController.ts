
import { Request, Response } from 'express';
import { WebhookRequest } from '../data/request/WebhookRequest';
import { fileService } from '../services/fileService';
import { IWebhookController } from './contracts/IWebhookController';

export default class WebhookController implements IWebhookController {

  async receiveWebhook(req: Request, res: Response): Promise<void> {
    try {
      const body: WebhookRequest = req.body
      console.log('the body:', body.payload.charAt(4));

      const file = await fileService.search("src", "testFile.js")
      if (file) {
        const fileContent = await fileService.getContent(file)
        const chatGPTChanges = fileContent + `"Changes from chatGPT with random number: "` + Math.random()
        fileService.replaceFileContent(file, chatGPTChanges)
      }

      res.json({ status: 'ok' })
    } catch (error) {
      console.log("here I am");

      res.status(500).json({ status: 'error', error: "bo" })
    }
  }
}
