import React from 'react';

export default function Footer() {
  return (
    <footer className="p-4 bg-gray-800 text-white mt-auto">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div>© {new Date().getFullYear()} Botsmann. All rights reserved.</div>
        <nav className="space-x-4">
          <a href="/privacy" className="hover:text-gray-300">Privacy</a>
          <a href="/terms" className="hover:text-gray-300">Terms</a>
          <a href="/contact" className="hover:text-gray-300">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
