/**
 * useFormSubmit Hook
 *
 * Reusable hook for form submission with loading, success, and error states.
 * Reduces boilerplate in form components.
 */

import { useState, useCallback } from 'react';

export interface UseFormSubmitOptions<T> {
  /** API endpoint to POST to */
  endpoint: string;
  /** Callback on successful submission */
  onSuccess?: (data: T) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Default error message */
  defaultErrorMessage?: string;
}

export interface UseFormSubmitReturn<T, R = unknown> {
  /** Whether the form is currently submitting */
  isSubmitting: boolean;
  /** Whether the form was submitted successfully */
  isSuccess: boolean;
  /** Error message if submission failed */
  error: string | null;
  /** Submit function to call with form data */
  submit: (data: T) => Promise<R | null>;
  /** Reset the form state */
  reset: () => void;
  /** Set success state manually */
  setSuccess: (value: boolean) => void;
}

/**
 * Hook for handling form submissions with consistent state management
 *
 * @example
 * const { isSubmitting, isSuccess, error, submit, reset } = useFormSubmit<FormData>({
 *   endpoint: '/api/contact',
 *   onSuccess: () => formReset(),
 * });
 *
 * const onSubmit = async (data: FormData) => {
 *   await submit(data);
 * };
 */
export function useFormSubmit<T, R = unknown>({
  endpoint,
  onSuccess,
  onError,
  defaultErrorMessage = 'Failed to submit form. Please try again.',
}: UseFormSubmitOptions<T>): UseFormSubmitReturn<T, R> {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (data: T): Promise<R | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || defaultErrorMessage);
      }

      setIsSuccess(true);
      onSuccess?.(result);
      return result as R;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : defaultErrorMessage;
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [endpoint, onSuccess, onError, defaultErrorMessage]);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setIsSuccess(false);
    setError(null);
  }, []);

  return {
    isSubmitting,
    isSuccess,
    error,
    submit,
    reset,
    setSuccess: setIsSuccess,
  };
}
