import mongoose from 'mongoose';

const emailErrorSchema = new mongoose.Schema({
  error: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
  templateName: String,
  recipient: String,
  templateData: Object
});

export const EmailError = mongoose.models.EmailError || mongoose.model('EmailError', emailErrorSchema);
