
import express, { Express, ErrorRequestHandler } from 'express';
import ChatGptClient from './clients/ChatGptClient';
import WebhookController from './controllers/webhookController';
import { WebhookRouter } from './routes/webhookRoutes';
import { AiService } from './services/AiService';
import { BugBusterService } from './services/BugBusterService';
import { FileService } from "./services/FileService";

export class Setup {
    private port: number;
    private app: Express;
    private openApiKey: string;
    private repositoryLocation: string;

    constructor(port: number) {
        if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not set");
        if (!process.env.REPOSITORY_LOCAL_LOCATION) throw new Error("REPOSITORY_LOCAL_LOCATION not set");

        this.repositoryLocation = process.env.REPOSITORY_LOCAL_LOCATION
        this.openApiKey = process.env.OPENAI_API_KEY
        this.port = port;
        this.app = express();
    }

    public addMiddlewares(): Setup {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))

        this.app.use((err: ErrorRequestHandler, req: any, res: any, next: any) => {
            // TODO: Improvable error handling
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

        const aiclient = new ChatGptClient({ apiKey: this.openApiKey })
        const ai = new AiService(aiclient)
        const fileService = new FileService()
        const bugBusterService = new BugBusterService(ai, fileService, this.repositoryLocation)
        const controller = new WebhookController(bugBusterService)
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