import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  nome: string;
  email: string;
  senha: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
  },
  { timestamps: true }
);

// Criptografa a senha antes de salvar
UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('senha')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
  } catch (error: any) {
    (error);
  }
});

UserSchema.methods.comparePassword = async function (senhaCandidata: string): Promise<boolean> {
  return bcrypt.compare(senhaCandidata, this.senha);
};

export default mongoose.model<IUser>('User', UserSchema);