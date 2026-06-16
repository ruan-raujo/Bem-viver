import type { Request, Response } from 'express';
import { RegistroSaudeService } from '../services/RegistroSaudeService.js';

const registroSaudeService = new RegistroSaudeService();

interface RegistroParams {
  id: string;
}

interface UserParams {
  userId: string;
}

export const createRegistro = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const novoRegistro = await registroSaudeService.createRegistro(
      req.body
    );

    res.status(201).json(novoRegistro);
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const getRegistros = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const registros =
      await registroSaudeService.getAllRegistros();

    res.status(200).json(registros);
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao buscar registros.',
      error: error.message
    });
  }
};

export const getRegistroById = async (
  req: Request<RegistroParams>,
  res: Response
): Promise<void> => {
  try {
    const registro =
      await registroSaudeService.getRegistroById(
        req.params.id
      );

    res.status(200).json(registro);
  } catch (error: any) {
    res.status(404).json({
      message: error.message
    });
  }
};

export const getRegistrosByUser = async (
  req: Request<UserParams>,
  res: Response
): Promise<void> => {
  try {
    const registros =
      await registroSaudeService.getRegistrosByUser(
        req.params.userId
      );

    res.status(200).json(registros);
  } catch (error: any) {
    res.status(404).json({
      message: error.message
    });
  }
};

export const getUltimoRegistroByUser = async (
  req: Request<UserParams>,
  res: Response
): Promise<void> => {
  try {
    const registro =
      await registroSaudeService.getUltimoRegistroByUser(
        req.params.userId
      );

    res.status(200).json(registro);
  } catch (error: any) {
    res.status(404).json({
      message: error.message
    });
  }
};

export const updateRegistro = async (
  req: Request<RegistroParams>,
  res: Response
): Promise<void> => {
  try {
    const registroAtualizado =
      await registroSaudeService.updateRegistro(
        req.params.id,
        req.body
      );

    res.status(200).json(registroAtualizado);
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const deleteRegistro = async (
  req: Request<RegistroParams>,
  res: Response
): Promise<void> => {
  try {
    await registroSaudeService.deleteRegistro(
      req.params.id
    );

    res.status(200).json({
      message: 'Registro deletado com sucesso!'
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message
    });
  }
};