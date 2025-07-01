import React, { useState } from 'react';

function ExplanationPanel({ page, onSimplify, explanation, loading, error }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (explanation) {
      navigator.clipboard.writeText(explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (!page) {
    return <div className="text-gray-400">No page selected.</div>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-4 w-full border rounded p-4 bg-white min-h-[100px]">
        <div className="font-semibold mb-2">Selected Page/Slide Content:</div>
        <pre className="whitespace-pre-wrap text-left text-sm">{page.content}</pre>
      </div>
      <div className="flex gap-2 mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          onClick={onSimplify}
          disabled={loading}
        >
          {loading ? 'Simplifying...' : 'Simplify'}
        </button>
        {explanation && (
          <>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
              onClick={handleCopy}
              disabled={loading}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </>
        )}
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {explanation && (
        <div className="w-full border rounded p-4 bg-green-50 mt-2">
          <div className="font-semibold mb-2">AI Explanation:</div>
          <pre className="whitespace-pre-wrap text-left text-sm">{explanation}</pre>
        </div>
      )}
    </div>
  );
}

export default ExplanationPanel; 