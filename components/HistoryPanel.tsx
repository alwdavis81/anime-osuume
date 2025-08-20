import React from 'react';
import type { AnimeRecommendation } from '../types';
import AnimeCard from './AnimeCard';
import { BookmarkIcon } from './Icons';

interface HistoryPanelProps {
  savedResults: AnimeRecommendation[][];
  onFindSimilar?: (title: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ savedResults, onFindSimilar }) => {
  return (
    <section className="mt-20">
      <h2 className="text-3xl font-black text-center mb-8 text-white flex items-center justify-center gap-3">
        <BookmarkIcon className="w-8 h-8 text-purple-400" />
        Saved Recommendations
      </h2>
      <div className="space-y-12">
        {savedResults.map((resultSet, index) => (
          <div key={index} className="p-1 md:p-2 bg-black/30 border border-white/10 rounded-3xl backdrop-blur-xl">
            <div className="p-4">
              <h3 className="text-xl font-semibold text-slate-300 mb-4 border-b border-white/10 pb-2">
                Saved Set {savedResults.length - index}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 pt-0">
              {resultSet.map((anime, animeIndex) => (
                <AnimeCard 
                  key={`${anime.title}-${animeIndex}`} 
                  anime={anime} 
                  onFindSimilar={onFindSimilar} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HistoryPanel;