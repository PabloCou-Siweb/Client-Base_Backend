import { Response } from 'express';
import { AuthRequest } from '../types/express';
import * as authService from '../services/auth.service';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña son requeridos' });
      return;
    }

    const result = await authService.registerUser(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const user = await authService.getUserProfile(req.user.userId);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const { name, avatar } = req.body;
    const user = await authService.updateUserProfile(req.user.userId, { name, avatar });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

