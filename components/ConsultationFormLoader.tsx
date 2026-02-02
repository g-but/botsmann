'use client';

import dynamic from 'next/dynamic';

const ConsultationForm = dynamic(() => import('@/components/ConsultationForm'), {
  loading: () => <div className="min-h-[200px] flex items-center justify-center">Loading...</div>,
  ssr: false,
});

export function ConsultationFormLoader() {
  return <ConsultationForm />;
}
