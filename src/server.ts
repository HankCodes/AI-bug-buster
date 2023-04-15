import express, { ErrorRequestHandler, json, Request, Response } from 'express';
import WebhookController from './controllers/webhookController';
import { WebhookRouter } from './routes/webhookRoutes';
import dotenv from 'dotenv';
import { verifyIsEqual } from './data/request/testFile';

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

// verifyIsEqual(4)

// console.log(JSON.stringify(`/Users/henrikholstad/development/private/AI-auto-pull-request/src/data/request/testFile.ts:3
//     if (a > 200) throw Error("cant be greater than 200")
//                        ^
// Error: cant be greater than 200
//     at isEqual (/Users/henrikholstad/development/private/AI-auto-pull-request/src/data/request/testFile.ts:3:24)
//     at verifyIsEqual (/Users/henrikholstad/development/private/AI-auto-pull-request/src/data/request/testFile.ts:8:20)
//     at Object.<anonymous> (/Users/henrikholstad/development/private/AI-auto-pull-request/src/server.ts:30:14)
//     at Module._compile (node:internal/modules/cjs/loader:1101:14)
//     at Module.m._compile (/Users/henrikholstad/development/private/AI-auto-pull-request/node_modules/ts-node/src/index.ts:1618:23)
//     at Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
//     at Object.require.extensions.<computed> [as .ts] (/Users/henrikholstad/development/private/AI-auto-pull-request/node_modules/ts-node/src/index.ts:1621:12)
//     at Module.load (node:internal/modules/cjs/loader:981:32)
//     at Function.Module._load (node:internal/modules/cjs/loader:822:12)
//     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)`));
