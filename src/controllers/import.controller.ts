import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as importService from '../services/import.service';
import fs from 'fs';

export const importClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
      return;
    }

    const filePath = req.file.path;
    const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase();

    let result;

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      result = await importService.importClientsFromExcel(filePath);
    } else if (fileExtension === 'csv') {
      result = await importService.importClientsFromCSV(filePath);
    } else {
      fs.unlinkSync(filePath);
      res.status(400).json({ error: 'Formato de archivo no soportado. Use Excel o CSV' });
      return;
    }

    fs.unlinkSync(filePath);

    res.json({
      message: 'Importación completada',
      success: result.success,
      errors: result.errors,
      total: result.success + result.errors.length,
    });
  } catch (error) {
    if (req.file?.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: (error as Error).message });
  }
};

