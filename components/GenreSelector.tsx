
import React from 'react';

interface GenreSelectorProps {
  genres: string[];
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({ genres, selectedGenres, onGenreToggle }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {genres.map(genre => {
        const isSelected = selectedGenres.includes(genre);
        return (
          <button
            key={genre}
            type="button"
            onClick={() => onGenreToggle(genre)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ease-in-out border
              ${isSelected
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-slate-200 border-white/30 hover:bg-white/10 hover:border-white/50'
              }`}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
};

export default GenreSelector;