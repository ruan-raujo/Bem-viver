import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService.js';

const authService = new AuthService();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
      return;
    }

    const authData = await authService.login(email, senha);
    res.status(200).json(authData);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};