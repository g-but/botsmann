import React from 'react';
import ConsultationForm from '@/components/ConsultationForm';
import { NextSection } from '@/components/navigation/NextSection';

export default function About() {
  return (
    <div className="mx-auto max-w-prose px-6 py-12">
      <h1 className="mb-8 text-4xl font-semibold tracking-tight">About Botsmann</h1>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-medium">Your Data. Your AI. Your Control.</h2>
        <p className="mb-6 text-lg text-gray-600">
          We believe that AI should work for you, not the other way around. Your sensitive documents,
          your business knowledge, and your private data should stay exactly where they belong:
          under your control, on your infrastructure.
        </p>
        <p className="mb-6 text-lg text-gray-600">
          Botsmann is built on three core principles: data sovereignty, model freedom, and
          local-first deployment. We help organizations harness the power of AI without
          sacrificing privacy or becoming dependent on external services.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-medium">Privacy-First AI</h2>
        <p className="mb-6 text-lg text-gray-600">
          Unlike cloud-based AI services that process your data on external servers, Botsmann
          enables you to run AI models locally. Your medical records, legal documents, financial
          data, and proprietary information never leave your infrastructure.
        </p>
        <ul className="mb-6 space-y-2 text-lg text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Documents processed on your hardware</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>No data sent to external AI providers</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Full audit trail of AI decisions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>GDPR and HIPAA compliant by design</span>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-medium">Bring Your Own Model</h2>
        <p className="mb-6 text-lg text-gray-600">
          No vendor lock-in. Choose the AI model that fits your needs and budget:
        </p>
        <ul className="mb-6 space-y-2 text-lg text-gray-600">
          <li className="flex items-start gap-2">
            <span className="font-semibold text-blue-600">Groq (Free)</span>
            <span>— Fast inference with Llama 3.1, no cost for getting started</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-purple-600">OpenAI</span>
            <span>— Premium quality with GPT-4, bring your own API key</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-gray-700">Ollama (Local)</span>
            <span>— Maximum privacy, run models entirely on your hardware</span>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-medium">Our Consulting Services</h2>
        <p className="mb-6 text-lg text-gray-600">
          Try our platform for free to see how AI can transform your workflows. When you are ready
          to deploy on your own infrastructure, we provide consulting services to:
        </p>
        <ul className="mb-6 space-y-2 text-lg text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Set up Botsmann on your servers or private cloud</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Configure local LLM deployment with Ollama</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Train your team on document management and AI chat</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">→</span>
            <span>Custom integrations with your existing systems</span>
          </li>
        </ul>
      </section>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold">Ready to Take Control?</h2>
        <p className="mb-6 text-gray-600">
          Tell us about your use case. We will show you how Botsmann can help you leverage AI
          while keeping your data private and secure.
        </p>
        <div className="mx-auto max-w-md">
          <ConsultationForm />
        </div>
      </div>

      <NextSection
        nextPage="/documents"
        title="Try It Now"
        description="Upload your documents and start chatting with your knowledge base. Free to try, no credit card required."
      />
    </div>
  );
}
