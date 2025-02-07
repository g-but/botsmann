import React from 'react';
import Link from 'next/link';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed w-full px-16 py-8 flex justify-between items-center bg-black/80 backdrop-blur-lg z-50">
        <div className="text-2xl font-semibold">Botsmann</div>
      </nav>
      <main className="pt-32 text-center px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold mb-8">Thank You for Reaching Out! 🚀</h1>
        <div className="space-y-4 text-lg">
          <p>We&apos;re excited to explore how we can help transform your ideas into reality.</p>
          <p>Our team has received your message and will get back to you within 24 hours.</p>
          <Link 
            href="/" 
            className="inline-block mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
