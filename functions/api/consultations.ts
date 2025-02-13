import { Handler } from '@netlify/functions';

interface ConsultationRequest {
  name: string;
  email: string;
  message: string;
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
    
    // Basic validation
    if (!body.name || !body.email || !body.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Store consultation data (simplified version)
    const consultation = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    };

    // In a real implementation, you would store this data somewhere
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
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request data' }),
    };
  }
};
