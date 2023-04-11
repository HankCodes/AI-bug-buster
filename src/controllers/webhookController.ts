
import { Request, Response } from 'express';
import { WebhookRequest } from '../data/request/WebhookRequest';
import { IWebhookController } from './contracts/IWebhookController';

export default class WebhookController implements IWebhookController {

    receiveWebhook(req: Request, res: Response): void {
      try {
        const body: WebhookRequest = req.body
        console.log('the body:', body.payload.charAt(4));


        res.json({ status: 'ok' })
      } catch (error) {
        console.log("here I am");

        res.status(500).json({ status: 'error', error: "bo" })
      }
    }
}
