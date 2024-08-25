import React, { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface Props {
  children: ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
      <p className="text-lg mb-4">We&apos;re sorry for the inconvenience. Please try refreshing the page.</p>
      <pre className="text-sm text-red-500 mb-4">{error.message}</pre>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={resetErrorBoundary}
      >
        Try again
      </button>
    </div>
  );
}

export default function ErrorBoundary({ children }: Props) {
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }
  
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {
      // Reset the state of your app here
    }}>
      {children}
    </ReactErrorBoundary>
  );
}