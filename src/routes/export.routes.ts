import { Router } from 'express';
import * as exportController from '../controllers/export.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', exportController.exportClients);

export default router;

