import xlsx from 'xlsx';
import prisma from '../config/database';
import { ClientStatus } from '@prisma/client';

interface ClientImportData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
  provider: string;
  price?: number;
  date?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
}

export const importClientsFromExcel = async (filePath: string) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: ClientImportData[] = xlsx.utils.sheet_to_json(worksheet);

    const results = {
      success: 0,
      errors: [] as Array<{ row: number; error: string; data: any }>,
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      try {
        if (!row.name || !row.email || !row.provider) {
          results.errors.push({
            row: i + 2,
            error: 'Faltan campos requeridos (name, email, provider)',
            data: row,
          });
          continue;
        }

        const existingClient = await prisma.client.findUnique({
          where: { email: row.email },
        });

        if (existingClient) {
          results.errors.push({
            row: i + 2,
            error: 'El email ya está registrado',
            data: row,
          });
          continue;
        }

        let provider = await prisma.provider.findUnique({
          where: { name: row.provider },
        });

        if (!provider) {
          provider = await prisma.provider.create({
            data: { name: row.provider },
          });
        }

        let status: ClientStatus = ClientStatus.ACTIVE;
        if (row.status) {
          status = row.status.toUpperCase() === 'INACTIVE' ? ClientStatus.INACTIVE : ClientStatus.ACTIVE;
        }

        await prisma.client.create({
          data: {
            name: row.name,
            email: row.email,
            phone: row.phone,
            company: row.company,
            status,
            providerId: provider.id,
            price: row.price || 0,
            date: row.date ? new Date(row.date) : new Date(),
            address: row.address,
            city: row.city,
            country: row.country,
            notes: row.notes,
          },
        });

        results.success++;
      } catch (error) {
        results.errors.push({
          row: i + 2,
          error: (error as Error).message,
          data: row,
        });
      }
    }

    return results;
  } catch (error) {
    throw new Error(`Error al procesar el archivo: ${(error as Error).message}`);
  }
};

export const importClientsFromCSV = async (filePath: string) => {
  try {
    return await importClientsFromExcel(filePath);
  } catch (error) {
    throw new Error(`Error al procesar el archivo CSV: ${(error as Error).message}`);
  }
};