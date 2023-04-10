import express from 'express';
import WebhookController from './controllers/webhookController';
import { WebhookRouter } from './routes/webhookRoutes';

const app = express();
const port = 3000;

const webhookRouter = new WebhookRouter(new WebhookController())

webhookRouter.installRoutes(app)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
