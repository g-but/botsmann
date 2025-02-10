import mongoose from 'mongoose';

const ConsultationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email address'],
    index: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'resolved'],
    default: 'new',
    index: true
  },
  preferences: {
    newsletter: {
      type: Boolean,
      default: false
    },
    productUpdates: {
      type: Boolean,
      default: false
    }
  },
  metadata: {
    lastContactDate: Date,
    source: String,
    tags: {
      type: [String],
      default: []
    }
  }
}, { 
  timestamps: true,
  autoIndex: true
});

// Create compound index for common queries
ConsultationSchema.index({ status: 1, createdAt: -1 });
ConsultationSchema.index({ email: 1, status: 1 });

export const Consultation = mongoose.models.Consultation || mongoose.model('Consultation', ConsultationSchema);
