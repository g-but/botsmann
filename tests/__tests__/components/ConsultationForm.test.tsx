import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ConsultationForm from '../../../components/ConsultationForm';

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

// Mock fetch for API calls
global.fetch = jest.fn();

describe('ConsultationForm', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    (global.fetch as jest.Mock).mockReset();
  });

  it('renders all form fields', () => {
    render(<ConsultationForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<ConsultationForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid email format', async () => {
    render(<ConsultationForm />);
    
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
      await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
      await userEvent.type(screen.getByLabelText(/message/i), 'Test message');
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockResponse = { success: true, data: { id: '123' } };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<ConsultationForm />);
    
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/message/i), 'Test message');
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      }),
    });
  });

  it('shows error message on submission failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to submit'));

    render(<ConsultationForm />);
    
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/message/i), 'Test message');
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to submit form/i)).toBeInTheDocument();
    });
  });

  it('disables submit button during submission', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<ConsultationForm />);
    
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/message/i), 'Test message');
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByRole('button')).toHaveTextContent(/submitting/i);
    });
  });
});
