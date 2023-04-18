import dotenv from 'dotenv';
import { Setup } from './Setup';

dotenv.config()

const port = 3000;
// Setup could be an interface and we could have a different implementation for testing
new Setup(port)
    .addMiddlewares()
    .addRoutes()
    .start()