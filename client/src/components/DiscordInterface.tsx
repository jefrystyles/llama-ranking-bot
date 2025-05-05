import { FC } from "react";
import BotMessage from "./BotMessage";
import { Coin } from "@/lib/types";

interface DiscordInterfaceProps {
  responseType: 'loading' | 'success' | 'error';
  rankings: Coin[];
  onRetry: () => void;
  errorMessage?: string;
}

const DiscordInterface: FC<DiscordInterfaceProps> = ({ 
  responseType, 
  rankings,
  onRetry,
  errorMessage
}) => {
  return (
    <div className="max-w-5xl mx-auto bg-[#36393F] rounded-lg overflow-hidden shadow-lg">
      {/* Discord header */}
      <header className="bg-[#202225] py-2 px-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#5865F2">
              <path d="M19.3407 4.13397C17.9268 3.49153 16.4336 3.03384 14.8958 2.80068C14.7482 3.07487 14.5778 3.44138 14.4621 3.73598C12.8405 3.51803 11.2274 3.51803 9.63899 3.73598C9.52181 3.44138 9.34997 3.07487 9.19937 2.80068C7.66024 3.03384 6.16549 3.49318 4.75001 4.13563C1.69254 8.59444 0.93651 12.9202 1.31485 17.183C3.22512 18.6155 5.09077 19.5048 6.92557 20.0792C7.32495 19.5344 7.67628 18.9572 7.97088 18.3528C7.26925 18.0897 6.59495 17.7614 5.96095 17.3829C6.07812 17.2956 6.19234 17.2034 6.30209 17.111C10.0302 18.8295 14.0642 18.8295 17.7448 17.111C17.8562 17.2034 17.9704 17.2956 18.086 17.3829C17.452 17.7614 16.7777 18.0897 16.0761 18.3528C16.3707 18.9572 16.722 19.5344 17.1214 20.0792C18.9562 19.5048 20.8219 18.6155 22.7321 17.183C23.1762 12.2297 21.9893 7.93712 19.3407 4.13397ZM8.18444 14.5503C7.01743 14.5503 6.06097 13.4811 6.06097 12.179C6.06097 10.8768 6.99805 9.80765 8.18444 9.80765C9.37085 9.80765 10.3273 10.8768 10.3079 12.179C10.3095 13.4811 9.37085 14.5503 8.18444 14.5503ZM15.9144 14.5503C14.7474 14.5503 13.7909 13.4811 13.7909 12.179C13.7909 10.8768 14.728 9.80765 15.9144 9.80765C17.1008 9.80765 18.0572 10.8768 18.0378 12.179C18.0378 13.4811 17.1008 14.5503 15.9144 14.5503Z"/>
            </svg>
            <span className="font-semibold">Discord</span>
          </div>
          <div className="flex items-center space-x-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E9297" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E9297" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-semibold">
              U
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Server list */}
        <div className="w-16 bg-[#202225] flex flex-col items-center py-4 space-y-4">
          <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white hover:rounded-2xl transition-all duration-200 cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div className="w-12 h-0.5 bg-[#2F3136]"></div>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:rounded-2xl transition-all duration-200 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#FEE75C] flex items-center justify-center text-black">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="8"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
          </div>
        </div>

        {/* Channel list */}
        <div className="w-60 bg-[#2F3136] flex flex-col">
          <div className="p-4 shadow-sm">
            <h2 className="font-semibold text-lg">Llamacoin Community</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="mb-4">
              <div className="text-[#8E9297] uppercase text-xs font-semibold mb-1 px-2">Text Channels</div>
              <div className="space-y-1">
                <div className="flex items-center py-1 px-2 rounded hover:bg-[#36393F] cursor-pointer opacity-60">
                  <svg width="16" height="16" className="mr-2 text-[#8E9297]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h16"></path>
                    <path d="M4 6h16"></path>
                    <path d="M4 18h16"></path>
                  </svg>
                  <span>general</span>
                </div>
                <div className="flex items-center py-1 px-2 rounded hover:bg-[#36393F] cursor-pointer opacity-60">
                  <svg width="16" height="16" className="mr-2 text-[#8E9297]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>announcements</span>
                </div>
                <div className="flex items-center py-1 px-2 rounded bg-[#36393F] cursor-pointer">
                  <svg width="16" height="16" className="mr-2 text-[#8E9297]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <span>bot-commands</span>
                </div>
                <div className="flex items-center py-1 px-2 rounded hover:bg-[#36393F] cursor-pointer opacity-60">
                  <svg width="16" height="16" className="mr-2 text-[#8E9297]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="8" r="0.5"></circle>
                    <line x1="12" y1="12" x2="12" y2="16"></line>
                  </svg>
                  <span>support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-[#36393F]">
          <div className="p-4 shadow-sm flex items-center border-b border-[#202225]">
            <svg width="16" height="16" className="mr-2 text-[#8E9297]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <span className="font-semibold">bot-commands</span>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* System message */}
            <div className="flex items-center justify-center">
              <div className="bg-[#2F3136] rounded-md px-4 py-2 text-sm text-[#8E9297]">
                This is the start of the #bot-commands channel
              </div>
            </div>

            {/* User message with slash command */}
            <div className="flex items-start group">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-white font-semibold">
                C
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-baseline">
                  <span className="font-semibold text-white mr-2">CryptoTrader</span>
                  <span className="text-xs text-[#8E9297]">Today at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                </div>
                <div className="mt-1 text-[#DCDDDE]">
                  <div className="bg-[#2F3136] inline-block rounded px-2 py-1 text-blue-300 font-mono text-sm">/ranking</div>
                </div>
              </div>
            </div>

            {/* Bot response */}
            <BotMessage 
              responseType={responseType} 
              rankings={rankings}
              onRetry={onRetry}
              errorMessage={errorMessage}
            />
          </div>

          {/* Command input */}
          <div className="p-4 bg-[#2F3136]">
            <div className="bg-[#202225] rounded-lg flex items-center p-2">
              <button className="text-[#8E9297] hover:text-[#DCDDDE] p-2 rounded-full hover:bg-gray-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </button>
              <input 
                type="text" 
                placeholder="Message #bot-commands" 
                className="bg-transparent flex-1 mx-2 focus:outline-none text-[#DCDDDE] placeholder-[#8E9297]"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Member list */}
        <div className="w-60 bg-[#2F3136] p-4 hidden lg:block">
          <h3 className="text-[#8E9297] uppercase text-xs font-semibold mb-2">Online — 4</h3>
          <div className="space-y-1 overflow-y-auto">
            <div className="flex items-center py-1 hover:bg-[#36393F] rounded px-2 cursor-pointer">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  C
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#57F287] border-2 border-[#2F3136] rounded-full"></div>
              </div>
              <span className="ml-2 text-[#DCDDDE] truncate">CryptoTrader</span>
            </div>
            <div className="flex items-center py-1 hover:bg-[#36393F] rounded px-2 cursor-pointer">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                    <line x1="8" y1="16" x2="8" y2="16" />
                    <line x1="16" y1="16" x2="16" y2="16" />
                  </svg>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#57F287] border-2 border-[#2F3136] rounded-full"></div>
              </div>
              <span className="ml-2 text-[#DCDDDE] truncate">LlamaRankingBot</span>
              <span className="ml-1 text-xs text-[#8E9297]">BOT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordInterface;
