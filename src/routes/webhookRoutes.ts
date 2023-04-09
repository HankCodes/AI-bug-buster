import { Router } from 'express';
import { baseController } from '../controllers/baseController';

const router = Router();

router.post('/webhook', baseController);

export default router;