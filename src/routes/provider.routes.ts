import { Router } from 'express';
import * as providerController from '../controllers/provider.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', adminMiddleware, providerController.createProvider);
router.get('/', providerController.getProviders);
router.get('/:id', providerController.getProviderById);
router.put('/:id', adminMiddleware, providerController.updateProvider);
router.delete('/:id', adminMiddleware, providerController.deleteProvider);

export default router;

