import { Router } from 'express';
import * as importController from '../controllers/import.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', upload.single('file'), importController.importClients);

export default router;

