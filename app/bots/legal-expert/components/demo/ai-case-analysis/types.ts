import { CaseIntake } from '../../workspace/types';

export interface AnalysisResult {
  summary: {
    type: string;
    jurisdiction: string;
    complexity: 'Low' | 'Medium' | 'High';
  };
  legalAssessment: {
    relevantLaws: string[];
    keyConsiderations: Array<{ text: string; type: 'success' | 'warning' | 'info' }>;
    successProbability: number;
  };
  expectations: {
    timeline: string;
    estimatedCost: string;
    requiredDocuments: string[];
    nextSteps: string[];
  };
  recommendations: string[];
}

export interface AICaseAnalysisProps {
  intake: CaseIntake;
  onContinue: () => void;
  onBack: () => void;
}

export interface AnalyzingStateProps {
  progress: number;
}
