
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { allRequestedPrinters } from '../data';
import { Printer } from '../types';

// Utility to get the API key from environment variables
const getApiKey = () => {
  const metaEnv = (import.meta as any).env || {};
  const procEnv = typeof process !== 'undefined' ? process.env : {};
  const key = metaEnv.VITE_GEMINI_API_KEY || metaEnv.GEMINI_API_KEY || procEnv.GEMINI_API_KEY || procEnv.VITE_GEMINI_API_KEY;
  return key || "";
};

// Service to get personalized printer recommendations or detailed printer briefings using Gemini
export async function getPrinterRecommendation(query: string, lang: string = 'FR'): Promise<string> {
  const queryLower = query.toLowerCase();
  
  // Check if user is asking about a specific printer by name or brand
  const matchedPrinter = allRequestedPrinters.find(p => 
    queryLower.includes(p.name.toLowerCase()) || 
    queryLower.includes(`${p.brand.toLowerCase()} ${p.name.toLowerCase()}`) ||
    (p.name.length > 3 && queryLower.includes(p.name.toLowerCase().replace(/combo/g, '').trim()))
  );

  // Deterministic pre-filtering based on explicit user keywords
  let candidatePrinters = allRequestedPrinters.filter(p => !p.discontinued);

  // Enclosure check
  const wantsEnclosed = queryLower.includes('fermé') || queryLower.includes('fermee') || queryLower.includes('caisson') || queryLower.includes('enclosed');
  const wantsOpen = queryLower.includes('ouvert') || queryLower.includes('ouverte') || queryLower.includes('open');

  if (wantsEnclosed && !wantsOpen) {
    candidatePrinters = candidatePrinters.filter(p => p.enclosed === true);
  } else if (wantsOpen && !wantsEnclosed) {
    candidatePrinters = candidatePrinters.filter(p => p.enclosed === false);
  }

  // Multicolor check
  const wantsMulticolor = queryLower.includes('multicolor') || queryLower.includes('multi-couleur') || queryLower.includes('multicouleur') || queryLower.includes('couleur') || queryLower.includes('ams') || queryLower.includes('cfs') || queryLower.includes('ace');
  if (wantsMulticolor) {
    candidatePrinters = candidatePrinters.filter(p => p.multicolor.supported === true);
  }

  // Budget check (e.g., "500€", "300 euros", "moins de 600")
  const budgetMatch = queryLower.match(/(?:moins de|max|budget de|sous)\s*(\d+)/i) || queryLower.match(/(\d+)\s*€/i) || queryLower.match(/(\d+)\s*euros/i);
  if (budgetMatch && budgetMatch[1]) {
    const maxBudget = parseInt(budgetMatch[1], 10);
    if (!isNaN(maxBudget) && maxBudget > 100) {
      const budgetFiltered = candidatePrinters.filter(p => p.price <= maxBudget || (p.comboPrice && p.comboPrice <= maxBudget));
      if (budgetFiltered.length > 0) {
        candidatePrinters = budgetFiltered;
      }
    }
  }

  // Fallback list
  if (candidatePrinters.length === 0) {
    candidatePrinters = allRequestedPrinters.filter(p => !p.discontinued);
  }

  const apiKey = getApiKey();

  // If no API key is set, construct a rich structured response
  if (!apiKey) {
    if (matchedPrinter) {
      return `📋 **Fiche d'Information Détaillée — ${matchedPrinter.brand} ${matchedPrinter.name}**\n\n` +
             `• **Prix** : ${matchedPrinter.price} € ${matchedPrinter.comboPrice ? `(Combo : ${matchedPrinter.comboPrice} €)` : ''}\n` +
             `• **Boîtier / Caisson** : ${matchedPrinter.enclosed ? 'Boîtier FERMÉ (caisson thermique)' : 'Structure Ouverte'}\n` +
             `• **Cinématique** : ${matchedPrinter.structure}\n` +
             `• **Volume d'impression** : ${matchedPrinter.buildVolume}\n` +
             `• **Multicolore** : ${matchedPrinter.multicolor.supported ? `Oui (${matchedPrinter.multicolor.system || 'AMS/CFS'})` : 'Non (Monocouleur)'}\n` +
             `• **Extrudeur & Températures** : Buse ${matchedPrinter.nozzleType} (${matchedPrinter.nozzleDiameter}mm) | Max Buse: ${matchedPrinter.maxNozzleTemp}°C | Max Plateau: ${matchedPrinter.maxBedTemp}°C\n` +
             `• **Filaments pris en charge** : ${matchedPrinter.filaments.join(', ')}\n` +
             `• **Nouveautés & Tech** : ${matchedPrinter.newTech}\n\n` +
             `✅ **Points Forts** : ${matchedPrinter.pros.join(', ')}\n` +
             `⚠️ **Points Faibles** : ${matchedPrinter.cons.join(', ')}\n\n` +
             `💡 *Conseil du pro* : ${matchedPrinter.enclosed ? 'Machine polyvalente idéale pour PLA, PETG, ABS, ASA et filaments techniques chargés en carbone.' : 'Excellente machine pour débuter en PLA, PETG et TPU en toute simplicité.'}`;
    }

    const topCandidates = candidatePrinters.slice(0, 3);
    let fallbackText = `Voici les meilleures options sélectionnées selon votre demande :\n\n`;
    topCandidates.forEach((p, idx) => {
      fallbackText += `**${idx + 1}. ${p.brand} ${p.name}** - ${p.price}€ ${p.comboPrice ? `(Combo: ${p.comboPrice}€)` : ''}\n`;
      fallbackText += `• Type: ${p.enclosed ? 'Boîtier FERMÉ (Caisson)' : 'Structure Ouverte'} | ${p.structure} | ${p.multicolor.supported ? `Multicolore (${p.multicolor.system || 'Oui'})` : 'Monocouleur'}\n`;
      fallbackText += `• Volume: ${p.buildVolume} | Temp. Max Buse: ${p.maxNozzleTemp}°C\n`;
      fallbackText += `• Points forts: ${p.pros.join(', ')}\n\n`;
    });
    return fallbackText;
  }

  const ai = new GoogleGenAI({ apiKey });

  const fullCatalogueData = allRequestedPrinters.map(p => ({
    name: p.name,
    brand: p.brand,
    price: p.price,
    comboPrice: p.comboPrice,
    enclosed: p.enclosed ? 'Boîtier FERMÉ (Caisson)' : 'Structure Ouverte',
    structure: p.structure,
    multicolor: p.multicolor.supported ? `Oui (${p.multicolor.system || ''})` : 'Non (Monocouleur)',
    volume: p.buildVolume,
    nozzleType: p.nozzleType,
    nozzleDiameter: p.nozzleDiameter,
    maxNozzleTemp: p.maxNozzleTemp,
    maxBedTemp: p.maxBedTemp,
    filaments: p.filaments,
    pros: p.pros,
    cons: p.cons,
    tech: p.newTech,
    discontinued: p.discontinued ? 'Ancien modèle' : 'Modèle actuel'
  }));

  const prompt = `
    Tu es un conseiller expert mondial en impression 3D.
    Voici le catalogue complet de toutes les imprimantes 3D avec leurs données techniques officielles :
    ${JSON.stringify(fullCatalogueData)}

    Demande de l'utilisateur : "${query}"

    DIRECTIVES DE RÉPONSE STRICTES :
    1. Si l'utilisateur demande des informations, des détails, des avis ou des caractéristiques sur une imprimante 3D spécifique (ou une marque) :
       - Donne une PRESENTATION COMPLÈTE ET ULTRA DÉTAILLÉE de la machine demandée.
       - Détaille : Prix (seul et combo), Caisson (fermé/ouvert), Volume d'impression, Extrudeur & Températures max, Vitesse, Multicolore, Filaments compatibles, Points Forts et Points Faibles.
       - Donne un avis d'expert impartial (public cible, facilité d'utilisation, type de projets recommandés).

    2. Si l'utilisateur cherche une recommandation (ex: "quelle imprimante acheter pour 500€ avec caisson ?") :
       - Respecte scrupuleusement ses critères (caisson fermé vs ouvert, multicolore, budget).
       - Propose les 2 ou 3 meilleures machines correspondantes en justifiant clairement les choix.

    3. Rédige en ${lang} avec un style fluide, aéré, bien structuré (puces, gras, sections claires).
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Désolé, je ne peux pas générer d'analyse pour le moment.";
  } catch (error) {
    console.error("AI Error:", error);
    if (matchedPrinter) {
      return `📋 **Fiche Détaillée — ${matchedPrinter.brand} ${matchedPrinter.name}**\n\n` +
             `• **Prix** : ${matchedPrinter.price} € ${matchedPrinter.comboPrice ? `(Combo : ${matchedPrinter.comboPrice} €)` : ''}\n` +
             `• **Boîtier / Caisson** : ${matchedPrinter.enclosed ? 'Boîtier FERMÉ' : 'Structure Ouverte'}\n` +
             `• **Volume** : ${matchedPrinter.buildVolume} | **Structure** : ${matchedPrinter.structure}\n` +
             `• **Multicolore** : ${matchedPrinter.multicolor.supported ? `Oui (${matchedPrinter.multicolor.system || 'Inclus/Option'})` : 'Non'}\n` +
             `• **Températures Max** : Buse ${matchedPrinter.maxNozzleTemp}°C | Plateau ${matchedPrinter.maxBedTemp}°C\n` +
             `• **Filaments** : ${matchedPrinter.filaments.join(', ')}\n\n` +
             `✅ **Points Forts** : ${matchedPrinter.pros.join(', ')}\n` +
             `⚠️ **Points Faibles** : ${matchedPrinter.cons.join(', ')}`;
    }
    const topCandidates = candidatePrinters.slice(0, 3);
    let fallbackText = `Voici les modèles correspondant exactement à votre recherche :\n\n`;
    topCandidates.forEach((p, idx) => {
      fallbackText += `**${idx + 1}. ${p.brand} ${p.name}** - ${p.price}€ ${p.comboPrice ? `(Combo: ${p.comboPrice}€)` : ''}\n`;
      fallbackText += `• Boîtier: ${p.enclosed ? 'FERMÉ (Caisson)' : 'Ouvert'} | Structure: ${p.structure} | ${p.multicolor.supported ? `Multicolore (${p.multicolor.system || 'Oui'})` : 'Monocouleur'}\n`;
      fallbackText += `• Points forts: ${p.pros.join(', ')}\n\n`;
    });
    return fallbackText;
  }
}

// Service to detect new printer releases using Google Search grounding or fallback news
export async function fetchLatestPrinterNews(lang: string = 'FR') {
  const apiKey = getApiKey();

  const fallbackNews = {
    text: `🚀 **Nouveautés Imprimantes 3D & Mises à Jour du Catalogue :**

• **Bambu Lab :** Lancement de la série **H2 (H2S à 1099€, H2D à 1549€ et H2C Combo à 2149€)** avec têtes interchangeables et laser optionnel, mise à jour de la **P1S (379€)** compatible nouvel AMS 2, sortie de la **X2D (629€)** et de la **A2L (379€)**. *(Les anciens modèles P1P et X1C sont désormais retirés du catalogue officiel).*
• **Creality :** Déploiement complet de la gamme **K2 & K2 Pro/Plus** avec système de couleur CFS, introduction de la **Creality i7 Color Combo (dès 259€)** avec options CFS Nano & Lite, et de l'**Ender-3 V4 Combo (369€)**.
• **Anycubic :** Arrivée de la **Kobra 4 Combo (379€)**, de la **Kobra S1 Max (799€)** et de la **Kobra X** supportant le système modulaire jusqu'à 19 couleurs !
• **Elegoo :** Sortie de la **Centauri Carbon 2 (339€)** avec Elegoo Color Hub, et de la **Neptune 3 Pro (149€)**.
• **Snapmaker :** Entrée au catalogue avec la **Snapmaker U1 (899€ IDEX)** et la gamme **Artisan 3-in-1** (3D, Laser & CNC).`,
    links: [
      { title: "Bambu Lab Official", uri: "https://bambulab.com" },
      { title: "Creality Official Store", uri: "https://store.creality.com" },
      { title: "Anycubic Official", uri: "https://store.anycubic.com" }
    ]
  };

  if (!apiKey) {
    return fallbackNews;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Quelles sont les dernières imprimantes 3D sorties ou annoncées en 2025/2026 (Bambu Lab H2/X2D, Creality K2/i7, Anycubic Kobra 4/S1, Elegoo Centauri Carbon 2, Snapmaker U1) ? 
  Donne-moi une synthèse claire de 4 à 6 points avec prix et nouveautés majeures. 
  Réponds en ${lang}.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || fallbackNews.text;
    const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Source officielle",
      uri: chunk.web?.uri
    })).filter((c: any) => c.uri) || fallbackNews.links;

    return { text, links };
  } catch (error) {
    console.error("Search Error:", error);
    return fallbackNews;
  }
}

// Service to analyze and summarize differences between multiple items.
export async function getComparisonAnalysis(items: any[], type: 'printer' | 'brand', lang: string = 'FR'): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    if (items.length >= 2) {
      return `Comparatif entre ${items[0]?.name || items[0]?.brand} et ${items[1]?.name || items[1]?.brand} : Analyse basée sur le volume d'impression, le boîtier (fermé vs ouvert), la vitesse et la compatibilité multicolore.`;
    }
    return "Sélectionnez au moins deux éléments pour afficher l'analyse comparative.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Compare ces ${type}s 3D: ${JSON.stringify(items)}.
    Rédige une courte analyse comparative synthétique de 2-3 phrases en ${lang} qui met en avant les différences majeures (prix, boîtier fermé/ouvert, vitesse, multicolore, buse).
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  } catch {
    return `Comparatif basé sur les spécifications techniques officielles des modèles sélectionnés.`;
  }
}

