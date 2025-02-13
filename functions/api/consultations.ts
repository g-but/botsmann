import { Handler } from '@netlify/functions';

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

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}') as ConsultationRequest;
    
    // Validation
    const errors: string[] = [];
    if (!body.name?.trim()) errors.push('Name is required');
    if (!body.email?.trim()) errors.push('Email is required');
    else if (!validateEmail(body.email)) errors.push('Invalid email format');
    if (!body.message?.trim()) errors.push('Message is required');

    if (errors.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Validation failed',
          details: errors
        }),
      };
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

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        id: consultation.id,
        message: 'Consultation request received'
      }),
    };
  } catch (error) {
    console.error('Error processing consultation:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process consultation request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};
