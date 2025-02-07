import mongoose from 'mongoose';

export interface IConsultation {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const ConsultationSchema = new mongoose.Schema<IConsultation>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Consultation = mongoose.models.Consultation || 
  mongoose.model<IConsultation>('Consultation', ConsultationSchema);
