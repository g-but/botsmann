import { jest } from '@jest/globals';
import type { Model } from 'mongoose';
import type { Document } from 'mongoose';

interface ConsultationDocument extends Document {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  preferences?: {
    newsletter: boolean;
    productUpdates: boolean;
  };
  metadata?: {
    lastContactDate?: Date;
    source?: string;
    tags: string[];
  };
}

// Simple mock document creator
const createMockDocument = (data: any): ConsultationDocument => {
  const doc = {
    _id: 'test-id',
    name: data.name || 'Test User',
    email: data.email || 'test@example.com',
    message: data.message || 'Test message',
    status: data.status || 'new',
    preferences: data.preferences || { newsletter: false, productUpdates: false },
    metadata: data.metadata || { tags: [] }
  };

  // Add mongoose document methods
  const mongooseDoc = {
    ...doc,
    save: jest.fn().mockImplementation(() => Promise.resolve(doc)),
    toJSON: jest.fn().mockImplementation(() => doc),
    toObject: jest.fn().mockImplementation(() => doc)
  };

  return mongooseDoc as unknown as ConsultationDocument;
};

// Simple mock model with type-safe mock functions and immediate responses
const mockConsultation = {
  create: jest.fn().mockImplementation((data: any) => {
    const doc = {
      _id: 'test-id-' + Date.now(),
      ...data,
      toJSON: () => ({ _id: 'test-id-' + Date.now(), ...data }),
      toObject: () => ({ _id: 'test-id-' + Date.now(), ...data })
    };
    return Promise.resolve(doc);
  }),
  deleteMany: jest.fn().mockReturnValue(Promise.resolve({ acknowledged: true, deletedCount: 0 })),
  findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
  find: jest.fn().mockReturnValue({ exec: () => Promise.resolve([]) }),
  collection: { collectionName: 'consultations' }
} as unknown as Model<ConsultationDocument>;

// Mock MongoDB connection
jest.mock('@/src/lib/mongodb', () => ({
  connectDB: jest.fn().mockImplementation(async () => {
    console.log('Mock MongoDB connection established');
    return Promise.resolve();
  })
}));

// Mock Consultation model
jest.mock('@/src/lib/models/consultation', () => ({
  Consultation: mockConsultation
}));

export { mockConsultation };
