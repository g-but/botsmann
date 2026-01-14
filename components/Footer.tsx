import React from 'react';
import Link from 'next/link';
import { FaGithub, FaTwitter } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white text-sm">
      <div className="mx-auto max-w-screen-xl px-6 py-10 grid gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg px-3 py-1.5 rounded-lg">
              B
            </div>
            <span className="text-xl font-bold text-gray-900">Botsmann</span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed">
            Private AI that works with your data. Pre-built assistants or bring your own documents.
          </p>
        </div>

        {/* Product */}
        <div>
          <h2 className="mb-4 font-semibold text-gray-800">Product</h2>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link href="/bots" className="hover:text-blue-600 transition-colors">
                AI Assistants
              </Link>
            </li>
            <li>
              <Link href="/documents" className="hover:text-blue-600 transition-colors">
                Your Documents
              </Link>
            </li>
            <li>
              <Link href="/solutions" className="hover:text-blue-600 transition-colors">
                Solutions
              </Link>
            </li>
          </ul>
        </div>

        {/* Projects */}
        <div>
          <h2 className="mb-4 font-semibold text-gray-800">Projects</h2>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link href="/projects/governance" className="hover:text-blue-600 transition-colors">
                Governance
              </Link>
            </li>
            <li>
              <Link href="/projects/finance" className="hover:text-blue-600 transition-colors">
                Finance
              </Link>
            </li>
            <li>
              <Link href="/projects/techno-capital" className="hover:text-blue-600 transition-colors">
                Techno-Capital
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h2 className="mb-4 font-semibold text-gray-800">Resources</h2>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link href="/knowledge" className="hover:text-blue-600 transition-colors">
                Knowledge Base
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-blue-600 transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-600 transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600 transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h2 className="mb-4 font-semibold text-gray-800">Connect</h2>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a
                href="https://github.com/g-but"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <FaGithub className="text-lg" /> GitHub
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/AithelionV"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <FaTwitter className="text-lg" /> Twitter
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 py-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Botsmann. All rights reserved.</p>
        <p className="text-xs mt-2 text-gray-400">
          Your Data. Your AI. Your Control.
        </p>
      </div>
    </footer>
  );
}
