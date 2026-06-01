import jwt, { type Secret } from 'jsonwebtoken';
import User from '../models/User.js';

export class AuthService {
  async login(email: string, senhaCandidata: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('E-mail ou senha incorretos.');
    }

    const isMatch = await user.comparePassword(senhaCandidata);

    if (!isMatch) {
      throw new Error('E-mail ou senha incorretos.');
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET não configurado.');
    }

    const payload = {
      id: user._id.toString()
    };

    const token = jwt.sign(
      payload,
      secret as Secret,
      {
        expiresIn: '1d'
      }
    );

    const userResponse = user.toObject();
    delete (userResponse as any).senha;

    return {
      user: userResponse,
      token
    };
  }
}