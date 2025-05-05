import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import DiscordInterface from "@/components/DiscordInterface";
import { Coin } from "@/lib/types";

export default function Home() {
  const [responseType, setResponseType] = useState<'loading' | 'success' | 'error'>('loading');
  const [rankings, setRankings] = useState<Coin[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  
  // Simulate command execution
  const executeCommand = useMutation({
    mutationFn: async (command: string) => {
      const response = await apiRequest('POST', '/api/simulate-command', { command });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.rankings && Array.isArray(data.rankings)) {
        setRankings(data.rankings);
        setResponseType('success');
        setErrorMessage(undefined);
      } else {
        setResponseType('error');
        setErrorMessage(data.error || 'Failed to retrieve ranking data');
      }
    },
    onError: (error: any) => {
      setResponseType('error');
      setErrorMessage(error?.message || 'Failed to connect to the server');
    }
  });

  // Handle command execution
  const handleCommand = () => {
    setResponseType('loading');
    executeCommand.mutate('ranking');
  };

  // Handle retry
  const handleRetry = () => {
    handleCommand();
  };
  
  return (
    <main className="min-h-screen bg-[#202225] text-white">
      <div className="container mx-auto p-4">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2 text-[#5865F2] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#5865F2" className="mr-2">
              <path d="M19.3407 4.13397C17.9268 3.49153 16.4336 3.03384 14.8958 2.80068C14.7482 3.07487 14.5778 3.44138 14.4621 3.73598C12.8405 3.51803 11.2274 3.51803 9.63899 3.73598C9.52181 3.44138 9.34997 3.07487 9.19937 2.80068C7.66024 3.03384 6.16549 3.49318 4.75001 4.13563C1.69254 8.59444 0.93651 12.9202 1.31485 17.183C3.22512 18.6155 5.09077 19.5048 6.92557 20.0792C7.32495 19.5344 7.67628 18.9572 7.97088 18.3528C7.26925 18.0897 6.59495 17.7614 5.96095 17.3829C6.07812 17.2956 6.19234 17.2034 6.30209 17.111C10.0302 18.8295 14.0642 18.8295 17.7448 17.111C17.8562 17.2034 17.9704 17.2956 18.086 17.3829C17.452 17.7614 16.7777 18.0897 16.0761 18.3528C16.3707 18.9572 16.722 19.5344 17.1214 20.0792C18.9562 19.5048 20.8219 18.6155 22.7321 17.183C23.1762 12.2297 21.9893 7.93712 19.3407 4.13397ZM8.18444 14.5503C7.01743 14.5503 6.06097 13.4811 6.06097 12.179C6.06097 10.8768 6.99805 9.80765 8.18444 9.80765C9.37085 9.80765 10.3273 10.8768 10.3079 12.179C10.3095 13.4811 9.37085 14.5503 8.18444 14.5503ZM15.9144 14.5503C14.7474 14.5503 13.7909 13.4811 13.7909 12.179C13.7909 10.8768 14.728 9.80765 15.9144 9.80765C17.1008 9.80765 18.0572 10.8768 18.0378 12.179C18.0378 13.4811 17.1008 14.5503 15.9144 14.5503Z"/>
            </svg>
            <span className="relative">
              Llama Ranking Bot
              <svg className="absolute -right-9 -top-3 h-6 w-6 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.69l1.566 5.239h5.064l-4.1 3.139 1.566 5.239L12 13.168l-4.098 3.139 1.566-5.239-4.098-3.139h5.064L12 2.69z" />
              </svg>
            </span>
          </h1>
          <p className="text-[#8E9297] mb-6">
            A Discord bot that retrieves and displays Llamacoin rankings via slash commands
          </p>
          
          <div className="max-w-md mx-auto bg-[#36393F] p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold mb-2">Try the Bot</h2>
            <p className="text-sm text-[#DCDDDE] mb-4">
              Click the button below to simulate sending the /ranking command to the bot.
            </p>
            <button 
              onClick={handleCommand}
              disabled={executeCommand.isPending}
              className="bg-[#5865F2] hover:bg-[#4752C4] px-4 py-2 rounded-md font-medium transition-colors"
            >
              {executeCommand.isPending ? 
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span> : 
                <span className="flex items-center">
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Run /ranking command
                </span>
              }
            </button>
          </div>
        </header>
        
        <DiscordInterface 
          responseType={responseType} 
          rankings={rankings}
          onRetry={handleRetry}
          errorMessage={errorMessage}
        />
      </div>
    </main>
  );
}
