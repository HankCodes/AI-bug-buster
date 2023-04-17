
import express, { Express, ErrorRequestHandler, json, Request, Response } from 'express';
import ChatGptClient from './clients/ChatGptClient';
import WebhookController from './controllers/webhookController';
import { WebhookRouter } from './routes/webhookRoutes';
import { AiService } from './services/aiService';

export class Setup {
    private port: number;
    private app: Express;

    constructor(port: number) {
        this.port = port;
        this.app = express()
    }

    public addMiddlewares(): Setup {


        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))

        this.app.use((err: ErrorRequestHandler, req: any, res: any, next: any) => {
            if (err instanceof SyntaxError && 'body' in err) {
                // JSON parse error
                console.log(err);

                res.status(400).json({ error: 'Invalid JSON' });
            } else {
                next();
            }
        });

        return this
    }

    public addRoutes(): Setup {

        // TODO: Decide on dependency injection framework?
        const aiclient = new ChatGptClient(process.env.OPENAI_API_KEY || "key", "text-davinci-003")
        const ai = new AiService(aiclient)
        const controller = new WebhookController(ai)

        const webhookRouter = new WebhookRouter(controller)
        this.app = webhookRouter.installRoutes(this.app)

        return this
    }

    public start(): void {

        this.app.listen(this.port, () => {
            console.log(`Server started on port ${this.port}`);
        })
    }
}