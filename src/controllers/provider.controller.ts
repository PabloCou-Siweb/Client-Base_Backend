import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as providerService from '../services/provider.service';

export const createProvider = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: 'El nombre es requerido' });
      return;
    }

    const provider = await providerService.createProvider(name);
    res.status(201).json(provider);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getProviders = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const providers = await providerService.getProviders();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getProviderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const provider = await providerService.getProviderById(req.params.id);
    res.json(provider);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const updateProvider = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: 'El nombre es requerido' });
      return;
    }

    const provider = await providerService.updateProvider(req.params.id, name);
    res.json(provider);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteProvider = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await providerService.deleteProvider(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

