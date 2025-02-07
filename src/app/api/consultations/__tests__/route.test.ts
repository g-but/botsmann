import { POST } from '../route';
import { connectDB } from '@/lib/db';
import { Consultation } from '@/models/Consultation';
import { transporter } from '@/lib/email';

type ConsultationData = {
  name: string;
  email: string;
  message: string;
};

jest.mock('@/lib/db', () => ({
  connectDB: jest.fn()
}));

jest.mock('@/models/Consultation', () => ({
  Consultation: jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(true)
  }))
}));

jest.mock('@/lib/email', () => ({
  transporter: {
    sendMail: jest.fn().mockResolvedValue(true)
  }
}));

describe('Consultations API', () => {
  const mockRequest = (body: Partial<ConsultationData>) => 
    new Request('http://localhost:3000/api/consultations', {
      method: 'POST',
      body: JSON.stringify(body)
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await POST(mockRequest({ name: '', email: '', message: '' }));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'All fields are required' });
  });

  it('should successfully process a valid consultation request', async () => {
    const validData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    };

    const response = await POST(mockRequest(validData));
    
    expect(connectDB).toHaveBeenCalled();
    expect(Consultation).toHaveBeenCalledWith(validData);
    expect(transporter.sendMail).toHaveBeenCalledTimes(2); // Customer and admin emails
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ 
      success: true, 
      message: 'Email submitted successfully' 
    });
  });

  it('should handle database connection errors', async () => {
    (connectDB as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));
    
    const response = await POST(mockRequest({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    }));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Internal server error' });
  });
});
