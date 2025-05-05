import { FC, useState } from "react";
import { Coin } from "@/lib/types";

interface RankingEmbedProps {
  rankings: Coin[];
}

const RankingEmbed: FC<RankingEmbedProps> = ({ rankings }) => {
  const [activeTab, setActiveTab] = useState('top10');
  
  // Format the rankings based on active tab
  const displayRankings = rankings.slice(0, 5); // Just show first 5 for demo
  
  return (
    <div className="border-l-4 border-[#FEE75C] bg-[#2B2D31] rounded-sm p-4 max-w-3xl">
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 rounded-full bg-[#FEE75C] flex items-center justify-center text-black mr-2">
          <i className="fa-solid fa-coins text-xs"></i>
        </div>
        <h3 className="text-white font-semibold">Llamacoin Rankings</h3>
        <span className="ml-auto text-xs text-[#8E9297]">Last updated: {new Date().toLocaleDateString()}</span>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-3">
        <button 
          className={`px-3 py-2 text-sm font-medium ${activeTab === 'top10' ? 'border-b-2 border-[#5865F2] text-white' : 'text-[#8E9297] hover:text-[#DCDDDE]'}`}
          onClick={() => setActiveTab('top10')}
        >
          Top 10
        </button>
        <button 
          className={`px-3 py-2 text-sm font-medium ${activeTab === 'trending' ? 'border-b-2 border-[#5865F2] text-white' : 'text-[#8E9297] hover:text-[#DCDDDE]'}`}
          onClick={() => setActiveTab('trending')}
        >
          Trending
        </button>
        <button 
          className={`px-3 py-2 text-sm font-medium ${activeTab === 'watchlist' ? 'border-b-2 border-[#5865F2] text-white' : 'text-[#8E9297] hover:text-[#DCDDDE]'}`}
          onClick={() => setActiveTab('watchlist')}
        >
          Watchlist
        </button>
      </div>
      
      {/* Rankings table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[#8E9297] border-b border-gray-700">
            <tr>
              <th className="pb-2 font-medium">#</th>
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium text-right">Price</th>
              <th className="pb-2 font-medium text-right">24h %</th>
              <th className="pb-2 font-medium text-right">Market Cap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {displayRankings.map((coin) => (
              <tr key={coin.id} className="hover:bg-gray-800/40 cursor-pointer">
                <td className="py-2 font-medium">{coin.rank}</td>
                <td className="py-2">
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-[#FEE75C] flex items-center justify-center text-black mr-2">
                      <i className="fa-solid fa-coins text-xs"></i>
                    </div>
                    <span className="font-medium">{coin.name}</span>
                    <span className="text-[#8E9297] ml-1">{coin.symbol}</span>
                  </div>
                </td>
                <td className="py-2 text-right font-mono">${coin.price.toFixed(5)}</td>
                <td className={`py-2 text-right ${coin.percentChange24h >= 0 ? 'text-[#57F287]' : 'text-[#ED4245]'}`}>
                  {coin.percentChange24h >= 0 ? '+' : ''}{coin.percentChange24h.toFixed(1)}%
                </td>
                <td className="py-2 text-right">${(coin.marketCap / 1000000).toFixed(1)}M</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-[#8E9297]">
          Data sourced from LlamaCoinMarketCap
        </div>
        <div className="flex space-x-2">
          <button className="px-2 py-1 bg-[#2F3136] hover:bg-gray-600 rounded text-sm flex items-center">
            <i className="fa-solid fa-chevron-left mr-1"></i> Prev
          </button>
          <button className="px-2 py-1 bg-[#2F3136] hover:bg-gray-600 rounded text-sm flex items-center">
            Next <i className="fa-solid fa-chevron-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankingEmbed;
