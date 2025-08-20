import React, { useState } from 'react';
import type { AnimeRecommendation } from '../types';
import { TagIcon, StarIcon, SearchPlusIcon } from './Icons';

interface AnimeCardProps {
  anime: AnimeRecommendation;
  onFindSimilar?: (title: string) => void;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onFindSimilar }) => {
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);

  const SYNOPSIS_TRUNCATE_LENGTH = 120;
  const isTruncatable = anime.synopsis.length > SYNOPSIS_TRUNCATE_LENGTH;

  const displayedSynopsis = isTruncatable && !isSynopsisExpanded
    ? `${anime.synopsis.substring(0, SYNOPSIS_TRUNCATE_LENGTH)}...`
    : anime.synopsis;

  return (
    <div className="bg-black/50 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-lg p-6 flex flex-col h-full transition-all duration-300 hover:border-purple-400/50 hover:shadow-purple-500/20 hover:-translate-y-1 relative overflow-hidden group">
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all duration-300"></div>
      <div className="flex justify-between items-start gap-4 mb-2">
        <h3 className="text-2xl font-bold text-white">{anime.title}</h3>
        {anime.rating && (
          <div className="flex-shrink-0 flex items-center gap-1 bg-white/10 text-amber-300 font-bold text-sm px-2.5 py-1 rounded-full border border-white/20">
            <StarIcon className="w-4 h-4 text-amber-400" />
            <span>{anime.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {anime.genres.map(genre => (
          <span key={genre} className="bg-white/10 text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">
             <TagIcon className="w-3 h-3 inline mr-1" /> {genre}
          </span>
        ))}
      </div>

      <div className="space-y-4 flex-grow mb-4">
        <div>
          <p className="text-slate-300 text-sm leading-relaxed">{displayedSynopsis}</p>
          {isTruncatable && (
            <button
              onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
              className="text-purple-400 hover:text-purple-300 text-sm font-semibold mt-1"
              aria-expanded={isSynopsisExpanded}
            >
              {isSynopsisExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
        <div>
          <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-purple-500 pl-3">{anime.reason}</p>
        </div>
      </div>

      {onFindSimilar && (
        <div className="mt-auto pt-4 border-t border-white/10">
          <button
            onClick={() => onFindSimilar(anime.title)}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium bg-black/40 hover:bg-black/60 border border-white/20 text-white px-4 py-3 rounded-xl transition-all"
            aria-label={`Find anime similar to ${anime.title}`}
          >
            <SearchPlusIcon className="w-4 h-4" /> Find Similar
          </button>
        </div>
      )}
    </div>
  );
};

export default AnimeCard;