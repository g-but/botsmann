import React from 'react';
import Link from 'next/link';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { Logo } from '@/components/shared/Logo';
import { site } from '@/lib/site';
import { ROUTES } from '@/lib/routes';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white text-sm">
      <div className="mx-auto max-w-screen-xl px-6 py-10 grid gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <div className="mb-4">
            <Logo size="sm" />
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">{site.description.split('.')[0]}.</p>
        </div>

        {/* Product */}
        <div>
          <h2 className="mb-4 font-semibold text-gray-800">Product</h2>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link href={ROUTES.BOTS} className="hover:text-blue-600 transition-colors">
                AI Assistants
              </Link>
            </li>
            <li>
              <Link href={ROUTES.DOCUMENTS} className="hover:text-blue-600 transition-colors">
                Your Documents
              </Link>
            </li>
            <li>
              <Link href={ROUTES.SOLUTIONS} className="hover:text-blue-600 transition-colors">
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
              <Link
                href={`${ROUTES.PROJECTS}/governance`}
                className="hover:text-blue-600 transition-colors"
              >
                Governance
              </Link>
            </li>
            <li>
              <Link
                href={`${ROUTES.PROJECTS}/finance`}
                className="hover:text-blue-600 transition-colors"
              >
                Finance
              </Link>
            </li>
            <li>
              <Link
                href={`${ROUTES.PROJECTS}/techno-capital`}
                className="hover:text-blue-600 transition-colors"
              >
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
              <Link href={ROUTES.BLOG} className="hover:text-blue-600 transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-600 transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href={ROUTES.CONTACT} className="hover:text-blue-600 transition-colors">
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
                href={site.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <FaGithub className="text-lg" /> GitHub
              </a>
            </li>
            <li>
              <a
                href={site.social.twitter}
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
        <p>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <p className="text-xs mt-2 text-gray-400">{site.tagline}</p>
      </div>
    </footer>
  );
}
