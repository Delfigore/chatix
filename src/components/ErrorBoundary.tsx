'use client'

import React, { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './ErrorFallback';

interface Props {
  children: ReactNode;
}

const ErrorBoundaryWrapper: React.FC<Props> = ({ children }) => {
  const handleReset = () => {
    // Reset the state of your app here
    window.location.reload();
  };

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={handleReset}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundaryWrapper;