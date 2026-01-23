import { CaseContext, UploadedFile, LawyerProfile } from '../types';

export type DemoStep = 'input' | 'lawyer-match' | 'workspace' | 'dataroom';

export interface StepInfo {
  id: DemoStep;
  label: string;
  icon: string;
}

export const DEMO_STEPS: StepInfo[] = [
  { id: 'input', label: 'Case Details', icon: '📝' },
  { id: 'lawyer-match', label: 'Find Lawyer', icon: '👨‍⚖️' },
  { id: 'workspace', label: 'AI Workspace', icon: '🤖' },
  { id: 'dataroom', label: 'Data Room', icon: '💬' },
];

export const STEP_ORDER: DemoStep[] = ['input', 'lawyer-match', 'workspace', 'dataroom'];

export interface CaseInputStepProps {
  caseContext: CaseContext;
  onCaseContextChange: (updates: Partial<CaseContext>) => void;
  onFilesUploaded: (files: UploadedFile[]) => void;
}

export interface LawyerMatchStepProps {
  caseContext: CaseContext;
  selectedLawyer: string | null;
  onSelectLawyer: (lawyerId: string | null) => void;
  lawyers: LawyerProfile[];
}

export interface WorkspaceStepProps {
  caseContext: CaseContext;
  selectedLawyerName: string;
}

export interface DataRoomStepProps {
  caseContext: CaseContext;
  selectedLawyerUsername: string;
  selectedLawyerAvatar: string;
}

export interface ProgressStepsProps {
  currentStep: DemoStep;
}

export interface NavigationButtonsProps {
  step: DemoStep;
  canProceed: boolean;
  onBack: () => void;
  onProceed: () => void;
  onReset: () => void;
}
