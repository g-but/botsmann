import { CaseIntake } from '../../workspace/types';
import { LEGAL_AREAS } from '../../workspace/constants';
import { AnalysisResult } from './types';

export const getLaws = (intake: CaseIntake): string[] => {
  if (intake.jurisdiction.country === 'CH') {
    const lawMap: Record<string, string[]> = {
      immigration: ['Swiss Federal Act on Foreign Nationals (FNA)', 'Federal Ordinance on Admission (OASA)'],
      employment: ['Swiss Federal Code of Obligations (CO Art. 319-362)', 'Federal Act on Work (ArG)'],
      'real-estate': ['Swiss Civil Code (ZGB - Federal)', 'Federal Act on Data Protection (FADP)'],
      family: ['Swiss Civil Code (Family Law - ZGB)', 'Federal Act on Registered Partnerships'],
      business: ['Swiss Code of Obligations (CO)', 'Federal Act on Unfair Competition'],
    };
    return lawMap[intake.legalArea] || ['Swiss Civil Code (Federal)', 'Swiss Code of Obligations (Federal)'];
  } else {
    const lawMap: Record<string, string[]> = {
      immigration: ['Immigration and Nationality Act (INA - Federal)', 'California TRUTH Act'],
      employment: ['Fair Labor Standards Act (FLSA - Federal)', 'California Labor Code'],
      'real-estate': ['Federal Fair Housing Act', 'California Civil Code (Property)'],
      family: ['Uniform Parentage Act', 'California Family Code'],
      business: ['Federal Securities Laws', 'California Corporations Code'],
      'intellectual-property': ['US Patent Act (Federal)', 'Lanham Act (Federal Trademark)'],
    };
    return lawMap[intake.legalArea] || ['Relevant Federal Laws', 'California State Law'];
  }
};

export const getConsiderations = (intake: CaseIntake) => {
  const base: { text: string; type: 'success' | 'warning' }[] = [
    { text: 'Case eligibility confirmed based on provided details', type: 'success' },
  ];

  if (intake.urgency === 'urgent') {
    base.push({ text: 'Expedited process may be available', type: 'warning' });
  }

  if (!intake.files || intake.files.length === 0) {
    base.push({ text: 'Additional documentation will be required', type: 'warning' });
  }

  return base;
};

export const getTimeline = (intake: CaseIntake): string => {
  const timelineMap: Record<string, string> = {
    immigration: '2-4 months',
    employment: '4-8 weeks',
    'real-estate': '6-12 weeks',
    family: '3-6 months',
  };
  return timelineMap[intake.legalArea] || '2-3 months';
};

export const getCost = (intake: CaseIntake): string => {
  if (intake.jurisdiction.country === 'CH') {
    if (intake.budget === 'fixed') return 'CHF 2,000 - 4,000 (fixed fee)';
    if (intake.budget === 'hourly') return 'CHF 250-400/hour (est. 10-15 hours)';
    return 'CHF 500 (initial consultation)';
  } else {
    if (intake.budget === 'fixed') return '$3,000 - $6,000 (fixed fee)';
    if (intake.budget === 'hourly') return '$200-350/hour (est. 12-20 hours)';
    return '$300 (initial consultation)';
  }
};

export const getDocuments = (intake: CaseIntake): string[] => {
  const docMap: Record<string, string[]> = {
    immigration: [
      'Valid passport',
      'Employment contract',
      'Proof of qualifications',
      'Financial statements',
      'Housing documentation',
    ],
    employment: [
      'Employment contract',
      'Communication records',
      'Performance reviews',
      'Company policies',
      'Termination letter (if applicable)',
    ],
    'real-estate': [
      'Property deed',
      'Purchase agreement',
      'Inspection reports',
      'Title insurance',
      'Financial documents',
    ],
  };
  return (
    docMap[intake.legalArea] || [
      'Identification documents',
      'Relevant contracts',
      'Supporting evidence',
      'Financial records',
    ]
  );
};

export const getNextSteps = (): string[] => [
  'Review and gather all required documentation',
  'Schedule consultation with matched lawyer',
  'Prepare detailed timeline and action plan',
];

export const getRecommendations = (intake: CaseIntake): string[] => {
  const recs = ['Start gathering required documents now to expedite the process'];

  if (intake.urgency === 'urgent') {
    recs.push('Request expedited processing if available for your case type');
  }

  if (intake.caseType === 'business') {
    recs.push('Consider involving company legal counsel or compliance officer');
  }

  const legalAreaName = LEGAL_AREAS.find((a) => a.id === intake.legalArea)?.name.toLowerCase();
  recs.push(`Consult with a ${legalAreaName} specialist`);

  return recs;
};

export const performAnalysis = (intake: CaseIntake): AnalysisResult => {
  const legalAreaName = LEGAL_AREAS.find((a) => a.id === intake.legalArea)?.name || intake.legalArea;
  const jurisdictionName =
    intake.jurisdiction.country === 'CH' ? 'Zürich, Switzerland' : 'California, United States';

  return {
    summary: {
      type: `${intake.caseType === 'personal' ? 'Personal' : 'Business'} - ${legalAreaName}`,
      jurisdiction: jurisdictionName,
      complexity:
        intake.description.length > 200
          ? 'High'
          : intake.description.length > 100
          ? 'Medium'
          : 'Low',
    },
    legalAssessment: {
      relevantLaws: getLaws(intake),
      keyConsiderations: getConsiderations(intake),
      successProbability: Math.floor(Math.random() * 20) + 75,
    },
    expectations: {
      timeline: getTimeline(intake),
      estimatedCost: getCost(intake),
      requiredDocuments: getDocuments(intake),
      nextSteps: getNextSteps(),
    },
    recommendations: getRecommendations(intake),
  };
};
