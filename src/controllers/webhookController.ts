
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

      res.json({ status: 'ok' })
    } catch (error: any) {
      console.log("error", error);

      res.status(500).json({ status: 'error', error: error.message || "boo" })
    }
  }
}
