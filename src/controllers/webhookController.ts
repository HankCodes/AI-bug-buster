
import { Request, Response } from 'express';
import { IWebhookController } from './contracts/IWebhookController';

export default class WebhookController implements IWebhookController {

    receiveWebhook(req: Request, res: Response): void {
      res.json({ message: "Hi" })
    }
}
