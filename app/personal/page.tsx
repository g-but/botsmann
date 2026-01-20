'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TemplatePicker } from '@/components/shared/quick-create/TemplatePicker';
import { NameStep } from '@/components/shared/quick-create/NameStep';
import { QuickChat } from '@/components/shared/quick-create/QuickChat';
import { type BotTemplate, getTemplateById } from '@/lib/bot-templates';

type Step = 'pick' | 'name' | 'chat';

interface CreatedBot {
  template: BotTemplate;
  name: string;
  systemPrompt: string;
}

/**
 * Personal AI Page
 * Create memorial bots, companion bots, and other personal AI assistants
 */
export default function PersonalPage() {
  const [step, setStep] = useState<Step>('pick');
  const [selectedTemplate, setSelectedTemplate] = useState<BotTemplate | null>(null);
  const [createdBot, setCreatedBot] = useState<CreatedBot | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setSelectedTemplate(template);
      setStep('name');
    }
  };

  const handleNameSubmit = (name: string, additionalContext?: string) => {
    if (!selectedTemplate) return;

    // Build the system prompt from template
    const systemPrompt = selectedTemplate.systemPromptTemplate
      .replace('{{name}}', name)
      .replace('{{additional_context}}', additionalContext || '');

    setCreatedBot({
      template: selectedTemplate,
      name,
      systemPrompt,
    });
    setStep('chat');
  };

  const handleBack = () => {
    if (step === 'name') {
      setStep('pick');
      setSelectedTemplate(null);
    } else if (step === 'chat') {
      setStep('name');
    }
  };

  const handleReset = () => {
    setStep('pick');
    setSelectedTemplate(null);
    setCreatedBot(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400 to-cyan-600 rounded-full opacity-10 blur-3xl" />
      </div>

      <main className="relative max-w-screen-xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>

          {step !== 'pick' && (
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          )}
        </div>

        {/* Page Title */}
        {step === 'pick' && (
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Personal AI
              </span>
            </h1>
            <p className="text-gray-600 max-w-lg mx-auto">
              Create memorial bots for loved ones, companion bots, and other personal AI assistants
              that bring comfort and connection.
            </p>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div
            className={`flex items-center gap-2 ${step === 'pick' ? 'text-purple-600' : 'text-gray-400'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === 'pick' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              1
            </div>
            <span className="hidden sm:inline font-medium">Choose</span>
          </div>

          <div className={`w-12 h-0.5 ${step !== 'pick' ? 'bg-purple-600' : 'bg-gray-200'}`} />

          <div
            className={`flex items-center gap-2 ${step === 'name' ? 'text-purple-600' : 'text-gray-400'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === 'name'
                  ? 'bg-purple-600 text-white'
                  : step === 'chat'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </div>
            <span className="hidden sm:inline font-medium">Name</span>
          </div>

          <div className={`w-12 h-0.5 ${step === 'chat' ? 'bg-purple-600' : 'bg-gray-200'}`} />

          <div
            className={`flex items-center gap-2 ${step === 'chat' ? 'text-purple-600' : 'text-gray-400'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === 'chat' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              3
            </div>
            <span className="hidden sm:inline font-medium">Chat</span>
          </div>
        </div>

        {/* Step Content */}
        {step === 'pick' && <TemplatePicker onSelect={handleTemplateSelect} />}

        {step === 'name' && selectedTemplate && (
          <NameStep template={selectedTemplate} onSubmit={handleNameSubmit} onBack={handleBack} />
        )}

        {step === 'chat' && createdBot && <QuickChat bot={createdBot} onReset={handleReset} />}

        {/* Info for pick step */}
        {step === 'pick' && (
          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm">
              Looking for professional AI advisors?{' '}
              <Link href="/professionals" className="text-purple-600 hover:text-purple-700">
                Visit our AI Professionals
              </Link>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
