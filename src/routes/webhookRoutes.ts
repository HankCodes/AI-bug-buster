import { Router } from 'express';
import webhookController from '../controllers/webhookController';

const webhookRouter = Router();

webhookRouter.post('/webhook', webhookController.receiveWebhook);

export default webhookRouter;
