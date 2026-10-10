import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { allRequestedPrinters } from '../data';
import { Printer } from '../types';
import { translateProCon } from '../translationsData';

// Utility to get the API key from environment variables
const getApiKey = () => {
  const metaEnv = (import.meta as any).env || {};
  const procEnv = typeof process !== 'undefined' ? process.env : {};
  const key = metaEnv.VITE_GEMINI_API_KEY || metaEnv.GEMINI_API_KEY || procEnv.GEMINI_API_KEY || procEnv.VITE_GEMINI_API_KEY;
  return key || "";
};

// Helper to build deterministic fallback for printer recommendations in FR, EN, DE
function buildRecommendationFallback(matchedPrinter: Printer | undefined, topCandidates: Printer[], lang: string): string {
  const targetLang = (lang === 'EN' || lang === 'DE') ? lang : 'FR';

  if (matchedPrinter) {
    if (targetLang === 'EN') {
      return `📋 **Detailed Technical Briefing — ${matchedPrinter.brand} ${matchedPrinter.name}**\n\n` +
             `• **Price**: €${matchedPrinter.price} ${matchedPrinter.comboPrice ? `(Multicolor Combo: €${matchedPrinter.comboPrice})` : ''}\n` +
             `• **Chamber / Enclosure**: ${matchedPrinter.enclosed ? 'Enclosed Chamber (Fully sealed for engineering materials)' : 'Open Frame Structure'}\n` +
             `• **Motion Architecture**: ${matchedPrinter.structure}\n` +
             `• **Build Volume**: ${matchedPrinter.buildVolume}\n` +
             `• **Multicolor**: ${matchedPrinter.multicolor.supported ? `Supported (${matchedPrinter.multicolor.system || 'AMS/CFS/ACE'})` : 'No (Single-Color Only)'}\n` +
             `• **Hotend & Temperatures**: ${matchedPrinter.nozzleType} Nozzle (${matchedPrinter.nozzleDiameter}mm) | Max Nozzle: ${matchedPrinter.maxNozzleTemp}°C | Max Bed: ${matchedPrinter.maxBedTemp}°C\n` +
             `• **Supported Filaments**: ${matchedPrinter.filaments.join(', ')}\n` +
             `• **Innovations & Tech**: ${translateProCon(matchedPrinter.newTech, 'EN')}\n\n` +
             `✅ **Key Strengths**: ${matchedPrinter.pros.map(p => translateProCon(p, 'EN')).join(', ')}\n` +
             `⚠️ **Weaknesses / Cons**: ${matchedPrinter.cons.map(c => translateProCon(c, 'EN')).join(', ')}\n\n` +
             `💡 *Expert Verdict*: ${matchedPrinter.enclosed ? 'Versatile high-performance machine ideal for PLA, PETG, ABS, ASA and carbon-fiber technical materials.' : 'Great reliable choice for effortless PLA, PETG, and TPU 3D printing.'}`;
    }

    if (targetLang === 'DE') {
      return `📋 **Detailliertes Datenblatt — ${matchedPrinter.brand} ${matchedPrinter.name}**\n\n` +
             `• **Preis**: ${matchedPrinter.price} € ${matchedPrinter.comboPrice ? `(Mehrfarben-Combo: ${matchedPrinter.comboPrice} €)` : ''}\n` +
             `• **Gehäuse / Bauraum**: ${matchedPrinter.enclosed ? 'Geschlossener Bauraum (versiegelt für technische Filamente)' : 'Offener Rahmen'}\n` +
             `• **Kinematik**: ${matchedPrinter.structure}\n` +
             `• **Druckvolumen**: ${matchedPrinter.buildVolume}\n` +
             `• **Mehrfarbdruck**: ${matchedPrinter.multicolor.supported ? `Unterstützt (${matchedPrinter.multicolor.system || 'AMS/CFS/ACE'})` : 'Nein (Nur einfarbig)'}\n` +
             `• **Druckkopf & Temperaturen**: ${matchedPrinter.nozzleType}-Düse (${matchedPrinter.nozzleDiameter}mm) | Max. Düse: ${matchedPrinter.maxNozzleTemp}°C | Max. Bett: ${matchedPrinter.maxBedTemp}°C\n` +
             `• **Unterstützte Filamente**: ${matchedPrinter.filaments.join(', ')}\n` +
             `• **Besonderheiten & Technik**: ${translateProCon(matchedPrinter.newTech, 'DE')}\n\n` +
             `✅ **Stärken**: ${matchedPrinter.pros.map(p => translateProCon(p, 'DE')).join(', ')}\n` +
             `⚠️ **Schwächen**: ${matchedPrinter.cons.map(c => translateProCon(c, 'DE')).join(', ')}\n\n` +
             `💡 *Experten-Tipp*: ${matchedPrinter.enclosed ? 'Vielseitige Maschine, ideal für PLA, PETG, ABS, ASA und kohlefaserverstärkte Filamente.' : 'Hervorragende Wahl für den einfachen Einstieg in PLA, PETG und TPU.'}`;
    }

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

  if (targetLang === 'EN') {
    let fallbackText = `Here are the top options matching your criteria:\n\n`;
    topCandidates.forEach((p, idx) => {
      fallbackText += `**${idx + 1}. ${p.brand} ${p.name}** - €${p.price} ${p.comboPrice ? `(Combo: €${p.comboPrice})` : ''}\n`;
      fallbackText += `• Type: ${p.enclosed ? 'Enclosed Chamber' : 'Open Frame'} | ${p.structure} | ${p.multicolor.supported ? `Multicolor (${p.multicolor.system || 'Yes'})` : 'Single-color'}\n`;
      fallbackText += `• Build Volume: ${p.buildVolume} | Max Nozzle Temp: ${p.maxNozzleTemp}°C\n`;
      fallbackText += `• Strengths: ${p.pros.map(pr => translateProCon(pr, 'EN')).join(', ')}\n\n`;
    });
    return fallbackText;
  }

  if (targetLang === 'DE') {
    let fallbackText = `Hier sind die besten Modelle passend zu Ihren Kriterien:\n\n`;
    topCandidates.forEach((p, idx) => {
      fallbackText += `**${idx + 1}. ${p.brand} ${p.name}** - ${p.price} € ${p.comboPrice ? `(Combo: ${p.comboPrice} €)` : ''}\n`;
      fallbackText += `• Typ: ${p.enclosed ? 'Geschlossener Bauraum' : 'Offener Rahmen'} | ${p.structure} | ${p.multicolor.supported ? `Mehrfarbig (${p.multicolor.system || 'Ja'})` : 'Einfarbig'}\n`;
      fallbackText += `• Bauvolumen: ${p.buildVolume} | Max. Düsentemp.: ${p.maxNozzleTemp}°C\n`;
      fallbackText += `• Stärken: ${p.pros.map(pr => translateProCon(pr, 'DE')).join(', ')}\n\n`;
    });
    return fallbackText;
  }

  let fallbackText = `Voici les meilleures options sélectionnées selon votre demande :\n\n`;
  topCandidates.forEach((p, idx) => {
    fallbackText += `**${idx + 1}. ${p.brand} ${p.name}** - ${p.price}€ ${p.comboPrice ? `(Combo: ${p.comboPrice}€)` : ''}\n`;
    fallbackText += `• Type: ${p.enclosed ? 'Boîtier FERMÉ (Caisson)' : 'Structure Ouverte'} | ${p.structure} | ${p.multicolor.supported ? `Multicolore (${p.multicolor.system || 'Oui'})` : 'Monocouleur'}\n`;
    fallbackText += `• Volume: ${p.buildVolume} | Temp. Max Buse: ${p.maxNozzleTemp}°C\n`;
    fallbackText += `• Points forts: ${p.pros.join(', ')}\n\n`;
  });
  return fallbackText;
}

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
  const wantsEnclosed = queryLower.includes('fermé') || queryLower.includes('fermee') || queryLower.includes('caisson') || queryLower.includes('enclosed') || queryLower.includes('geschlossen');
  const wantsOpen = queryLower.includes('ouvert') || queryLower.includes('ouverte') || queryLower.includes('open') || queryLower.includes('offen');

  if (wantsEnclosed && !wantsOpen) {
    candidatePrinters = candidatePrinters.filter(p => p.enclosed === true);
  } else if (wantsOpen && !wantsEnclosed) {
    candidatePrinters = candidatePrinters.filter(p => p.enclosed === false);
  }

  // Multicolor check
  const wantsMulticolor = queryLower.includes('multicolor') || queryLower.includes('multi-couleur') || queryLower.includes('multicouleur') || queryLower.includes('couleur') || queryLower.includes('ams') || queryLower.includes('cfs') || queryLower.includes('ace') || queryLower.includes('mehrfarb');
  if (wantsMulticolor) {
    candidatePrinters = candidatePrinters.filter(p => p.multicolor.supported === true);
  }

  // Budget check (e.g., "500€", "300 euros", "moins de 600")
  const budgetMatch = queryLower.match(/(?:moins de|max|budget de|sous|under|unter)\s*(\d+)/i) || queryLower.match(/(\d+)\s*€/i) || queryLower.match(/(\d+)\s*euros/i);
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

  // If no API key is set, construct a rich structured response in requested language
  if (!apiKey) {
    const topCandidates = candidatePrinters.slice(0, 3);
    return buildRecommendationFallback(matchedPrinter, topCandidates, lang);
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

  const languageDirective = lang === 'EN' 
    ? "IMPORTANT: You MUST write your response entirely in English with clean, clear Markdown formatting."
    : lang === 'DE'
    ? "WICHTIG: Verfasse deine Antwort vollständig auf Deutsch mit sauberer, übersichtlicher Markdown-Formatierung."
    : "IMPORTANT : Rédige ta réponse entièrement en français avec une mise en forme Markdown soignée et aérée.";

  const prompt = `
    You are a world-class 3D printing advisor and engineer.
    Here is the official catalog data of all available 3D printers:
    ${JSON.stringify(fullCatalogueData)}

    User request: "${query}"

    ${languageDirective}

    STRICT GUIDELINES:
    1. If the user asks about a specific printer model or brand:
       - Provide a comprehensive, structured briefing for that machine.
       - Include: Price (standalone & combo), Enclosure, Build volume, Max temperatures, Multicolor capabilities, Compatible filaments, Key Pros and Cons.
       - Add a balanced expert verdict (target audience, ease of use, recommended project types).
    2. If the user is asking for a recommendation (e.g. budget, enclosure, multicolor):
       - Strictly respect their constraints.
       - Recommend the 2 or 3 best matching machines and explain why.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || buildRecommendationFallback(matchedPrinter, candidatePrinters.slice(0, 3), lang);
  } catch (error) {
    console.error("AI Error:", error);
    return buildRecommendationFallback(matchedPrinter, candidatePrinters.slice(0, 3), lang);
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
• **Prusa :** Arrivée de la gamme **CORE One+ (Gen 2 dès 1 049 € kit)** et **CORE One L+ (dès 1 849 €)** avec cinématique CoreXY fermée et changeur d'outils INDX zéro purge (4 ou 8 têtes), nouvelle **Original Prusa MK4S** avec buse Nextruder High-Flow et option Enclosure Bundle (1 033,60 € kit / 1 299,60 € montée), **Prusa XL+** Toolchanger jusqu'à 5 têtes, et machine industrielle **Prusa Pro HT90 (11 490 €)**.
• **Sovol :** Gamme CoreXY et Klipper open-source avec la **SV08 (469 €)** (350×350×345 mm, QGL, Klipper natif, débit 40 mm³/s), la gigantesque **SV08 Max (939 €)** (450×450×450 mm, lit AC silicone 800W), la compacte fusée **Sovol Zero (349 €)** (jusqu'à 1 200 mm/s et 40 000 mm/s²), et les bedslingers rapides **SV06 ACE (219 €)** et **SV06 Plus ACE (254 €)** compatibles multicolore ACE 4 bobines.
• **Comgrow :** Entrée remarquée de la **Comgrow T300 (219 €)** offrant 300×300×350 mm sous Klipper à 600 mm/s et 12 000 mm/s² avec Input Shaping et nivellement inductif automatique.
• **Snapmaker :** Entrée au catalogue avec la **Snapmaker U1 (899€ IDEX)** et la gamme **Artisan 3-in-1** (3D, Laser & CNC).`,
    links: [
      { title: "Comgrow Official Store", uri: "https://comgrow.com" },
      { title: "Sovol 3D Official Store", uri: "https://sovol3d.com" },
      { title: "Prusa Research Official", uri: "https://prusa3d.com" },
      { title: "Bambu Lab Official", uri: "https://bambulab.com" },
      { title: "Creality Official Store", uri: "https://store.creality.com" },
      { title: "Anycubic Official", uri: "https://store.anycubic.com" }
    ]
  };

  if (!apiKey) return fallbackNews;

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search the latest news, official pricing and product releases in 2025/2026 for 3D printers Bambu Lab, Anycubic, Creality, Elegoo and Prusa. Summarize the major changes and new models in ${lang}. Provide source links if available.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const webChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const links = webChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Source Officielle Constructeur',
      uri: chunk.web?.uri || ''
    })).filter((l: any) => l.uri) || fallbackNews.links;

    return {
      text: response.text || fallbackNews.text,
      links: links.slice(0, 4)
    };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return fallbackNews;
  }
}

