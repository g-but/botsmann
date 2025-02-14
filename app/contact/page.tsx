import React from 'react';

export default function Contact() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-semibold tracking-tight">Contact Us</h1>
      <div className="prose prose-lg">
        <p>
          We'd love to hear from you! Please reach out to us at{' '}
          <a href="mailto:contact@botsmann.com" className="text-openai-green hover:underline">
            contact@botsmann.com
          </a>
        </p>
      </div>
    </div>
  );
}
