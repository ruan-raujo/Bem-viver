import RegistroSaude from '../models/RegistroSaude.js';
import type { IRegistroSaude } from '../models/RegistroSaude.js';

export class RegistroSaudeService {

  async createRegistro(
    registroData: Partial<IRegistroSaude>
  ): Promise<IRegistroSaude> {

    if (!registroData.userId) {
      throw new Error('Usuário é obrigatório.');
    }

    const novoRegistro = new RegistroSaude(registroData);
    await novoRegistro.save();

    return novoRegistro;
  }

  async getAllRegistros(): Promise<IRegistroSaude[]> {
    return await RegistroSaude
      .find()
      .populate('userId', 'nome email');
  }

  async getRegistroById(id: string): Promise<IRegistroSaude> {

    const registro = await RegistroSaude
      .findById(id)
      .populate('userId', 'nome email');

    if (!registro) {
      throw new Error('Registro não encontrado.');
    }

    return registro;
  }

  async getRegistrosByUser(
    userId: string
  ): Promise<IRegistroSaude[]> {

    return await RegistroSaude
      .find({ userId })
      .sort({ createdAt: -1 });
  }

  async getUltimoRegistroByUser(
    userId: string
  ): Promise<IRegistroSaude> {

    const registro = await RegistroSaude
      .findOne({ userId })
      .sort({ createdAt: -1 });

    if (!registro) {
      throw new Error('Nenhum registro encontrado.');
    }

    return registro;
  }

  async updateRegistro(
    id: string,
    updateData: Partial<IRegistroSaude>
  ): Promise<IRegistroSaude> {

    const registro = await RegistroSaude.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!registro) {
      throw new Error('Registro não encontrado.');
    }

    return registro;
  }

  async deleteRegistro(id: string): Promise<void> {

    const deletedRegistro =
      await RegistroSaude.findByIdAndDelete(id);

    if (!deletedRegistro) {
      throw new Error('Registro não encontrado.');
    }
  }
}