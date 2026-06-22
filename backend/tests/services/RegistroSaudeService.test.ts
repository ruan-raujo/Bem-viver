import {
  describe,
  test,
  expect,
  beforeEach,
  jest
} from '@jest/globals';

import { RegistroSaudeService } from '../../src/services/RegistroSaudeService.js';
import RegistroSaude from '../../src/models/RegistroSaude.js';

describe('RegistroSaudeService', () => {
  let registroSaudeService: RegistroSaudeService;

  beforeEach(() => {
    jest.restoreAllMocks();

    registroSaudeService =
      new RegistroSaudeService();
  });

  test('deve criar registro com sucesso', async () => {
    const registroData = {
      userId: '507f1f77bcf86cd799439011',
      peso: 80
    };

    const saveMock =
      jest.fn<() => Promise<void>>().mockResolvedValue(undefined);

    jest
      .spyOn(
        RegistroSaude.prototype,
        'save'
      )
      .mockImplementation(saveMock);

    const result =
      await registroSaudeService.createRegistro(
        registroData as any
      );

    expect(saveMock).toHaveBeenCalled();

    expect(
        String(result.userId)
    ).toBe('507f1f77bcf86cd799439011');
  });

  test('deve lançar erro quando userId não for informado', async () => {
    await expect(
      registroSaudeService.createRegistro({
        peso: 80
      } as any)
    ).rejects.toThrow(
      'Usuário é obrigatório.'
    );
  });

  test('deve retornar todos os registros', async () => {
    const registros = [
      {
        _id: '1',
        userId: '123'
      }
    ];

    jest
      .spyOn(RegistroSaude, 'find')
      .mockReturnValue({
        populate: jest
          .fn<() => Promise<any[]>>()
          .mockResolvedValue(registros)
      } as any);

    const result =
      await registroSaudeService.getAllRegistros();

    expect(result).toEqual(registros);
  });

  test('deve retornar registro por id', async () => {
    const registro = {
      _id: '1',
      userId: '123'
    };

    jest
      .spyOn(RegistroSaude, 'findById')
      .mockReturnValue({
        populate: jest
          .fn<() => Promise<any>>()
          .mockResolvedValue(registro)
      } as any);

    const result =
      await registroSaudeService.getRegistroById(
        '1'
      );

    expect(result).toEqual(registro);
  });

  test('deve lançar erro quando registro não existir', async () => {
    jest
      .spyOn(RegistroSaude, 'findById')
      .mockReturnValue({
        populate: jest
          .fn<() => Promise<any>>()
          .mockResolvedValue(null)
      } as any);

    await expect(
      registroSaudeService.getRegistroById('1')
    ).rejects.toThrow(
      'Registro não encontrado.'
    );
  });

  test('deve retornar registros de um usuário', async () => {
    const registros = [
      { _id: '1' },
      { _id: '2' }
    ];

    jest
      .spyOn(RegistroSaude, 'find')
      .mockReturnValue({
        sort: jest
          .fn<() => Promise<any[]>>()
          .mockResolvedValue(registros)
      } as any);

    const result =
      await registroSaudeService.getRegistrosByUser(
        '123'
      );

    expect(result).toEqual(registros);

    expect(
      RegistroSaude.find
    ).toHaveBeenCalledWith({
      userId: '123'
    });
  });

  test('deve retornar último registro do usuário', async () => {
    const registro = {
      _id: '1',
      userId: '123'
    };

    jest
      .spyOn(RegistroSaude, 'findOne')
      .mockReturnValue({
        sort: jest
          .fn<() => Promise<any>>()
          .mockResolvedValue(registro)
      } as any);

    const result =
      await registroSaudeService.getUltimoRegistroByUser(
        '123'
      );

    expect(result).toEqual(registro);
  });

  test('deve lançar erro quando não houver registros do usuário', async () => {
    jest
      .spyOn(RegistroSaude, 'findOne')
      .mockReturnValue({
        sort: jest
          .fn<() => Promise<any>>()
          .mockResolvedValue(null)
      } as any);

    await expect(
      registroSaudeService.getUltimoRegistroByUser(
        '123'
      )
    ).rejects.toThrow(
      'Nenhum registro encontrado.'
    );
  });

  test('deve atualizar registro com sucesso', async () => {
    const registroAtualizado = {
      _id: '1',
      peso: 75
    };

    jest
      .spyOn(
        RegistroSaude,
        'findByIdAndUpdate'
      )
      .mockResolvedValue(
        registroAtualizado as any
      );

    const result =
      await registroSaudeService.updateRegistro(
        '1',
        {
          peso: 75
        } as any
      );

    expect(result).toEqual(
      registroAtualizado
    );

    expect(
      RegistroSaude.findByIdAndUpdate
    ).toHaveBeenCalledWith(
      '1',
      {
        peso: 75
      },
      {
        new: true,
        runValidators: true
      }
    );
  });

  test('deve lançar erro ao atualizar registro inexistente', async () => {
    jest
      .spyOn(
        RegistroSaude,
        'findByIdAndUpdate'
      )
      .mockResolvedValue(null);

    await expect(
      registroSaudeService.updateRegistro(
        '1',
        {
          peso: 75
        } as any
      )
    ).rejects.toThrow(
      'Registro não encontrado.'
    );
  });

  test('deve deletar registro com sucesso', async () => {
    jest
      .spyOn(
        RegistroSaude,
        'findByIdAndDelete'
      )
      .mockResolvedValue({} as any);

    await expect(
      registroSaudeService.deleteRegistro(
        '1'
      )
    ).resolves.not.toThrow();

    expect(
      RegistroSaude.findByIdAndDelete
    ).toHaveBeenCalledWith('1');
  });

  test('deve lançar erro ao deletar registro inexistente', async () => {
    jest
      .spyOn(
        RegistroSaude,
        'findByIdAndDelete'
      )
      .mockResolvedValue(null);

    await expect(
      registroSaudeService.deleteRegistro(
        '1'
      )
    ).rejects.toThrow(
      'Registro não encontrado.'
    );
  });
});