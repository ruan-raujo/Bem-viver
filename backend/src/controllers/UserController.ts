import type { Request, Response } from 'express';
import { UserService } from '../services/UserService.js';

const userService = new UserService();

interface UserParams {
  id: string;
}


export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
  }
};

export const getUserById = async (req: Request<UserParams>, res: Response): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUser = async (req: Request<UserParams>, res: Response): Promise<void> => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request<UserParams>, res: Response): Promise<void> => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};