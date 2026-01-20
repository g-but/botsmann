import { type FC } from 'react';

/**
 * How It Works section for the homepage
 * Visual step-by-step explanation of using AI Professionals
 */
export const HowItWorks: FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Choose Your Professional',
      description:
        'Select the AI advisor that matches your needs - legal, health, research, language, creative, or business.',
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      number: 2,
      title: 'Ask Your Question',
      description:
        'Chat naturally or upload documents for context. Get expert-level guidance tailored to your situation.',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      number: 3,
      title: 'Get Expert Guidance',
      description:
        'Receive clear, actionable insights instantly. Personalize with your documents for even better results.',
      gradient: 'from-cyan-500 to-blue-600',
    },
  ];

  return (
    <section className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            How It Works
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get expert guidance in three simple steps
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div
              className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg`}
            >
              {step.number}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Visual connector line (hidden on mobile) */}
      <div className="hidden md:block max-w-3xl mx-auto mt-[-160px] mb-[100px]">
        <div className="flex justify-between px-8">
          <div className="w-1/3 flex justify-end pr-8">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-gray-200 mt-8" />
          </div>
          <div className="w-1/3 flex justify-start pl-8">
            <div className="w-full h-0.5 bg-gradient-to-r from-gray-200 via-gray-200 to-transparent mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
};
