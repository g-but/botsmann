import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/consultations/route';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Skip these tests if Supabase is not configured
const describeFn = isSupabaseConfigured() ? describe : describe.skip;

describeFn('Consultations API', () => {
  // Clean up test data after each test
  afterEach(async () => {
    // Delete test consultations (those with test email domain)
    await supabase
      .from('consultations')
      .delete()
      .like('email', '%@example.com');
  });

  it('creates a consultation', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      },
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.id).toBeDefined();

    // Verify the consultation was created
    const { data: consultation, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', data.id)
      .single();

    expect(error).toBeNull();
    expect(consultation).toBeDefined();
    expect(consultation?.name).toBe('Test User');
    expect(consultation?.email).toBe('test@example.com');
    expect(consultation?.message).toBe('Test message');
    expect(consultation?.status).toBe('new');
  });

  it('validates required fields', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        name: '',
        email: 'invalid-email',
        message: '',
      },
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.code).toBe('VALIDATION_ERROR');
  });
});
