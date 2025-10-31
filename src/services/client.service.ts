import prisma from '../config/database';
import { ClientStatus } from '@prisma/client';

interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: ClientStatus;
  providerId: string;
  price?: number;
  date?: Date;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
}

interface UpdateClientData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: ClientStatus;
  providerId?: string;
  price?: number;
  date?: Date;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
}

interface ClientFilters {
  search?: string;
  status?: ClientStatus;
  providerId?: string;
  providerNames?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: Date;
  endDate?: Date;
}

export const createClient = async (data: CreateClientData) => {
  const existingClient = await prisma.client.findUnique({
    where: { email: data.email },
  });

  if (existingClient) {
    throw new Error('El email ya está registrado');
  }

  const provider = await prisma.provider.findUnique({
    where: { id: data.providerId },
  });

  if (!provider) {
    throw new Error('Proveedor no encontrado');
  }

  const client = await prisma.client.create({
    data: {
      ...data,
      price: data.price || 0,
    },
    include: {
      provider: true,
    },
  });

  return client;
};

export const getClients = async (
  page: number = 1,
  limit: number = 10,
  filters?: ClientFilters
) => {
  const skip = (page - 1) * limit;

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
    where.status = filters.status;
  }

  if (filters?.providerId) {
    where.providerId = filters.providerId;
  }

  if (filters?.providerNames) {
    try {
      const providerNamesArray = JSON.parse(filters.providerNames);
      if (Array.isArray(providerNamesArray) && providerNamesArray.length > 0) {
        const providerSearchPromises = providerNamesArray.map(async (providerName) => {
          const trimmedName = providerName.trim();
          return await prisma.provider.findMany({
            where: {
              name: {
                contains: trimmedName,
              },
            },
          });
        });

        const providerResults = await Promise.all(providerSearchPromises);
        const providers = providerResults.flat();
        const providerIds = providers.map((p) => p.id);

        if (providerIds.length > 0) {
          where.providerId = {
            in: providerIds,
          };
        } else {
          where.id = { in: [] };
        }
      }
    } catch (error) {
      console.error('Error parsing providerNames:', error);
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

  if (filters?.startDate && filters?.endDate) {
    const startDay = new Date(filters.startDate);
    startDay.setUTCHours(0, 0, 0, 0);
    
    const endDay = new Date(filters.endDate);
    endDay.setUTCHours(23, 59, 59, 999);
    
    where.createdAt = {
      gte: startDay,
      lte: endDay,
    };
  } else if (filters?.startDate) {
    const startDay = new Date(filters.startDate);
    startDay.setUTCHours(0, 0, 0, 0);
    
    where.createdAt = { gte: startDay };
  } else if (filters?.endDate) {
    const endDay = new Date(filters.endDate);
    endDay.setUTCHours(23, 59, 59, 999);
    
    where.createdAt = { lte: endDay };
  }

  try {
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        include: {
          provider: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.client.count({ where }),
    ]);

    return {
      clients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error al buscar clientes:', error);
    throw new Error('Error al buscar clientes. Por favor, intente de nuevo.');
  }
};

export const getClientById = async (id: string) => {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      provider: true,
    },
  });

  if (!client) {
    throw new Error('Cliente no encontrado');
  }

  return client;
};

export const updateClient = async (id: string, data: UpdateClientData) => {
  const existingClient = await prisma.client.findUnique({
    where: { id },
  });

  if (!existingClient) {
    throw new Error('Cliente no encontrado');
  }

  if (data.email && data.email !== existingClient.email) {
    const emailExists = await prisma.client.findUnique({
      where: { email: data.email },
    });
    if (emailExists) {
      throw new Error('El email ya está registrado');
    }
  }

  if (data.providerId) {
    const provider = await prisma.provider.findUnique({
      where: { id: data.providerId },
    });
    if (!provider) {
      throw new Error('Proveedor no encontrado');
    }
  }

  const client = await prisma.client.update({
    where: { id },
    data,
    include: {
      provider: true,
    },
  });

  return client;
};

export const deleteClient = async (id: string) => {
  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client) {
    throw new Error('Cliente no encontrado');
  }

  await prisma.client.delete({
    where: { id },
  });

  return { message: 'Cliente eliminado correctamente' };
};

export const deleteMultipleClients = async (ids: string[]) => {
  const result = await prisma.client.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  return { message: `${result.count} clientes eliminados correctamente` };
};

