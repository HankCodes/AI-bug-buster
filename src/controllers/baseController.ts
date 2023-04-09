import { Request, Response } from 'express';

export const baseController = (req: Request, res: Response) => {
  res.send('Hello, world!');
};