// Fallback logic for comparison analysis in FR, EN, DE
export function buildRichComparisonFallback(items: any[], type: 'printer' | 'brand', lang: string = 'FR'): string {
  const targetLang = (lang === 'EN' || lang === 'DE') ? lang : 'FR';

  if (!items || items.length < 2) {
    if (targetLang === 'EN') return "Select at least two items to display the comparative analysis.";
    if (targetLang === 'DE') return "Wählen Sie mindestens zwei Elemente aus, um den Vergleich anzuzeigen.";
    return "Sélectionnez au moins deux éléments pour afficher l'analyse comparative.";
  }

  if (type === 'brand') {
    const b1 = items[0];
    const b2 = items[1];
    if (targetLang === 'EN') {
      return `The brand **${b1.name}** is known for filaments with ${b1.pros?.map((p: string) => translateProCon(p, 'EN')).join(', ') || 'high quality'} (rating ${b1.rating || 5}/5), while **${b2.name}** offers a catalog focused on ${b2.pros?.map((p: string) => translateProCon(p, 'EN')).join(', ') || 'variety'} (rating ${b2.rating || 5}/5).`;
    }
    if (targetLang === 'DE') {
      return `Die Marke **${b1.name}** zeichnet sich durch ${b1.pros?.map((p: string) => translateProCon(p, 'DE')).join(', ') || 'hochwertige Filamente'} aus (Bewertung ${b1.rating || 5}/5), während **${b2.name}** auf ${b2.pros?.map((p: string) => translateProCon(p, 'DE')).join(', ') || 'Vielfalt'} setzt (Bewertung ${b2.rating || 5}/5).`;
    }
    return `La marque **${b1.name}** se caractérise par des filaments ${b1.qualities?.join(', ') || 'de haute qualité'} (note ${b1.rating || 5}/5), tandis que **${b2.name}** propose une gamme axée sur ${b2.qualities?.join(', ') || 'la variété'} (note ${b2.rating || 5}/5).`;
  }

  // Printer comparison
  const p1: Printer = items[0];
  const p2: Printer = items[1];

  if (targetLang === 'EN') {
    let text = `**${p1.brand} ${p1.name}** (€${p1.price}${p1.comboPrice ? ` / Combo €${p1.comboPrice}` : ''}) vs **${p2.brand} ${p2.name}** (€${p2.price}${p2.comboPrice ? ` / Combo €${p2.comboPrice}` : ''}) :\n\n`;
    const priceDiff = Math.abs(p1.price - p2.price);
    if (priceDiff > 0) {
      const cheaper = p1.price < p2.price ? p1 : p2;
      const pricier = p1.price < p2.price ? p2 : p1;
      text += `• **Price & Value**: The **${cheaper.brand} ${cheaper.name}** is more budget-friendly with a €${priceDiff} difference compared to the **${pricier.brand} ${pricier.name}** (€${pricier.price}).\n`;
    } else {
      text += `• **Price**: Both machines are offered at the same price point of **€${p1.price}**.\n`;
    }
    if (p1.enclosed === p2.enclosed) {
      text += `• **Enclosure**: Both printers feature a **${p1.enclosed ? 'fully enclosed chamber' : 'open frame structure'}** (${p1.enclosed ? 'ideal for ABS, ASA, PC and technical filaments' : 'optimized for hassle-free PLA, PETG and TPU'}).\n`;
    } else {
      const enclosedP = p1.enclosed ? p1 : p2;
      const openP = p1.enclosed ? p2 : p1;
      text += `• **Enclosure & Insulation**: **${enclosedP.name}** stands out with an **enclosed chamber** for printing technical materials (ABS, ASA, Nylon), while **${openP.name}** features an **open frame**.\n`;
    }
    text += `• **Volume & Kinematics**: **${p1.name}** offers **${p1.buildVolume}** (${p1.structure}) vs **${p2.buildVolume}** (${p2.structure}) for **${p2.name}**.\n`;
    if (p1.maxNozzleTemp !== p2.maxNozzleTemp) {
      const hotter = p1.maxNozzleTemp > p2.maxNozzleTemp ? p1 : p2;
      const lower = p1.maxNozzleTemp > p2.maxNozzleTemp ? p2 : p1;
      text += `• **Hotend Temperature**: The **${hotter.name}** reaches **${hotter.maxNozzleTemp}°C** (${hotter.nozzleType}) vs **${lower.maxNozzleTemp}°C** for **${lower.name}**.\n`;
    }
    if (p1.multicolor.supported || p2.multicolor.supported) {
      text += `• **Multicolor**: `;
      if (p1.multicolor.supported && p2.multicolor.supported) {
        text += `Both printers support multi-spool printing (${p1.name} via **${p1.multicolor.system || 'AMS'}** and ${p2.name} via **${p2.multicolor.system || 'AMS'}**).\n`;
      } else {
        const multiP = p1.multicolor.supported ? p1 : p2;
        const monoP = p1.multicolor.supported ? p2 : p1;
        text += `The **${multiP.name}** supports multicolor (**${multiP.multicolor.system || 'Multi-spool unit'}**), whereas **${monoP.name}** is single-color by default.\n`;
      }
    }
    text += `\n💡 **Key Strengths Summary**:\n`;
    text += `• **${p1.name}**: ${p1.pros.slice(0, 2).map(pr => translateProCon(pr, 'EN')).join(', ')}.\n`;
    text += `• **${p2.name}**: ${p2.pros.slice(0, 2).map(pr => translateProCon(pr, 'EN')).join(', ')}.`;
    return text;
  }

  if (targetLang === 'DE') {
    let text = `**${p1.brand} ${p1.name}** (${p1.price} €${p1.comboPrice ? ` / Combo ${p1.comboPrice} €` : ''}) vs **${p2.brand} ${p2.name}** (${p2.price} €${p2.comboPrice ? ` / Combo ${p2.comboPrice} €` : ''}) :\n\n`;
    const priceDiff = Math.abs(p1.price - p2.price);
    if (priceDiff > 0) {
      const cheaper = p1.price < p2.price ? p1 : p2;
      const pricier = p1.price < p2.price ? p2 : p1;
      text += `• **Preis & Positionierung**: Der **${cheaper.brand} ${cheaper.name}** ist mit einem Preisunterschied von ${priceDiff} € günstiger als der **${pricier.brand} ${pricier.name}** (${pricier.price} €).\n`;
    } else {
      text += `• **Preis**: Beide Modelle liegen beim gleichen Preis von **${p1.price} €**.\n`;
    }
    if (p1.enclosed === p2.enclosed) {
      text += `• **Gehäuse**: Beide Drucker besitzen ein **${p1.enclosed ? 'geschlossenes Gehäuse mit Bauraum' : 'offenes Chassis'}** (${p1.enclosed ? 'ideal für ABS, ASA, PC und technische Filamente' : 'perfekt für einfaches Drucken von PLA, PETG und TPU'}).\n`;
    } else {
      const enclosedP = p1.enclosed ? p1 : p2;
      const openP = p1.enclosed ? p2 : p1;
      text += `• **Gehäuse & Isolation**: Der **${enclosedP.name}** zeichnet sich durch ein **geschlossenes Gehäuse** für technische Materialien aus, während der **${openP.name}** einen **offenen Rahmen** besitzt.\n`;
    }
    text += `• **Volumen & Kinematik**: **${p1.name}** bietet **${p1.buildVolume}** (${p1.structure}) gegenüber **${p2.buildVolume}** (${p2.structure}) beim **${p2.name}**.\n`;
    if (p1.maxNozzleTemp !== p2.maxNozzleTemp) {
      const hotter = p1.maxNozzleTemp > p2.maxNozzleTemp ? p1 : p2;
      const lower = p1.maxNozzleTemp > p2.maxNozzleTemp ? p2 : p1;
      text += `• **Düsentemperatur**: Der **${hotter.name}** erreicht **${hotter.maxNozzleTemp}°C** (${hotter.nozzleType}) im Vergleich zu **${lower.maxNozzleTemp}°C** beim **${lower.name}**.\n`;
    }
    if (p1.multicolor.supported || p2.multicolor.supported) {
      text += `• **Mehrfarbdruck**: `;
      if (p1.multicolor.supported && p2.multicolor.supported) {
        text += `Beide Drucker unterstützen Mehrfarbdruck (${p1.name} via **${p1.multicolor.system || 'AMS'}** und ${p2.name} via **${p2.multicolor.system || 'AMS'}**).\n`;
      } else {
        const multiP = p1.multicolor.supported ? p1 : p2;
        const monoP = p1.multicolor.supported ? p2 : p1;
        text += `Der **${multiP.name}** unterstützt Mehrfarbdruck (**${multiP.multicolor.system || 'Mehrspuleneinheit'}**), während der **${monoP.name}** standardmäßig einfarbig ist.\n`;
      }
    }
    text += `\n💡 **Wichtigste Stärken**:\n`;
    text += `• **${p1.name}**: ${p1.pros.slice(0, 2).map(pr => translateProCon(pr, 'DE')).join(', ')}.\n`;
    text += `• **${p2.name}**: ${p2.pros.slice(0, 2).map(pr => translateProCon(pr, 'DE')).join(', ')}.`;
    return text;
  }

  // Default FR
  let text = `**${p1.brand} ${p1.name}** (${p1.price}€${p1.comboPrice ? ` / Combo ${p1.comboPrice}€` : ''}) vs **${p2.brand} ${p2.name}** (${p2.price}€${p2.comboPrice ? ` / Combo ${p2.comboPrice}€` : ''}) :\n\n`;
  const priceDiff = Math.abs(p1.price - p2.price);
  if (priceDiff > 0) {
    const cheaper = p1.price < p2.price ? p1 : p2;
    const pricier = p1.price < p2.price ? p2 : p1;
    text += `• **Prix & Positionnement** : La **${cheaper.brand} ${cheaper.name}** est plus accessible avec un écart de ${priceDiff}€ par rapport à la **${pricier.brand} ${pricier.name}** (${pricier.price}€).\n`;
  } else {
    text += `• **Prix** : Les deux modèles sont positionnés au même tarif de **${p1.price}€**.\n`;
  }
  if (p1.enclosed === p2.enclosed) {
    text += `• **Boîtier** : Les deux imprimantes disposent d'un **${p1.enclosed ? 'châssis fermé avec caisson thermique' : 'châssis ouvert'}** (${p1.enclosed ? 'idéal pour ABS, ASA, PC et filaments carbone' : 'optimisé pour PLA, PETG et TPU en toute simplicité'}).\n`;
  } else {
    const enclosedP = p1.enclosed ? p1 : p2;
    const openP = p1.enclosed ? p2 : p1;
    text += `• **Boîtier & Isolation** : La **${enclosedP.name}** se distingue par son **boîtier fermé (caisson)** permettant d'imprimer des matériaux techniques (ABS, ASA, Nylon), alors que la **${openP.name}** conserve une **structure ouverte**.\n`;
  }
  text += `• **Volume & Cinématique** : **${p1.name}** offre **${p1.buildVolume}** (${p1.structure}) contre **${p2.buildVolume}** (${p2.structure}) pour la **${p2.name}**.\n`;
  if (p1.maxNozzleTemp !== p2.maxNozzleTemp) {
    const hotter = p1.maxNozzleTemp > p2.maxNozzleTemp ? p1 : p2;
    const lower = p1.maxNozzleTemp > p2.maxNozzleTemp ? p2 : p1;
    text += `• **Buse & Température** : La **${hotter.name}** monte jusqu'à **${hotter.maxNozzleTemp}°C** (${hotter.nozzleType}) contre **${lower.maxNozzleTemp}°C** pour la **${lower.name}**.\n`;
  } else {
    text += `• **Buse** : Température maximale de **${p1.maxNozzleTemp}°C** sur les deux machines (${p1.nozzleType} vs ${p2.nozzleType}).\n`;
  }
  if (p1.multicolor.supported || p2.multicolor.supported) {
    text += `• **Multicolore** : `;
    if (p1.multicolor.supported && p2.multicolor.supported) {
      text += `Les deux machines gèrent le multicolore (${p1.name} via **${p1.multicolor.system || 'AMS'}** et ${p2.name} via **${p2.multicolor.system || 'AMS'}**).\n`;
    } else {
      const multiP = p1.multicolor.supported ? p1 : p2;
      const monoP = p1.multicolor.supported ? p2 : p1;
      text += `La **${multiP.name}** gère le multicolore (**${multiP.multicolor.system || 'Système multi-bobines'}**), tandis que la **${monoP.name}** est monocouleur nativement.\n`;
    }
  }
  text += `\n💡 **Synthèse & Atouts** :\n`;
  text += `• **${p1.name}** : ${p1.pros.slice(0, 2).join(', ')} (${p1.newTech}).\n`;
  text += `• **${p2.name}** : ${p2.pros.slice(0, 2).join(', ')} (${p2.newTech}).`;
  return text;
}

export async function getComparisonAnalysis(items: any[], type: 'printer' | 'brand', lang: string = 'FR'): Promise<string> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return buildRichComparisonFallback(items, type, lang);
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const languageDirective = lang === 'EN' 
    ? "IMPORTANT: You MUST write your comparative analysis strictly in English."
    : lang === 'DE'
    ? "WICHTIG: Verfasse deine vergleichende Analyse ausschließlich auf Deutsch."
    : "IMPORTANT : Rédige ton analyse comparative exclusivement en français.";

  const prompt = `
    Compare these 3D ${type}s: ${JSON.stringify(items)}.
    Write a concise, high-value comparative analysis (3 to 5 sentences) highlighting key differences (price, enclosed/open chassis, build volume, speed, multicolor support, nozzle & maximum temperatures). Be precise with technical specifications.
    ${languageDirective}
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || buildRichComparisonFallback(items, type, lang);
  } catch {
    return buildRichComparisonFallback(items, type, lang);
  }
}
