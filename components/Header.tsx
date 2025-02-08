'use client';

import React from 'react';

export default function Header() {
  return (
    <header className="p-4 bg-gray-800 text-white">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="text-xl font-bold">Botsmann</div>
        <div className="space-x-4">
          <a href="/" className="hover:text-gray-300">Home</a>
          <a href="/about" className="hover:text-gray-300">About</a>
          <a href="/bots" className="hover:text-gray-300">Bots</a>
        </div>
      </nav>
    </header>
  );
}
