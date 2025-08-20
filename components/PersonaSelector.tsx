import React from 'react';
import type { AIPersona } from '../types';
import { OtakuIcon, CriticIcon, VeteranIcon } from './Icons';

interface PersonaSelectorProps {
  selectedPersona: AIPersona;
  onPersonaChange: (persona: AIPersona) => void;
}

const personas = [
  { id: 'otaku', name: 'Enthusiastic Otaku', icon: OtakuIcon, description: 'Hyper, excited, and loves sharing popular hits.' },
  { id: 'critic', name: 'Seasoned Critic', icon: CriticIcon, description: 'Formal and analytical, focusing on storytelling.' },
  { id: 'veteran', name: 'Chill Veteran', icon: VeteranIcon, description: 'Laid-back, suggesting shows with good vibes.' },
] as const;


const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selectedPersona, onPersonaChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {personas.map(persona => {
        const isSelected = selectedPersona === persona.id;
        return (
          <button
            key={persona.id}
            type="button"
            onClick={() => onPersonaChange(persona.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
              ${isSelected
                ? 'bg-purple-500/40 border-purple-400 shadow-lg shadow-purple-500/20'
                : 'bg-black/20 border-white/10 hover:border-purple-500/50 hover:bg-black/30'
              }`}
            aria-pressed={isSelected}
          >
            <div className="flex items-center gap-3 mb-2">
              <persona.icon className={`w-6 h-6 ${isSelected ? 'text-purple-300' : 'text-slate-400'}`} />
              <h4 className={`font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{persona.name}</h4>
            </div>
            <p className={`text-sm ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>{persona.description}</p>
          </button>
        );
      })}
    </div>
  );
};

export default PersonaSelector;