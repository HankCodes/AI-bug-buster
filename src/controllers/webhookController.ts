import { Request, Response } from 'express';

const webhookController = {
  receiveWebhook: (_req: Request, res: Response) => {
    res.send('Hello, world!')
  }
}

export default webhookController
