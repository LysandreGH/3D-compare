
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { allRequestedPrinters } from '../data';

// Service to get personalized printer recommendations using Gemini.
export async function getPrinterRecommendation(query: string, lang: string = 'FR'): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const printersData = allRequestedPrinters.map(p => ({
    name: p.name,
    brand: p.brand,
    price: p.price,
    pros: p.pros,
    cons: p.cons,
    tech: p.newTech
  }));

  const prompt = `
    En tant qu'expert en impression 3D, aide l'utilisateur à choisir parmi cette liste : ${JSON.stringify(printersData)}.
    L'utilisateur demande : "${query}"
    Réponds en ${lang}. Donne 2-3 recommandations précises avec les raisons (Marque, Modèle, Pourquoi).
    Sois concis et amical.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Désolé, je ne peux pas répondre pour le moment.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Erreur lors de la communication avec l'IA.";
  }
}

// Service to detect new 2025 printer releases using Google Search grounding
export async function fetchLatestPrinterNews(lang: string = 'FR') {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Quelles sont les dernières imprimantes 3D sorties ou annoncées en 2025 (après janvier 2025) ? 
  Donne-moi une liste de 3 à 5 modèles avec leurs caractéristiques principales et leur prix estimé. 
  Réponds en ${lang}.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Source",
      uri: chunk.web?.uri
    })).filter((c: any) => c.uri) || [];

    return { text, links };
  } catch (error) {
    console.error("Search Error:", error);
    return null;
  }
}

// Service to analyze and summarize differences between multiple items.
export async function getComparisonAnalysis(items: any[], type: 'printer' | 'brand', lang: string = 'FR'): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Compare ces ${type}s 3D: ${JSON.stringify(items)}.
    Rédige une courte phrase (max 2 lignes) en ${lang} qui résume les différences clés.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  } catch {
    return "";
  }
}
