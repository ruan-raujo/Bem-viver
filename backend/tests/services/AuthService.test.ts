import {
  describe,
  test,
  expect,
  beforeEach,
  jest
} from '@jest/globals';

import { AuthService } from '../../src/services/AuthService.js';
import User from '../../src/models/User.js';
import jwt from 'jsonwebtoken';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.restoreAllMocks();

    authService = new AuthService();

    process.env.JWT_SECRET = 'test-secret';
  });

  test('deve fazer login com sucesso', async () => {
    const mockUser = {
      _id: {
        toString: () => '6a1cfb11df7f14b77eef5cf3'
      },
      comparePassword: jest
        .fn<() => Promise<boolean>>()
        .mockResolvedValue(true),

      toObject: jest.fn<() => any>().mockReturnValue({
        nome: 'Jefferson',
        email: 'cjeferson@gmail.com',
        senha: 'Games157'
      })
    };

    jest
      .spyOn(User, 'findOne')
      .mockResolvedValue(mockUser as any);

    jest
      .spyOn(jwt, 'sign')
      .mockReturnValue('token-fake' as any);

    const result = await authService.login(
      'cjeferson@gmail.com',
      'Games157'
    );

    expect(User.findOne).toHaveBeenCalledWith({
      email: 'cjeferson@gmail.com'
    });

    expect(
      mockUser.comparePassword
    ).toHaveBeenCalledWith(
      'Games157'
    );

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: '6a1cfb11df7f14b77eef5cf3'
      },
      'test-secret',
      {
        expiresIn: '1d'
      }
    );

    expect(result.token).toBe('token-fake');

    expect(result.user.email).toBe(
      'cjeferson@gmail.com'
    );

    expect(result.user.senha).toBeUndefined();
  });

  test('deve lançar erro quando usuário não existe', async () => {
    jest
      .spyOn(User, 'findOne')
      .mockResolvedValue(null);

    await expect(
      authService.login(
        'naoexiste@email.com',
        '123456'
      )
    ).rejects.toThrow(
      'E-mail ou senha incorretos.'
    );

    expect(User.findOne).toHaveBeenCalledWith({
      email: 'naoexiste@email.com'
    });
  });

  test('deve lançar erro quando senha estiver incorreta', async () => {
    const mockUser = {
      comparePassword: jest
        .fn<() => Promise<boolean>>()
        .mockResolvedValue(false)
    };

    jest
      .spyOn(User, 'findOne')
      .mockResolvedValue(mockUser as any);

    await expect(
      authService.login(
        'cjeferson@gmail.com',
        'senhaErrada'
      )
    ).rejects.toThrow(
      'E-mail ou senha incorretos.'
    );

    expect(
      mockUser.comparePassword
    ).toHaveBeenCalledWith(
      'senhaErrada'
    );
  });

  test('deve lançar erro quando JWT_SECRET não estiver configurado', async () => {
    delete process.env.JWT_SECRET;

    const mockUser = {
      comparePassword: jest
        .fn<() => Promise<boolean>>()
        .mockResolvedValue(true)
    };

    jest
      .spyOn(User, 'findOne')
      .mockResolvedValue(mockUser as any);

    await expect(
      authService.login(
        'cjeferson@gmail.com',
        'Games157'
      )
    ).rejects.toThrow(
      'JWT_SECRET não configurado.'
    );
  });
});