'use client';

import React, { useState } from 'react';
import { MOCK_LAWYERS } from '../constants';
import { CaseContext, UploadedFile } from '../types';
import WorkspaceDashboard from '../WorkspaceDashboard';
import { DemoStep } from './types';
import { ProgressSteps } from './ProgressSteps';
import { NavigationButtons } from './NavigationButtons';
import { CaseInputStep, LawyerMatchStep, WorkspaceStep, DataRoomStep } from './steps';

const INITIAL_CASE_CONTEXT: CaseContext = {
  jurisdiction: 'US',
  legalArea: 'immigration',
  description: '',
  files: [],
  urgency: 'medium',
};

const DemoSection: React.FC = () => {
  const [step, setStep] = useState<DemoStep>('input');
  const [caseContext, setCaseContext] = useState<CaseContext>(INITIAL_CASE_CONTEXT);
  const [selectedLawyer, setSelectedLawyer] = useState<string | null>(null);
  const [showWorkspace, setShowWorkspace] = useState(false);

  const handleFilesUploaded = (newFiles: UploadedFile[]) => {
    setCaseContext((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles.filter((nf) => !prev.files.some((pf) => pf.id === nf.id))],
    }));
  };

  const handleCaseContextChange = (updates: Partial<CaseContext>) => {
    setCaseContext((prev) => ({ ...prev, ...updates }));
  };

  const handleProceed = () => {
    if (step === 'input') {
      setStep('lawyer-match');
    } else if (step === 'lawyer-match') {
      setStep('workspace');
    } else if (step === 'workspace') {
      setShowWorkspace(true);
    }
  };

  const handleFileDelete = (fileId: string) => {
    setCaseContext((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.id !== fileId),
    }));
  };

  const handleFileVisibilityChange = (fileId: string, visibility: string) => {
    setCaseContext((prev) => ({
      ...prev,
      files: prev.files.map((f) =>
        f.id === fileId
          ? { ...f, visibility: visibility as UploadedFile['visibility'] }
          : f
      ),
    }));
  };

  const handleBack = () => {
    if (step === 'dataroom') {
      setStep('workspace');
    } else if (step === 'workspace') {
      setStep('lawyer-match');
    } else if (step === 'lawyer-match') {
      setStep('input');
    }
  };

  const handleReset = () => {
    setStep('input');
    setCaseContext(INITIAL_CASE_CONTEXT);
    setSelectedLawyer(null);
  };

  const canProceed =
    step === 'input'
      ? caseContext.description.trim().length > 20
      : step === 'lawyer-match'
      ? selectedLawyer !== null
      : true;

  const selectedLawyerData = MOCK_LAWYERS.find((l) => l.id === selectedLawyer);

  return (
    <>
      <section className="mb-20" id="demo">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full text-sm font-medium mb-6">
            <span className="mr-2">💻</span>
            Interactive Demo
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Experience Lex in Action</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how Lex transforms legal case management with AI-powered matching, intelligent file
            organization, and collaborative workspaces
          </p>
        </div>

        <ProgressSteps currentStep={step} />

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {step === 'input' && (
            <CaseInputStep
              caseContext={caseContext}
              onCaseContextChange={handleCaseContextChange}
              onFilesUploaded={handleFilesUploaded}
            />
          )}

          {step === 'lawyer-match' && (
            <LawyerMatchStep
              caseContext={caseContext}
              selectedLawyer={selectedLawyer}
              onSelectLawyer={setSelectedLawyer}
              lawyers={MOCK_LAWYERS}
            />
          )}

          {step === 'workspace' && (
            <WorkspaceStep
              caseContext={caseContext}
              selectedLawyerName={selectedLawyerData?.username || 'Legal Expert'}
            />
          )}

          {step === 'dataroom' && (
            <DataRoomStep
              caseContext={caseContext}
              selectedLawyerUsername={selectedLawyerData?.username || '@LegalExpert'}
              selectedLawyerAvatar={selectedLawyerData?.avatar || '👨‍⚖️'}
            />
          )}

          <NavigationButtons
            step={step}
            canProceed={canProceed}
            onBack={handleBack}
            onProceed={handleProceed}
            onReset={handleReset}
          />
        </div>
      </section>

      {/* Workspace Dashboard - Full Screen Portal */}
      {showWorkspace && selectedLawyerData && (
        <WorkspaceDashboard
          files={caseContext.files}
          lawyer={selectedLawyerData}
          caseDescription={caseContext.description}
          onClose={() => setShowWorkspace(false)}
          onFileUpload={handleFilesUploaded}
          onFileDelete={handleFileDelete}
          onFileVisibilityChange={handleFileVisibilityChange}
        />
      )}
    </>
  );
};

export default DemoSection;
