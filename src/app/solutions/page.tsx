import React from 'react';
import Link from 'next/link';

export default function Solutions() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-semibold mb-8">Contact Us for Details</h1>
      <Link 
        href="/" 
        className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-md hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </div>
  );
}
