import xlsx from 'xlsx';
import prisma from '../config/database';
import { ClientStatus } from '@prisma/client';

interface ExportFilters {
  search?: string;
  status?: ClientStatus;
  providerId?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: Date;
  endDate?: Date;
}

const buildWhereClause = (filters?: ExportFilters) => {
  const where: any = {};

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { phone: { contains: filters.search, mode: 'insensitive' } },
      { company: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.providerId) {
    where.providerId = filters.providerId;
  }

  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice;
    }
  }

  if (filters?.startDate || filters?.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.date.lte = filters.endDate;
    }
  }

  return where;
};

export const exportClientsToExcel = async (filters?: ExportFilters): Promise<Buffer> => {
  const where = buildWhereClause(filters);

  const clients = await prisma.client.findMany({
    where,
    include: {
      provider: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const data = clients.map(client => ({
    ID: client.id,
    Nombre: client.name,
    Email: client.email,
    Teléfono: client.phone || '',
    Empresa: client.company || '',
    Estado: client.status,
    Proveedor: client.provider.name,
    Precio: client.price,
    Fecha: client.date.toISOString().split('T')[0],
    Dirección: client.address || '',
    Ciudad: client.city || '',
    País: client.country || '',
    Notas: client.notes || '',
    'Fecha Creación': client.createdAt.toISOString().split('T')[0],
  }));

  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Clientes');

  const columnWidths = [
    { wch: 38 },
    { wch: 25 },
    { wch: 30 },
    { wch: 15 },
    { wch: 25 },
    { wch: 10 },
    { wch: 20 },
    { wch: 12 },
    { wch: 12 },
    { wch: 30 },
    { wch: 20 },
    { wch: 20 },
    { wch: 40 },
    { wch: 15 },
  ];
  worksheet['!cols'] = columnWidths;

  const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
};

export const exportClientsToCSV = async (filters?: ExportFilters): Promise<Buffer> => {
  const where = buildWhereClause(filters);

  const clients = await prisma.client.findMany({
    where,
    include: {
      provider: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const data = clients.map(client => ({
    ID: client.id,
    Nombre: client.name,
    Email: client.email,
    Teléfono: client.phone || '',
    Empresa: client.company || '',
    Estado: client.status,
    Proveedor: client.provider.name,
    Precio: client.price,
    Fecha: client.date.toISOString().split('T')[0],
    Dirección: client.address || '',
    Ciudad: client.city || '',
    País: client.country || '',
    Notas: client.notes || '',
    'Fecha Creación': client.createdAt.toISOString().split('T')[0],
  }));

  const worksheet = xlsx.utils.json_to_sheet(data);
  const csv = xlsx.utils.sheet_to_csv(worksheet);

  return Buffer.from(csv, 'utf-8');
};

export const exportClientsToPDF = async (filters?: ExportFilters): Promise<string> => {
  const where = buildWhereClause(filters);

  const clients = await prisma.client.findMany({
    where,
    include: {
      provider: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Clientes - Reporte</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #2FA8EC; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #2FA8EC; color: white; padding: 10px; text-align: left; }
        td { padding: 8px; border-bottom: 1px solid #e5e5e5; }
        tr:hover { background-color: #f5f5f5; }
        .status-active { color: #2FA8EC; font-weight: bold; }
        .status-inactive { color: #999999; }
      </style>
    </head>
    <body>
      <h1>Reporte de Clientes</h1>
      <p>Total de clientes: ${clients.length}</p>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Empresa</th>
            <th>Estado</th>
            <th>Proveedor</th>
            <th>Precio</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
  `;

  clients.forEach(client => {
    const statusClass = client.status === 'ACTIVE' ? 'status-active' : 'status-inactive';
    html += `
      <tr>
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td>${client.phone || '-'}</td>
        <td>${client.company || '-'}</td>
        <td class="${statusClass}">${client.status}</td>
        <td>${client.provider.name}</td>
        <td>$${client.price.toFixed(2)}</td>
        <td>${client.date.toISOString().split('T')[0]}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  return html;
};

