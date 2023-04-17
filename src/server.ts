import dotenv from 'dotenv';
import { Setup } from './Setup';

dotenv.config()

const port = 3000;
new Setup(port)
    .addMiddlewares()
    .addRoutes()
    .start()
