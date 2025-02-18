'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ConsultationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);
    
    try {
      const formData = {
        name: data.name,
        email: data.email,
        message: data.message,
        preferences: {
          newsletter: true,
          productUpdates: true
        }
      };
      
      console.log('Submitting form data:', formData);
      
      const apiUrl = '/api/consultations';
      console.log('Sending request to:', apiUrl);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'development-key',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
        cache: 'no-store'
      });
      console.log('Response status:', response.status);
      
      const responseData = await response.json().catch(() => null);
      console.log('Response data:', responseData);
      
      if (!response.ok || !responseData) {
        throw new Error(responseData?.message || `HTTP error! status: ${response.status}`);
      }
      
      console.log('Form submission successful:', responseData);
      reset();
      setSubmitSuccess(true);
    } catch (error: unknown) {
      console.error('Form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  };

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-openai-green sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-openai-green sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            {...register('message', { required: 'Message is required' })}
            rows={4}
            id="message"
            className="mt-1 block w-full rounded-md border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-openai-green sm:text-sm"
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        {submitError && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        {submitSuccess && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-700">
              Thank you for your message! We'll get back to you soon.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-openai-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-openai-green disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
