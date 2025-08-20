import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface AnimeRecommendation {
  title: string;
  synopsis: string;
  genres: string[];
  reason: string;
  rating: number;
}

export type AIPersona = 'otaku' | 'critic' | 'veteran';

// Use the Supabase user type, but we can extend it if we add profiles later
export type User = SupabaseUser;

export type FormatPreference = 'any' | 'subbed' | 'dubbed';