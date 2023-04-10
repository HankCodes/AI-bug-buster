import { Router, Express } from 'express';
import { IWebhookController } from '../controllers/contracts/IWebhookController';
import { IRouteHandler } from './conracts/IRouteHandler';



export class WebhookRouter implements IRouteHandler {
    private controller: IWebhookController

    constructor(controller: IWebhookController) {
        this.controller = controller
    }

    installRoutes(app: Express) {
        const router = Router()

        router.post('/webhook', this.controller.receiveWebhook);

        app.use(router)
    }
}
