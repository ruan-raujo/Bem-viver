import User from '../models/User.js';
import type { IUser } from '../models/User.js';

export class UserService {
  
  async createUser(userData: Partial<IUser>): Promise<Omit<IUser, 'senha'>> {
    const { email } = userData;

    if (!email) {
        throw new Error('Email é obrigatório.');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const newUser = new User(userData);
    await newUser.save();

    const userObj = newUser.toObject();
    delete (userObj as any).senha;
    return userObj;
  }

  async getAllUsers() {
    return await User.find().select('-senha');
  }

  async getUserById(id: string) {
    const user = await User.findById(id).select('-senha');
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    return user;
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<Omit<IUser, 'senha'>> {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    if (updateData.nome) user.nome = updateData.nome;
    if (updateData.email) user.email = updateData.email;
    if (updateData.senha) user.senha = updateData.senha;

    await user.save();

    const userObj = user.toObject();
    delete (userObj as any).senha;
    return userObj;
  }

  async deleteUser(id: string): Promise<void> {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new Error('Usuário não encontrado.');
    }
  }
}