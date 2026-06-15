import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistroSaude extends Document {
  userId: mongoose.Types.ObjectId;

  pressaoArterial: string;
  glicemia: number;
  frequenciaCardiaca: number;
  peso: number;

  possuiDiabetes: boolean;
  possuiHipertensao: boolean;

  tomouMedicamentosHoje: boolean;

  qualidadeSono: 'ruim' | 'regular' | 'boa' | 'excelente';
}

const RegistroSaudeSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    pressaoArterial: {
      type: String,
      required: true,
    },

    glicemia: {
      type: Number,
      required: true,
    },

    frequenciaCardiaca: {
      type: Number,
      required: true,
    },

    peso: {
      type: Number,
      required: true,
    },

    possuiDiabetes: {
      type: Boolean,
      default: false,
    },

    possuiHipertensao: {
      type: Boolean,
      default: false,
    },

    tomouMedicamentosHoje: {
      type: Boolean,
      required: true,
    },

    qualidadeSono: {
      type: String,
      enum: ['ruim', 'regular', 'boa', 'excelente'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRegistroSaude>(
  'RegistroSaude',
  RegistroSaudeSchema
);