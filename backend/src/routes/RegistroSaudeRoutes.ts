import { Router } from 'express';
import {
  createRegistro,
  getRegistros,
  getRegistroById,
  getRegistrosByUser,
  getUltimoRegistroByUser,
  updateRegistro,
  deleteRegistro
} from '../controllers/RegistroSaudeController.js';

const router = Router();

router.post('/', createRegistro);

router.get('/', getRegistros);

router.get('/:id', getRegistroById);

router.get('/user/:userId', getRegistrosByUser);

router.get('/user/:userId/ultimo', getUltimoRegistroByUser);

router.put('/:id', updateRegistro);

router.delete('/:id', deleteRegistro);

export default router;