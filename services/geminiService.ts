/// <reference lib="dom" />
import { supabase } from '../supabaseClient';
import type { AnimeRecommendation, AIPersona, FormatPreference } from '../types';

interface RecommendationOptions {
  genres?: string[];
  prompt?: string;
  surpriseMe?: boolean;
  findSimilarTo?: string;
  persona?: AIPersona;
  formatPreference?: FormatPreference;
  prioritizePopular?: boolean;
}

export const getAnimeRecommendations = async (options: RecommendationOptions): Promise<AnimeRecommendation[]> => {
  const { data, error } = await supabase.functions.invoke('get-recommendations', {
    body: options,
  });

  if (error) {
    console.error('Error invoking Supabase function:', error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('No data returned from the recommendation service.');
  }

  return data;
};