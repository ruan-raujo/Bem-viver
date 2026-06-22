import {
  describe,
  test,
  expect,
  beforeEach,
  jest
} from '@jest/globals';

import { UserService } from '../../src/services/UserService.js';
import User from '../../src/models/User.js';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    jest.restoreAllMocks();

    userService = new UserService();
  });

  test('deve criar usuário com sucesso', async () => {
    const mockUserData = {
      nome: 'Jefferson',
      email: 'jefferson@email.com',
      senha: '123456'
    };

    jest
      .spyOn(User, 'findOne')
      .mockResolvedValue(null);

    const saveMock = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);

    const toObjectMock = jest.fn<() => any>().mockReturnValue({
      nome: 'Jefferson',
      email: 'jefferson@email.com',
      senha: '123456'
    });

    jest
      .spyOn(User.prototype, 'save')
      .mockImplementation(saveMock);

    jest
      .spyOn(User.prototype, 'toObject')
      .mockImplementation(toObjectMock);

    const result = await userService.createUser(
      mockUserData as any
    );

    expect(User.findOne).toHaveBeenCalledWith({
      email: 'jefferson@email.com'
    });

    expect(saveMock).toHaveBeenCalled();

    expect(result.nome).toBe('Jefferson');

    expect((result as any).senha).toBeUndefined();
  });

  test('deve lançar erro quando email não for informado', async () => {
    await expect(
      userService.createUser({
        nome: 'Jefferson'
      } as any)
    ).rejects.toThrow(
      'Email é obrigatório.'
    );
  });

  test('deve lançar erro quando email já existir', async () => {
    jest
      .spyOn(User, 'findOne')
      .mockResolvedValue({} as any);

    await expect(
      userService.createUser({
        nome: 'Jefferson',
        email: 'jefferson@email.com',
        senha: '123456'
      } as any)
    ).rejects.toThrow(
      'Este e-mail já está cadastrado.'
    );
  });

  test('deve retornar usuário por ID', async () => {
    const mockUser = {
      _id: '123',
      nome: 'Jefferson',
      email: 'jefferson@email.com'
    };

    jest
      .spyOn(User, 'findById')
      .mockReturnValue({
        select: jest.fn<() => Promise<any>>().mockResolvedValue(mockUser)
      } as any);

    const result =
      await userService.getUserById('123');

    expect(result).toEqual(mockUser);
  });

  test('deve lançar erro quando usuário não existir ao buscar por ID', async () => {
    jest
      .spyOn(User, 'findById')
      .mockReturnValue({
        select: jest.fn<() => Promise<any>>().mockResolvedValue(null)
      } as any);

    await expect(
      userService.getUserById('123')
    ).rejects.toThrow(
      'Usuário não encontrado.'
    );
  });

  test('deve atualizar usuário com sucesso', async () => {
    const mockUser = {
      nome: 'Antigo',
      email: 'antigo@email.com',
      senha: '123',
      save: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      toObject: jest.fn<() => any>().mockReturnValue({
        nome: 'Novo Nome',
        email: 'novo@email.com',
        senha: '123'
      })
    };

    jest
      .spyOn(User, 'findById')
      .mockResolvedValue(mockUser as any);

    const result =
      await userService.updateUser(
        '123',
        {
          nome: 'Novo Nome',
          email: 'novo@email.com'
        } as any
      );

    expect(mockUser.save).toHaveBeenCalled();

    expect(result.nome).toBe(
      'Novo Nome'
    );

    expect((result as any).senha)
      .toBeUndefined();
  });

  test('deve lançar erro ao atualizar usuário inexistente', async () => {
    jest
      .spyOn(User, 'findById')
      .mockResolvedValue(null);

    await expect(
      userService.updateUser(
        '123',
        {
          nome: 'Novo Nome'
        } as any
      )
    ).rejects.toThrow(
      'Usuário não encontrado.'
    );
  });

  test('deve deletar usuário com sucesso', async () => {
    jest
      .spyOn(User, 'findByIdAndDelete')
      .mockResolvedValue({} as any);

    await expect(
      userService.deleteUser('123')
    ).resolves.not.toThrow();

    expect(
      User.findByIdAndDelete
    ).toHaveBeenCalledWith('123');
  });

  test('deve lançar erro ao deletar usuário inexistente', async () => {
    jest
      .spyOn(User, 'findByIdAndDelete')
      .mockResolvedValue(null);

    await expect(
      userService.deleteUser('123')
    ).rejects.toThrow(
      'Usuário não encontrado.'
    );
  });
});