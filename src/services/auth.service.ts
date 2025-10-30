import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { validateEmail, validatePassword } from '../utils/validation';

export const registerUser = async (email: string, password: string, name?: string) => {
  if (!validateEmail(email)) {
    throw new Error('Email inválido');
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.message);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    },
  };
};

export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Email y contraseña son requeridos');
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    },
  };
};

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return user;
};

export const updateUserProfile = async (
  userId: string,
  data: { name?: string; email?: string; avatar?: string }
) => {
  if (data.name && (data.name.length < 3 || data.name.length > 100)) {
    throw new Error('El nombre debe tener entre 3 y 100 caracteres');
  }

  if (data.email) {
    if (!validateEmail(data.email)) {
      throw new Error('Email inválido');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new Error('El email ya está en uso por otro usuario');
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      updatedAt: true,
    },
  });

  return user;
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error('Todos los campos son requeridos');
  }

  if (newPassword !== confirmPassword) {
    throw new Error('Las contraseñas no coinciden');
  }

  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.message);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);

  if (!isCurrentPasswordValid) {
    throw new Error('La contraseña actual es incorrecta');
  }

  const hashedNewPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedNewPassword,
    },
  });

  return { message: 'Contraseña actualizada correctamente' };
};

export const uploadAvatar = async (userId: string, filename: string) => {
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const avatarUrl = `${baseUrl}/uploads/avatars/${filename}`;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      avatar: avatarUrl,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      updatedAt: true,
    },
  });

  return {
    message: 'Avatar actualizado correctamente',
    avatarUrl: avatarUrl,
    user,
  };
};

