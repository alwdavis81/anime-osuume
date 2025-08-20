/// <reference lib="dom" />
import React, { useState, useCallback, useEffect } from 'react';
import { getAnimeRecommendations } from './services/geminiService';
import * as authService from './services/authService';
import * as recommendationService from './services/recommendationService';
import { supabase } from './supabaseClient';
import type { AnimeRecommendation, AIPersona, User, FormatPreference } from './types';
import { ANIME_GENRES } from './constants';
import GenreSelector from './components/GenreSelector';
import AnimeCard from './components/AnimeCard';
import Loader from './components/Loader';
import HistoryPanel from './components/HistoryPanel';
import PersonaSelector from './components/PersonaSelector';
import LoginModal from './components/LoginModal';
import UpdatePasswordModal from './components/UpdatePasswordModal';
import PreferenceSelector from './components/PreferenceSelector';
import { SparklesIcon, UserIcon, LogoutIcon, BookmarkIcon, ChevronDownIcon, TrendingUpIcon } from './components/Icons';

const App: React.FC = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [userPrompt, setUserPrompt] = useState('');
  const [recommendations, setRecommendations] = useState<AnimeRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [persona, setPersona] = useState<AIPersona>('otaku');
  const [formatPreference, setFormatPreference] = useState<FormatPreference>('any');
  const [prioritizePopular, setPrioritizePopular] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] = useState(false);
  const [savedRecommendations, setSavedRecommendations] = useState<AnimeRecommendation[][]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        setIsUpdatePasswordModalOpen(true);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchSavedRecommendations = async () => {
      if (currentUser) {
        try {
          const saved = await recommendationService.getSavedRecommendations();
          setSavedRecommendations(saved);
        } catch (error) {
          console.error("Failed to fetch saved recommendations:", error);
        }
      } else {
        setSavedRecommendations([]);
      }
    };

    fetchSavedRecommendations();
  }, [currentUser]);

  const handleLogout = async () => {
    await authService.logout();
  };

  const handleSaveResults = async () => {
    if (recommendations.length > 0 && currentUser) {
      const isAlreadySaved = savedRecommendations.some(
        (savedSet) => JSON.stringify(savedSet) === JSON.stringify(recommendations)
      );
      if (isAlreadySaved) {
        return;
      }
      try {
        setSavedRecommendations((prev) => [recommendations, ...prev]);
        await recommendationService.saveRecommendations(recommendations);
      } catch (error) {
        setSavedRecommendations((prev) => prev.filter(set => JSON.stringify(set) !== JSON.stringify(recommendations)));
        console.error("Failed to save recommendations:", error);
      }
    }
  };


  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const generateRecommendations = useCallback(async (options: { 
      genres?: string[]; 
      prompt?: string; 
      surpriseMe?: boolean; 
      findSimilarTo?: string; 
      persona?: AIPersona;
      formatPreference?: FormatPreference;
      prioritizePopular?: boolean;
    }) => {
    setIsSearchVisible(false);
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      const result = await getAnimeRecommendations({ ...options });
      result.sort((a, b) => b.rating - a.rating);
      setRecommendations(result);
    } catch (err) {
      const serverError = (err as any)?.message || 'An unknown error occurred.';
      setError(`Failed to get recommendations. ${serverError}`);
      console.error(err);
    }
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedGenres.length === 0 && !userPrompt) {
      setError('Please select at least one genre or describe what you want to watch.');
      if (!isSearchVisible) setIsSearchVisible(true);
      return;
    }
    generateRecommendations({ genres: selectedGenres, prompt: userPrompt, persona, formatPreference, prioritizePopular });
  }, [selectedGenres, userPrompt, generateRecommendations, isSearchVisible, persona, formatPreference, prioritizePopular]);

  const handleSurpriseMe = useCallback(async () => {
    setSelectedGenres([]);
    setUserPrompt('');
    generateRecommendations({ surpriseMe: true, persona, formatPreference });
  }, [generateRecommendations, persona, formatPreference]);

  const handleFindSimilar = useCallback(async (title: string) => {
    setSelectedGenres([]);
    setUserPrompt('');
    generateRecommendations({ findSimilarTo: title, persona, formatPreference, prioritizePopular });
  }, [generateRecommendations, persona, formatPreference, prioritizePopular]);


  return (
    <>
      <div className="min-h-screen text-slate-200 font-sans relative overflow-x-hidden isolate">
        <div 
            className="absolute inset-0 -z-20 h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/bg.jpg')" }} 
        ></div>
        <div className="absolute inset-0 -z-10 bg-black/50 backdrop-blur-sm"></div>
        
        <nav className="sticky top-0 z-20 bg-transparent">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="text-xl font-bold text-white">Anime Osuume <span className="text-purple-400">AI</span></div>
            {currentUser ? (
               <div className="flex items-center gap-4">
                <span className="text-sm text-slate-300 hidden sm:block">Welcome, {currentUser.email}!</span>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-black/30 hover:bg-red-600/50 border border-white/20 px-4 py-2 rounded-full transition-all">
                  <LogoutIcon className="w-5 h-5" /> Logout
                </button>
               </div>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-black/30 hover:bg-purple-600/50 border border-white/20 px-4 py-2 rounded-full transition-all">
                <UserIcon className="w-5 h-5" /> Login / Sign Up
              </button>
            )}
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8 md:py-12">
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-black text-white mt-2">Get personalized anime recommendations</h1>
          </header>

          <div className={`max-w-4xl mx-auto bg-gradient-to-br from-[rgba(128,0,128,0.5)] to-[rgba(75,0,130,0.5)] rounded-3xl shadow-2xl shadow-purple-900/40 border border-white/20 backdrop-blur-xl overflow-hidden transition-all duration-500`}>
            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="w-full flex justify-between items-center p-6 text-left"
              aria-expanded={isSearchVisible}
              aria-controls="search-panel"
            >
              <h2 className="text-xl font-bold text-white">Find Your Next Obsession</h2>
              <ChevronDownIcon className={`w-6 h-6 text-slate-300 transition-transform duration-300 ${isSearchVisible ? 'rotate-180' : ''}`} />
            </button>
            <div
              id="search-panel"
              className={`transition-all duration-500 ease-in-out ${isSearchVisible ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="px-6 pb-8 border-t border-white/10">
                <form onSubmit={handleSubmit}>
                  <div className="mt-6 mb-6">
                    <label className="block text-lg font-semibold mb-3 text-white">
                      1. Select Genres
                    </label>
                    <GenreSelector
                      genres={ANIME_GENRES}
                      selectedGenres={selectedGenres}
                      onGenreToggle={handleGenreToggle}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-lg font-semibold mb-3 text-white">
                      2. Set Preferences
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-grow">
                         <PreferenceSelector
                          selectedPreference={formatPreference}
                          onPreferenceChange={setFormatPreference}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrioritizePopular(!prioritizePopular)}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black w-full sm:w-auto
                          ${prioritizePopular
                            ? 'bg-purple-500/40 border-purple-400 shadow-lg shadow-purple-500/20'
                            : 'bg-black/20 border-white/10 hover:border-purple-500/50 hover:bg-black/30'
                          }`}
                        >
                        <TrendingUpIcon className={`w-5 h-5 ${prioritizePopular ? 'text-purple-300' : 'text-slate-400'}`} />
                        <span className={`font-medium text-sm ${prioritizePopular ? 'text-white' : 'text-slate-300'}`}>Prioritize Popular</span>
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="user-prompt" className="block text-lg font-semibold mb-3 text-white">
                      3. Describe What You're Looking For
                    </label>
                    <textarea
                      id="user-prompt"
                      value={userPrompt}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserPrompt(e.target.value)}
                      placeholder="e.g., 'a mind-bending psychological thriller'"
                      className="w-full h-24 p-4 bg-black/30 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-200 placeholder-slate-400 text-slate-100"
                    />
                  </div>

                  <div className="mb-8">
                    <label className="block text-lg font-semibold mb-4 text-white">
                      4. Choose AI Personality
                    </label>
                    <PersonaSelector selectedPersona={persona} onPersonaChange={setPersona} />
                  </div>
                  
                  <div className="flex flex-col gap-4">
                     <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 bg-black/40 hover:bg-black/60 border border-white/20 disabled:bg-black/20 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-all duration-300"
                    >
                       {isLoading ? 'Thinking...' : 'Get Recommendations'}
                      {!isLoading && <SparklesIcon className="w-5 h-5" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleSurpriseMe}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-purple-800/50 disabled:to-indigo-800/50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/40"
                    >
                      Surprise Me ✨
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div id="results-section" className="mt-12 min-h-[100px]">
            {isLoading && <Loader />}
            {error && <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>}
            
            {!isLoading && recommendations.length > 0 && (
              <div className="animate-fade-in">
                {currentUser && (
                  <div className="text-center mb-6">
                    <button
                      onClick={handleSaveResults}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg shadow-purple-600/30"
                    >
                      <BookmarkIcon className="w-5 h-5" /> Save Results
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((anime, index) => (
                    <AnimeCard key={`${anime.title}-${index}`} anime={anime} onFindSimilar={handleFindSimilar} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {currentUser && savedRecommendations.length > 0 && (
            <HistoryPanel savedResults={savedRecommendations} onFindSimilar={handleFindSimilar} />
          )}
        </main>

        <footer className="text-center p-6 mt-12 text-slate-500">
          <p>Powered by Gemini</p>
        </footer>
      </div>
      
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={() => setIsLoginModalOpen(false)}
        />
      )}

      {isUpdatePasswordModalOpen && (
        <UpdatePasswordModal 
          onClose={() => setIsUpdatePasswordModalOpen(false)} 
        />
      )}
    </>
  );
};

export default App;
