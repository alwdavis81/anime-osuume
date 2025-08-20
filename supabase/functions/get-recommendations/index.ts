/// <reference lib="esnext" />

declare const Deno: any;

import { GoogleGenAI, Type } from "npm:@google/genai";
import { corsHeaders } from '../_shared/cors.ts';

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "The official English or Romaji title of the anime.",
      },
      synopsis: {
        type: Type.STRING,
        description: "A brief, engaging 2-3 sentence summary of the anime's plot, avoiding major spoilers.",
      },
      genres: {
        type: Type.ARRAY,
        description: "A list of 3-5 primary genres for the anime.",
        items: {
          type: Type.STRING,
        },
      },
      reason: {
        type: Type.STRING,
        description: "A short, compelling reason (1-2 sentences) why this is a good recommendation based on the user's input. The tone of this reason MUST match the system instruction persona.",
      },
      rating: {
        type: Type.NUMBER,
        description: "The anime's average user rating on a scale of 1 to 10, e.g., 8.7.",
      },
    },
    required: ["title", "synopsis", "genres", "reason", "rating"],
  },
};

const PERSONA_INSTRUCTIONS = {
  otaku: "You are an AI expert on Japanese anime, a super enthusiastic Otaku! Your tone is energetic, knowledgeable, and you love sharing popular hits and hidden gems. You must return the data in the specified JSON format.",
  critic: "You are a seasoned AI anime critic. Your tone is formal, analytical, and insightful, focusing on storytelling, artistic merit, and critical acclaim. You must return the data in the specified JSON format.",
  veteran: "You are a chill, veteran AI anime fan. Your tone is laid-back, casual, and friendly. You recommend shows that are great to relax with and have good vibes, like you're talking to a friend. You must return the data in the specified JSON format."
};

Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      genres = [], 
      prompt = '', 
      surpriseMe = false, 
      findSimilarTo, 
      persona = 'otaku',
      formatPreference = 'any',
      prioritizePopular = false
    } = await req.json();

    const apiKey = Deno.env.get("AIzaSyCvIfmyUzvaOHFZB49SZKhGjMN4Y1gZl-s");

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in Supabase environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });

    let basePrompt;
  
    if (findSimilarTo) {
      basePrompt = `Please recommend exactly 6 anime series or movies that are similar in theme, tone, or style to "${findSimilarTo}".`;
    } else if (surpriseMe) {
      basePrompt = `Please recommend exactly 6 popular and critically acclaimed anime from a diverse range of genres. These should be great starting points for someone new to anime or someone looking for a proven classic or a modern hit.`;
    } else {
      const genreText = genres.length > 0 ? `The user is interested in the following genres: ${genres.join(', ')}.` : '';
      const promptText = prompt ? `The user also provided this description of what they're for: "${prompt}".` : '';
      basePrompt = `Please recommend exactly 6 anime series or movies based on the user's preferences. ${genreText} ${promptText} Prioritize well-regarded or popular anime that fit the criteria. Avoid overly niche or obscure titles unless they are a perfect fit for a very specific prompt.`;
    }

    const promptAdditions = [];
    if (prioritizePopular && !surpriseMe) { // surpriseMe already implies popular
        promptAdditions.push("Focus on highly popular and well-regarded anime.");
    }
    if (formatPreference === 'subbed') {
        promptAdditions.push("The recommendations should preferably be available with original Japanese audio and English subtitles.");
    } else if (formatPreference === 'dubbed') {
        promptAdditions.push("The recommendations should preferably be available with an English dub.");
    }

    const fullPrompt = [basePrompt, ...promptAdditions].join(' ');

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: PERSONA_INSTRUCTIONS[persona],
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
        topP: 0.95,
      },
    });
    
    if (!geminiResponse) {
        throw new Error("The model did not return a response.");
    }

    const jsonText = geminiResponse.text.trim();
    const data = JSON.parse(jsonText);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});