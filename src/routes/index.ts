import { Router } from 'express';
import authRoutes from './auth.routes';
import clientRoutes from './client.routes';
import providerRoutes from './provider.routes';
import importRoutes from './import.routes';
import exportRoutes from './export.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/providers', providerRoutes);
router.use('/import', importRoutes);
router.use('/export', exportRoutes);

router.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

export default router;

