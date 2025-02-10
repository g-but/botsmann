'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-white">
      <main className="flex flex-col items-center flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-gray-900 sm:text-6xl">
          Welcome to Botsmann
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl">
          Your portal to a suite of specialized AI bots and revolutionary projects.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
          <Link
            href="/projects"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
          >
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              Projects{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="text-gray-600">
              Explore LiberTech and Roboshop - our revolutionary initiatives.
            </p>
          </Link>
          <Link
            href="/bots"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
          >
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              Bots{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="text-gray-600">
              Discover our specialized AI assistants ready to help.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
