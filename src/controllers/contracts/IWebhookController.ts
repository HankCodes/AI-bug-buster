
import { Request, Response } from 'express';

export interface IWebhookController {
    receiveWebhook(req: Request, res: Response): void
}
