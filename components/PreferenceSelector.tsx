import React from 'react';
import type { FormatPreference } from '../types';
import { FilmIcon, SubtitlesIcon, MicrophoneIcon } from './Icons';

interface PreferenceSelectorProps {
  selectedPreference: FormatPreference;
  onPreferenceChange: (preference: FormatPreference) => void;
}

const preferences = [
  { id: 'any', name: 'Any Format', icon: FilmIcon },
  { id: 'subbed', name: 'Subbed', icon: SubtitlesIcon },
  { id: 'dubbed', name: 'Dubbed', icon: MicrophoneIcon },
] as const;

const PreferenceSelector: React.FC<PreferenceSelectorProps> = ({ selectedPreference, onPreferenceChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {preferences.map(preference => {
        const isSelected = selectedPreference === preference.id;
        return (
          <button
            key={preference.id}
            type="button"
            onClick={() => onPreferenceChange(preference.id)}
            className={`p-3 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
              ${isSelected
                ? 'bg-purple-500/40 border-purple-400 shadow-lg shadow-purple-500/20'
                : 'bg-black/20 border-white/10 hover:border-purple-500/50 hover:bg-black/30'
              }`}
            aria-pressed={isSelected}
          >
            <div className="flex items-center gap-3">
              <preference.icon className={`w-5 h-5 ${isSelected ? 'text-purple-300' : 'text-slate-400'}`} />
              <h4 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>{preference.name}</h4>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PreferenceSelector;