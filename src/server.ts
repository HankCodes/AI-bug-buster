import express, { ErrorRequestHandler, json, Request, Response } from 'express';
import WebhookController from './controllers/webhookController';
import { WebhookRouter } from './routes/webhookRoutes';
import dotenv from 'dotenv';

dotenv.config()
const app = express();
const port = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((err: ErrorRequestHandler, req: any, res: any, next: any) => {
  if (err instanceof SyntaxError && 'body' in err) {
    // JSON parse error
    console.log(err);

    res.status(400).json({ error: 'Invalid JSON' });
  } else {
    next();
  }
});
const webhookRouter = new WebhookRouter(new WebhookController())
webhookRouter.installRoutes(app)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
