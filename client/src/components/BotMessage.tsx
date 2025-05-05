import { FC } from "react";
import RankingEmbed from "./RankingEmbed";
import ErrorMessage from "./ErrorMessage";
import { Coin } from "@/lib/types";

interface BotMessageProps {
  responseType: 'loading' | 'success' | 'error';
  rankings: Coin[];
  onRetry: () => void;
  errorMessage?: string;
}

const BotMessage: FC<BotMessageProps> = ({ responseType, rankings, onRetry, errorMessage }) => {
  return (
    <div className="flex items-start group">
      <div className="w-10 h-10 rounded-full bg-[#5865F2] flex-shrink-0 flex items-center justify-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16" />
          <line x1="16" y1="16" x2="16" y2="16" />
        </svg>
      </div>
      <div className="ml-4 flex-1">
        <div className="flex items-baseline">
          <span className="font-semibold text-white mr-2">LlamaRankingBot</span>
          <span className="text-xs text-[#8E9297]">Today at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
          <span className="ml-2 text-xs px-1.5 py-0.5 bg-[#5865F2] text-white rounded-md">BOT</span>
        </div>
        
        <div className="mt-1">
          {responseType === 'loading' && (
            <div className="animate-pulse flex space-x-1 items-center text-[#DCDDDE]">
              <div>Fetching Llamacoin rankings</div>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-100"></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          
          {responseType === 'success' && (
            <RankingEmbed rankings={rankings} />
          )}
          
          {responseType === 'error' && (
            <ErrorMessage onRetry={onRetry} error={errorMessage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BotMessage;
