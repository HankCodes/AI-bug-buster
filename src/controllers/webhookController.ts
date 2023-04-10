
import { Request, Response } from 'express';
import { WebhookRequest } from '../data/request/WebhookRequest';
import { IWebhookController } from './contracts/IWebhookController';

export default class WebhookController implements IWebhookController {

    receiveWebhook(req: Request, res: Response): void {
      try {
        const body: WebhookRequest = req.body
        console.log('the body:', body);

        res.sendStatus(200)
      } catch (error) {
        res.sendStatus(500)
      }
    }
}
