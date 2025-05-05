import { FC } from "react";

interface ErrorMessageProps {
  onRetry: () => void;
  error?: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ onRetry, error }) => {
  // Determine if it's a webhook error
  const isWebhookError = error && (
    error.includes("webhook") || 
    error.includes("not registered") || 
    error.includes("404")
  );
  
  return (
    <div className="border-l-4 border-[#ED4245] bg-[#2B2D31] rounded-sm p-4">
      <div className="flex items-center text-[#ED4245] mb-2">
        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Error Fetching Rankings</span>
      </div>
      
      <p className="text-[#DCDDDE] mb-2">
        {isWebhookError ? (
          <>
            The n8n webhook is not currently active. When testing n8n webhooks, you need to:
          </>
        ) : (
          <>
            Unable to connect to the ranking data service. Please try again later or contact support if the issue persists.
          </>
        )}
      </p>
      
      {isWebhookError && (
        <ul className="text-[#DCDDDE] list-disc pl-5 mb-2 text-sm">
          <li>Log into n8n and open your workflow</li>
          <li>Click the "Test workflow" button</li>
          <li>Try this bot command again immediately after</li>
        </ul>
      )}
      
      {error && (
        <div className="bg-[#1E1F22] p-2 rounded text-xs text-[#B9BBBE] mb-3 max-h-20 overflow-y-auto">
          <code>{error}</code>
        </div>
      )}
      
      <div className="mt-3 flex">
        <button 
          className="bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm px-3 py-1.5 rounded flex items-center"
          onClick={onRetry}
        >
          <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
