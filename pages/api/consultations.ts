import { NextApiRequest, NextApiResponse } from 'next';

interface ConsultationRequest {
  name: string;
  email: string;
  message: string;
}

interface ConsultationResponse {
  id: string;
  createdAt: string;
  data: ConsultationRequest;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body as ConsultationRequest;
    
    // Validation
    const errors: string[] = [];
    if (!body.name?.trim()) errors.push('Name is required');
    if (!body.email?.trim()) errors.push('Email is required');
    else if (!validateEmail(body.email)) errors.push('Invalid email format');
    if (!body.message?.trim()) errors.push('Message is required');

    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors
      });
    }

    // Store consultation data
    const consultation: ConsultationResponse = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      data: {
        name: body.name.trim(),
        email: body.email.trim(),
        message: body.message.trim()
      }
    };

    // Log the consultation (would be stored in a database in production)
    console.log('Received consultation:', consultation);

    return res.status(200).json({
      success: true,
      id: consultation.id,
      message: 'Consultation request received'
    });
  } catch (error) {
    console.error('Error processing consultation:', error);
    return res.status(500).json({ 
      error: 'Failed to process consultation request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
