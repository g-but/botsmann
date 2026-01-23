'use client';

import React, { useState, useEffect } from 'react';
import { AICaseAnalysisProps, AnalysisResult } from './types';
import { performAnalysis } from './utils';
import { AnalyzingState } from './AnalyzingState';
import { AnalysisReport } from './AnalysisReport';

const VALUE_PROPS = [
  {
    icon: '✓',
    title: 'Clear Understanding',
    description: 'Know exactly what your case involves',
  },
  {
    icon: '✓',
    title: 'Realistic Expectations',
    description: 'Timeline, costs, and outcomes explained',
  },
  {
    icon: '✓',
    title: 'Better Prepared',
    description: 'Ready for lawyer consultation',
  },
];

const AICaseAnalysis: React.FC<AICaseAnalysisProps> = ({ intake, onContinue, onBack }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const result = performAnalysis(intake);
          setTimeout(() => {
            setAnalysis(result);
            setIsAnalyzing(false);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [intake]);

  if (isAnalyzing) {
    return <AnalyzingState progress={progress} />;
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">✨</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Analysis Complete!</h3>
            <p className="text-gray-700">
              Great news! Your case has strong merit. Here&apos;s your personalized AI analysis:
            </p>
          </div>
        </div>
      </div>

      <AnalysisReport analysis={analysis} onBack={onBack} onContinue={onContinue} />

      {/* Value Props */}
      <div className="grid md:grid-cols-3 gap-4 text-center">
        {VALUE_PROPS.map((prop) => (
          <div key={prop.title} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl mb-2">{prop.icon}</div>
            <div className="font-semibold text-gray-900 text-sm mb-1">{prop.title}</div>
            <div className="text-xs text-gray-600">{prop.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AICaseAnalysis;
