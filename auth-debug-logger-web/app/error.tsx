'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-[#f85149]">Something went wrong!</h2>
        <p className="text-[#8b949e] mb-6">
          An error occurred while loading the application.
        </p>
        <details className="mb-6">
          <summary className="cursor-pointer text-sm text-[#58a6ff]">Error details</summary>
          <pre className="mt-2 p-3 bg-[#0d1117] rounded text-xs overflow-auto">
            {error.message}
          </pre>
        </details>
        <button
          onClick={reset}
          className="w-full px-4 py-2 bg-[#238636] hover:bg-[#2ea043] rounded-md transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}