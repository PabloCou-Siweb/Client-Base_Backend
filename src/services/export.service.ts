import xlsx from 'xlsx';
import prisma from '../config/database';
import { ClientStatus } from '@prisma/client';
import puppeteer from 'puppeteer';

interface ExportFilters {
  search?: string;
  status?: ClientStatus;
  providerId?: string;
  providers?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: Date;
  endDate?: Date;
}

const buildWhereClause = async (filters?: ExportFilters) => {
  const where: any = {};

  if (filters?.search && typeof filters.search === 'string') {
    const searchTerm = filters.search.trim();
    
    if (searchTerm.length > 0 && searchTerm.length <= 100) {
      where.OR = [
        { name: { contains: searchTerm } },
        { email: { contains: searchTerm } },
        { phone: { contains: searchTerm } },
        { company: { contains: searchTerm } },
      ];
    }
  }

  if (filters?.status) {
    const statusValue = filters.status.toString().toUpperCase();
    if (statusValue === 'ACTIVE' || statusValue === 'INACTIVE') {
      where.status = statusValue;
    }
  }

  if (filters?.providerId) {
    where.providerId = filters.providerId;
  }

  if (filters?.providers && typeof filters.providers === 'string') {
    const providerNamesArray = filters.providers
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (providerNamesArray.length > 0) {
      const providerSearchPromises = providerNamesArray.map(async (providerName) => {
        return await prisma.provider.findMany({
          where: {
            name: {
              contains: providerName,
            },
          },
        });
      });

      const providerResults = await Promise.all(providerSearchPromises);
      const providers = providerResults.flat();
      const providerIds = [...new Set(providers.map((p) => p.id))];

      if (providerIds.length > 0) {
        where.providerId = {
          in: providerIds,
        };
      } else {
        where.id = { in: [] };
      }
    }
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
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.createdAt.lte = filters.endDate;
    }
  }

  return where;
};

const buildExportData = (clients: any[], selectedFields: string[] | null) => {
  const fieldMapping: { [key: string]: { header: string; getValue: (client: any) => any } } = {
    'provider': { header: 'Proveedor', getValue: (c) => c.provider.name },
    'email': { header: 'Email', getValue: (c) => c.email },
    'phone': { header: 'Teléfono', getValue: (c) => c.phone || '' },
    'date': { header: 'Fecha Creación', getValue: (c) => c.createdAt.toISOString().split('T')[0] },
    'price': { header: 'Precio', getValue: (c) => c.price },
    'status': { header: 'Estado', getValue: (c) => c.status },
    'name': { header: 'Nombre', getValue: (c) => c.name },
    'company': { header: 'Empresa', getValue: (c) => c.company || '' },
    'address': { header: 'Dirección', getValue: (c) => c.address || '' },
    'city': { header: 'Ciudad', getValue: (c) => c.city || '' },
    'country': { header: 'País', getValue: (c) => c.country || '' },
  };

  const fieldsToExport = selectedFields || Object.keys(fieldMapping);

  return clients.map(client => {
    const row: any = {};
    fieldsToExport.forEach(field => {
      if (fieldMapping[field]) {
        row[fieldMapping[field].header] = fieldMapping[field].getValue(client);
      }
    });
    return row;
  });
};

export const exportClientsToExcel = async (filters?: ExportFilters, selectedFields: string[] | null = null): Promise<Buffer> => {
  const where = await buildWhereClause(filters);

  const clients = await prisma.client.findMany({
    where,
    include: {
      provider: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const data = buildExportData(clients, selectedFields);

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

export const exportClientsToCSV = async (filters?: ExportFilters, selectedFields: string[] | null = null): Promise<Buffer> => {
  const where = await buildWhereClause(filters);

  const clients = await prisma.client.findMany({
    where,
    include: {
      provider: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const data = buildExportData(clients, selectedFields);

  const worksheet = xlsx.utils.json_to_sheet(data);
  const csv = xlsx.utils.sheet_to_csv(worksheet);

  return Buffer.from(csv, 'utf-8');
};

export const exportClientsToPDF = async (filters?: ExportFilters, selectedFields: string[] | null = null): Promise<Buffer> => {
  const where = await buildWhereClause(filters);

  const clients = await prisma.client.findMany({
    where,
    include: {
      provider: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const fieldMapping: { [key: string]: { header: string; getValue: (client: any) => any } } = {
    'provider': { header: 'Proveedor', getValue: (c) => c.provider.name },
    'email': { header: 'Email', getValue: (c) => c.email },
    'phone': { header: 'Teléfono', getValue: (c) => c.phone || '-' },
    'date': { header: 'Fecha', getValue: (c) => c.createdAt.toISOString().split('T')[0] },
    'price': { header: 'Precio', getValue: (c) => `$${c.price.toFixed(2)}` },
    'status': { header: 'Estado', getValue: (c) => c.status },
    'name': { header: 'Nombre', getValue: (c) => c.name },
    'company': { header: 'Empresa', getValue: (c) => c.company || '-' },
  };

  const fieldsToExport = selectedFields || Object.keys(fieldMapping);
  const headers = fieldsToExport.map(field => fieldMapping[field]?.header || field).filter(Boolean);

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
            ${headers.map(header => `<th>${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  clients.forEach(client => {
    html += '<tr>';
    fieldsToExport.forEach(field => {
      if (fieldMapping[field]) {
        const value = fieldMapping[field].getValue(client);
        const isStatus = field === 'status';
        const statusClass = isStatus && value === 'ACTIVE' ? 'status-active' : isStatus && value === 'INACTIVE' ? 'status-inactive' : '';
        html += `<td class="${statusClass}">${value}</td>`;
      }
    });
    html += '</tr>';
  });

  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
};

