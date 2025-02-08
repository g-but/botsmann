import { NextRequest } from 'next/server';
import { POST } from '../../../app/api/consultations/route';
import mongoose from 'mongoose';

// Mock mongoose to avoid actual database connections
const mockCreate = jest.fn();
const mockModel = {
  create: mockCreate,
};

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  Schema: jest.fn().mockReturnValue({
    pre: jest.fn().mockReturnThis(),
  }),
  model: jest.fn().mockReturnValue(mockModel),
  models: {
    Consultation: mockModel,
  },
  disconnect: jest.fn(),
}));

beforeEach(() => {
  mockCreate.mockReset();
  mockCreate.mockResolvedValue({
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test message',
    createdAt: new Date(),
  });
});

describe('POST /api/consultations', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // Clean up any connections
    await mongoose.disconnect();
  });

  it('should create a consultation with valid data', async () => {
    // Mock successful database creation
    const mockConsultation = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
      createdAt: new Date(),
    };

    (mongoose.model as jest.Mock).mockReturnValueOnce({
      create: jest.fn().mockResolvedValueOnce(mockConsultation),
    });

    const request = new NextRequest('http://localhost:3000/api/consultations', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockCreate).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    });
    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockConsultation);
  });

  it('should return 400 for missing required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/consultations', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        // Missing email and message
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });

  it('should return 500 for database connection error', async () => {
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

    const request = new NextRequest('http://localhost:3000/api/consultations', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
