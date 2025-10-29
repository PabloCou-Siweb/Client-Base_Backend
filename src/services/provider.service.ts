import prisma from '../config/database';

export const createProvider = async (name: string) => {
  const existingProvider = await prisma.provider.findUnique({
    where: { name },
  });

  if (existingProvider) {
    throw new Error('El proveedor ya existe');
  }

  const provider = await prisma.provider.create({
    data: { name },
  });

  return provider;
};

export const getProviders = async () => {
  const providers = await prisma.provider.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: {
          clients: true,
        },
      },
    },
  });

  return providers;
};

export const getProviderById = async (id: string) => {
  const provider = await prisma.provider.findUnique({
    where: { id },
    include: {
      clients: true,
    },
  });

  if (!provider) {
    throw new Error('Proveedor no encontrado');
  }

  return provider;
};

export const updateProvider = async (id: string, name: string) => {
  const existingProvider = await prisma.provider.findUnique({
    where: { id },
  });

  if (!existingProvider) {
    throw new Error('Proveedor no encontrado');
  }

  const nameExists = await prisma.provider.findUnique({
    where: { name },
  });

  if (nameExists && nameExists.id !== id) {
    throw new Error('El nombre del proveedor ya existe');
  }

  const provider = await prisma.provider.update({
    where: { id },
    data: { name },
  });

  return provider;
};

export const deleteProvider = async (id: string) => {
  const provider = await prisma.provider.findUnique({
    where: { id },
  });

  if (!provider) {
    throw new Error('Proveedor no encontrado');
  }

  await prisma.provider.delete({
    where: { id },
  });

  return { message: 'Proveedor eliminado correctamente' };
};

