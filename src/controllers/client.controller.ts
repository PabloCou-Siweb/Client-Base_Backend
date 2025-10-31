import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as clientService from '../services/client.service';
import { ClientStatus } from '@prisma/client';

export const createClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await clientService.createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const filters: any = {};

    if (req.query.search) {
      const searchValue = (req.query.search as string).trim();
      if (searchValue && searchValue.length <= 100) {
        filters.search = searchValue;
      }
    }

    if (req.query.status) {
      const statusValue = (req.query.status as string).toUpperCase();
      if (statusValue === 'ACTIVE' || statusValue === 'INACTIVE') {
        filters.status = statusValue as ClientStatus;
      }
    }

    if (req.query.providerId) {
      filters.providerId = req.query.providerId as string;
    }

    if (req.query.providerNames) {
      filters.providerNames = req.query.providerNames as string;
    }

    if (req.query.minPrice) {
      filters.minPrice = parseFloat(req.query.minPrice as string);
    }

    if (req.query.maxPrice) {
      filters.maxPrice = parseFloat(req.query.maxPrice as string);
    }

    if (req.query.startDate) {
      const dateStr = req.query.startDate as string;
      filters.startDate = new Date(dateStr + 'T00:00:00Z');
    }

    if (req.query.endDate) {
      const dateStr = req.query.endDate as string;
      filters.endDate = new Date(dateStr + 'T00:00:00Z');
    }

    const result = await clientService.getClients(page, limit, filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getClientById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await clientService.getClientById(req.params.id);
    res.json(client);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const updateClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await clientService.updateClient(req.params.id, req.body);
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await clientService.deleteClient(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const deleteMultipleClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: 'Se requiere un array de IDs' });
      return;
    }

    const result = await clientService.deleteMultipleClients(ids);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

