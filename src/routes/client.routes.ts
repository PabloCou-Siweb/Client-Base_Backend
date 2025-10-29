import { Router } from 'express';
import * as clientController from '../controllers/client.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', clientController.createClient);
router.get('/', clientController.getClients);
router.get('/:id', clientController.getClientById);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);
router.post('/delete-multiple', clientController.deleteMultipleClients);

export default router;

