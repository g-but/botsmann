'use client';

/**
 * Bot Builder Wizard Page
 *
 * Multi-step wizard for creating custom AI bots
 */

import { useRouter } from 'next/navigation';
import { useBotBuilder } from '@/lib/hooks/useBotBuilder';
import {
  StepIndicator,
  StepBasicInfo,
  StepPersonality,
  StepKnowledge,
  StepReview,
} from '@/components/bot-builder';

const STEPS = [
  { label: 'Basic Info', description: 'Name and identity' },
  { label: 'Personality', description: 'Behavior and style' },
  { label: 'Knowledge', description: 'Train your bot' },
  { label: 'Review', description: 'Create your bot' },
];

export default function CreateBotPage() {
  const router = useRouter();
  const {
    state,
    nextStep,
    prevStep,
    goToStep,
    canGoNext,
    canGoPrev,
    isLastStep,
    totalSteps,
    updateBasicInfo,
    updatePersonality,
    addKnowledgeChunk,
    removeKnowledgeChunk,
    updateKnowledgeChunk,
    setSubmitting,
    setError,
    validateCurrentStep,
    getStepErrors,
  } = useBotBuilder();

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Create the bot
      const botResponse = await fetch('/api/custom-bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: state.slug,
          title: state.title,
          description: state.description || undefined,
          emoji: state.emoji,
          accent_color: state.accentColor,
          system_prompt: state.systemPrompt,
        }),
      });

      const botData = await botResponse.json();

      if (!botResponse.ok) {
        throw new Error(botData.error || 'Failed to create bot');
      }

      const botId = botData.data.bot.id;

      // Add knowledge chunks if any
      if (state.knowledgeChunks.length > 0) {
        const chunksResponse = await fetch(`/api/custom-bots/${botId}/knowledge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chunks: state.knowledgeChunks.map((c) => ({
              topic: c.topic || undefined,
              content: c.content,
              keywords: c.keywords.length > 0 ? c.keywords : undefined,
            })),
          }),
        });

        if (!chunksResponse.ok) {
          console.warn('Failed to add knowledge chunks, but bot was created');
        }
      }

      // Redirect to the new bot's page or dashboard
      router.push(`/bots/custom/${state.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Your AI Assistant</h1>
          <p className="mt-2 text-gray-600">
            Build a custom bot with your expertise and knowledge
          </p>
        </div>

        {/* Progress Indicator */}
        <StepIndicator currentStep={state.currentStep} totalSteps={totalSteps} steps={STEPS} />

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {state.currentStep === 1 && (
            <StepBasicInfo
              title={state.title}
              slug={state.slug}
              description={state.description}
              onChange={updateBasicInfo}
              errors={getStepErrors()}
            />
          )}

          {state.currentStep === 2 && (
            <StepPersonality
              emoji={state.emoji}
              accentColor={state.accentColor}
              systemPrompt={state.systemPrompt}
              onChange={updatePersonality}
              errors={getStepErrors()}
            />
          )}

          {state.currentStep === 3 && (
            <StepKnowledge
              chunks={state.knowledgeChunks}
              onAdd={addKnowledgeChunk}
              onRemove={removeKnowledgeChunk}
              onUpdate={updateKnowledgeChunk}
            />
          )}

          {state.currentStep === 4 && (
            <StepReview
              title={state.title}
              slug={state.slug}
              description={state.description}
              emoji={state.emoji}
              accentColor={state.accentColor}
              systemPrompt={state.systemPrompt}
              knowledgeChunks={state.knowledgeChunks}
              isSubmitting={state.isSubmitting}
              error={state.error}
              onSubmit={handleSubmit}
              onGoToStep={goToStep}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        {!isLastStep && (
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={!canGoPrev}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
