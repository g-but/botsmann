import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Project } from '@/src/types/project';

async function getProject(): Promise<Project | null> {
  try {
    const projectPath = path.join(process.cwd(), 'content', 'projects', 'governance.json');
    const content = fs.readFileSync(projectPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

export default async function GovSpendingTracker() {
  const project = await getProject();
  
  if (!project) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-screen-xl px-6 py-16">
        <div className="mb-16">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900">{project.title}</h1>
          <p className="mb-8 text-lg text-gray-600">{project.overview}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {project.features.map((feature, index) => (
            <div key={index} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">{feature.title}</h2>
              <p className="mb-6 text-gray-600">{feature.description}</p>
              {feature.icon && (
                <div className="text-4xl text-openai-green">{feature.icon}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="mb-8 text-3xl font-semibold text-gray-900">Details</h2>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="mb-6 text-lg text-gray-600">{project.details}</p>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-md bg-openai-green px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
