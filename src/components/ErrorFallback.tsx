import React, { memo } from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = memo(({ error, resetErrorBoundary }) => {
  // Memoize the error message to prevent unnecessary re-renders
  const errorMessage = React.useMemo(() => error.message, [error]);

  return (
    <div role="alert" className="flex flex-col items-center justify-center h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
      <p className="text-lg mb-4">We&apos;re sorry for the inconvenience. Please try refreshing the page.</p>
      <pre className="text-sm text-red-500 mb-4 max-w-full overflow-x-auto">{errorMessage}</pre>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={resetErrorBoundary}
      >
        Try again
      </button>
    </div>
  );
});

ErrorFallback.displayName = 'ErrorFallback';

export default ErrorFallback;