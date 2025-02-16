'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required')
});

const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const notificationVariants = {
  success: { backgroundColor: '#10B981', color: 'white' },
  error: { backgroundColor: '#EF4444', color: 'white' },
  idle: { backgroundColor: 'transparent' }
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string
    };

    try {
      // Validate form data
      const validatedData = formSchema.parse(data);
    
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || 'development-key'
        },
        body: JSON.stringify(validatedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form');
      }
      
      e.currentTarget.reset();
      setSubmitStatus('success');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error instanceof z.ZodError) {
        setErrorMessage(error.errors[0].message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Failed to send message. Please try again.');
      }
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-screen-xl px-6 py-12">
      <motion.h1 
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="mb-8 text-4xl font-bold text-gray-900"
      >
        Contact Us
      </motion.h1>
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="rounded-xl bg-white p-8 shadow-sm"
      >
        <AnimatePresence mode="wait">
          {submitStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-4 p-4 rounded-md ${
                submitStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
              } text-white`}
            >
              {submitStatus === 'success' ? (
                'Message sent successfully!'
              ) : (
                errorMessage
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="input-primary mt-1"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="input-primary mt-1"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="input-primary mt-1"
              placeholder="How can we help you?"
            />
          </div>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`rounded-md bg-openai-green px-6 py-3 text-sm font-medium text-white hover:bg-opacity-90 transition-opacity ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}
