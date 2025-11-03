import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as exportService from '../services/export.service';
import { ClientStatus } from '@prisma/client';

export const exportClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const format = req.query.format as string || 'excel';

    const filters: any = {};

    if (req.query.search) {
      filters.search = req.query.search as string;
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

    if (req.query.providers) {
      filters.providers = req.query.providers as string;
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

    if (format === 'excel') {
      const buffer = await exportService.exportClientsToExcel(filters);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=clientes.xlsx');
      res.send(buffer);
    } else if (format === 'csv') {
      const buffer = await exportService.exportClientsToCSV(filters);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=clientes.csv');
      res.send(buffer);
    } else if (format === 'pdf') {
      const buffer = await exportService.exportClientsToPDF(filters);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=clientes.pdf');
      res.send(buffer);
    } else {
      res.status(400).json({ error: 'Formato no soportado. Use excel, csv o pdf' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

