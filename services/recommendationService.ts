/// <reference lib="dom" />
import { supabase } from '../supabaseClient';
import type { AnimeRecommendation } from '../types';

export const saveRecommendations = async (recommendations: AnimeRecommendation[]): Promise<any> => {
  const { data, error } = await supabase.functions.invoke('save-recommendations', {
    body: recommendations,
  });

  if (error) {
    console.error('Error saving recommendations:', error);
    throw new Error(error.message);
  }

  return data;
};

export const getSavedRecommendations = async (): Promise<AnimeRecommendation[][]> => {
  const { data, error } = await supabase.functions.invoke('get-saved-recommendations');

  if (error) {
    console.error('Error fetching saved recommendations:', error);
    throw new Error(error.message);
  }
  
  if (!data) {
    return [];
  }

  return data;
};