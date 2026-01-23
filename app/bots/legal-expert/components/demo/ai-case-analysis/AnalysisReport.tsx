'use client';

import React from 'react';
import { AnalysisResult } from './types';

interface AnalysisReportProps {
  analysis: AnalysisResult;
  onBack: () => void;
  onContinue: () => void;
}

const getComplexityColor = (complexity: string) => {
  if (complexity === 'Low') return 'text-green-600';
  if (complexity === 'Medium') return 'text-yellow-600';
  return 'text-red-600';
};

const getConsiderationIcon = (type: 'success' | 'warning' | 'info') => {
  if (type === 'success') return '✓';
  if (type === 'warning') return '⚠️';
  return 'ℹ️';
};

const getConsiderationColor = (type: 'success' | 'warning' | 'info') => {
  if (type === 'success') return 'text-green-600';
  if (type === 'warning') return 'text-yellow-600';
  return 'text-blue-600';
};

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ analysis, onBack, onContinue }) => (
  <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6">
      <h3 className="text-2xl font-bold text-white flex items-center gap-3">
        <span>🤖</span> AI Case Analysis Report
      </h3>
    </div>

    <div className="p-8 space-y-8">
      {/* Case Summary */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>📋</span> Case Summary
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Type</div>
            <div className="font-semibold text-gray-900">{analysis.summary.type}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Jurisdiction</div>
            <div className="font-semibold text-gray-900">{analysis.summary.jurisdiction}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Complexity</div>
            <div className={`font-semibold ${getComplexityColor(analysis.summary.complexity)}`}>
              {analysis.summary.complexity}
            </div>
          </div>
        </div>
      </div>

      {/* Legal Assessment */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>⚖️</span> Legal Assessment
        </h4>

        <div className="space-y-4">
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">Relevant Laws:</div>
            <ul className="space-y-1">
              {analysis.legalAssessment.relevantLaws.map((law, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{law}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">Key Considerations:</div>
            <div className="space-y-2">
              {analysis.legalAssessment.keyConsiderations.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className={`mt-0.5 ${getConsiderationColor(item.type)}`}>
                    {getConsiderationIcon(item.type)}
                  </span>
                  <span className="text-sm text-gray-600">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-700 mb-1">Success Probability:</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${analysis.legalAssessment.successProbability}%` }}
                />
              </div>
              <span className="text-lg font-bold text-green-600">
                {analysis.legalAssessment.successProbability}%
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {analysis.legalAssessment.successProbability >= 80
                ? 'High probability of favorable outcome'
                : analysis.legalAssessment.successProbability >= 60
                ? 'Good chances with proper legal representation'
                : 'Moderate probability, requires strategic approach'}
            </p>
          </div>
        </div>
      </div>

      {/* What to Expect */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>📊</span> What to Expect
        </h4>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-700 mb-1">Timeline</div>
            <div className="text-lg font-bold text-blue-600">{analysis.expectations.timeline}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-700 mb-1">Estimated Cost</div>
            <div className="text-lg font-bold text-blue-600">
              {analysis.expectations.estimatedCost}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Required Documents ({analysis.expectations.requiredDocuments.length}):
            </div>
            <ul className="space-y-1">
              {analysis.expectations.requiredDocuments.map((doc, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">📄</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">Next Steps:</div>
            <ol className="space-y-1">
              {analysis.expectations.nextSteps.map((step, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>💡</span> AI Recommendations
        </h4>
        <ul className="space-y-2">
          {analysis.recommendations.map((rec, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Actions */}
    <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
            Download PDF
          </button>
          <button
            onClick={onContinue}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all shadow-lg"
          >
            Find Perfect Lawyer →
          </button>
        </div>
      </div>
    </div>
  </div>
);
