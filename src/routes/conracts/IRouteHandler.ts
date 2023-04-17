import { Express } from 'express';

export interface IRouteHandler {
    installRoutes(app: Express): Express
}
