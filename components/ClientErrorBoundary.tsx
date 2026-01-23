'use client';

import { ErrorBoundary } from './ErrorBoundary';
import { type ReactNode } from 'react';

interface ClientErrorBoundaryProps {
  children: ReactNode;
}

export function ClientErrorBoundary({ children }: ClientErrorBoundaryProps): ReactNode {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
