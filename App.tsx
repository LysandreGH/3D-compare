
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Monitor, 
  Printer as PrinterIcon, 
  Layers, 
  Settings, 
  ArrowRightLeft, 
  HelpCircle, 
  Search, 
  Sun, 
  Moon, 
  Languages, 
  Star,
  ChevronRight,
  Info,
  ChevronDown,
  Trash2,
  BrainCircuit,
  Lightbulb,
  ImageOff,
  RefreshCw,
  ExternalLink,
  Zap
} from 'lucide-react';
import { Language, Theme, Printer, FilamentType, FilamentBrand, TranslationStrings } from './types';
import { translations } from './translations';
import { allRequestedPrinters, filaments, filamentBrands } from './data';
import { getPrinterRecommendation, getComparisonAnalysis, fetchLatestPrinterNews } from './services/geminiService';

// --- Components ---

const ImageWithFallback = ({ src, alt, className }: { src: string, alt: string, className: string }) => {
  const [error, setError] = useState(false);
  return error ? (
    <div className={`${className} bg-gray-100 dark:bg-zinc-800 flex flex-col items-center justify-center text-gray-400 gap-2`}>
      <PrinterIcon size={48} />
      <span className="text-[10px] font-bold uppercase opacity-50">Image indisponible</span>
    </div>
  ) : (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)} 
    />
  );
};

const StarRating = ({ rating, interactive = false, onRate }: { rating: number, interactive?: boolean, onRate?: (r: number) => void }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={18}
          className={`${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}
          onClick={() => interactive && onRate?.(s)}
        />
      ))}
    </div>
  );
};

// --- Pages ---

const HomePage = ({ t, onRate }: { t: TranslationStrings, onRate: (r: number, txt: string) => void }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 py-6 md:py-10 px-4">
      <div className="text-center space-y-4 md:space-y-6">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pb-2">
          3D Expert Compare
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
          {t.purpose}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600">
            <BrainCircuit size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Powered</h2>
          <p className="text-gray-500 font-medium">{t.aiAttribution}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">{t.rateApp}</h2>
          <div className="flex justify-center">
            <StarRating rating={rating} interactive onRate={setRating} />
          </div>
          <textarea
            className="w-full p-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            rows={3}
            placeholder="Laissez votre avis ici..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button 
            onClick={() => { onRate(rating, feedback); setRating(0); setFeedback(''); alert('Merci !'); }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95"
          >
            Envoyer mon avis
          </button>
        </div>
      </div>
    </div>
  );
};

const PrintersPage = ({ t, lang }: { t: TranslationStrings, lang: Language }) => {
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);
  const [news, setNews] = useState<{ text: string, links: any[] } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    const result = await fetchLatestPrinterNews(lang);
    if (result) setNews(result);
    setIsSyncing(false);
  };

  const filteredPrinters = useMemo(() => {
    return allRequestedPrinters.filter(p => 
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())) &&
      p.price >= minPrice &&
      p.price <= maxPrice
    );
  }, [search, minPrice, maxPrice]);

  const groupedByBrand = useMemo(() => {
    return filteredPrinters.reduce((acc, p) => {
      if (!acc[p.brand]) acc[p.brand] = [];
      acc[p.brand].push(p);
      return acc;
    }, {} as Record<string, Printer[]>);
  }, [filteredPrinters]);

  return (
    <div className="space-y-6 md:space-y-8 p-4 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-zinc-900 p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-800 sticky top-20 lg:top-4 z-10 transition-all">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            className="w-full pl-11 pr-4 py-2.5 md:py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3 md:gap-4 items-center">
          <div className="flex flex-col flex-1 sm:flex-none">
             <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1">Prix Min</span>
             <input type="number" className="w-full sm:w-24 px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} />
          </div>
          <div className="flex flex-col flex-1 sm:flex-none">
             <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1">Prix Max</span>
             <input type="number" className="w-full sm:w-24 px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} />
          </div>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all flex-1 sm:flex-none ${isSyncing ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/20 active:scale-95'}`}
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Scan...' : 'Vérifier Nouveautés'}
          </button>
        </div>
      </div>

      {news && (
        <div className="bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-600/10 dark:to-purple-600/10 border-2 border-blue-200 dark:border-blue-900 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 space-y-4 md:space-y-6 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 md:gap-4">
            <Zap className="text-blue-600 animate-pulse w-6 h-6 md:w-8 md:h-8" />
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tighter">Nouveautés 2025 (IA)</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line font-medium">
            {news.text}
          </div>
          {news.links.length > 0 && (
            <div className="pt-4 border-t border-blue-100 dark:border-blue-900">
              <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-4">Sources et liens officiels :</p>
              <div className="flex flex-wrap gap-3">
                {news.links.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-900 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                  >
                    <ExternalLink size={14} />
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-8 md:space-y-12 pb-20">
        {Object.entries(groupedByBrand).map(([brand, items]) => (
          <div key={brand} className="space-y-4 md:space-y-6">
            <h2 className="text-2xl md:text-4xl font-black flex items-center gap-3 md:gap-4 text-gray-900 dark:text-white tracking-tighter">
              <span className="w-2 h-8 md:w-2.5 md:h-12 bg-blue-600 rounded-full" />
              {brand}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {items.map(p => (
                <div 
                  key={p.id} 
                  className="bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[2rem] border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-1 md:hover:-translate-y-2"
                  onClick={() => setSelectedPrinter(p)}
                >
                  <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                    <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-blue-600 text-white text-[10px] md:text-xs font-black px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl shadow-lg">
                      {p.price} €
                    </div>
                  </div>
                  <div className="p-4 md:p-6 space-y-2 md:space-y-3">
                    <h3 className="font-black text-lg md:text-xl text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{p.name}</h3>
                    <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2 italic">{p.newTech}</p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1 md:pt-2">
                      {p.multicolor.supported && (
                        <span className="text-[8px] md:text-[9px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md md:rounded-lg font-black tracking-widest uppercase">Multi</span>
                      )}
                      <span className="text-[8px] md:text-[9px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 md:px-2 md:py-1 rounded-md md:rounded-lg font-black tracking-widest uppercase">{p.buildVolume}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedPrinter && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-5xl h-[85vh] sm:h-auto max-h-[90vh] overflow-y-auto rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl border border-gray-200 dark:border-zinc-800 animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <div className="p-6 md:p-10 space-y-6 md:space-y-10 relative">
              <button 
                className="absolute right-4 top-4 md:right-10 md:top-10 p-3 md:p-4 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-red-500 hover:text-white transition-all text-gray-900 dark:text-white shadow-lg z-10"
                onClick={() => setSelectedPrinter(null)}
              >
                ✕
              </button>
              
              <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
                <div className="w-full lg:w-[400px] h-64 md:h-[400px] bg-gray-100 dark:bg-zinc-800 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl md:shadow-2xl">
                   <ImageWithFallback src={selectedPrinter.image} alt={selectedPrinter.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-4 md:space-y-8">
                  <div>
                    <span className="text-blue-600 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs">{selectedPrinter.brand}</span>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mt-1 md:mt-2 leading-tight md:leading-none">{selectedPrinter.name}</h2>
                    <p className="text-2xl md:text-4xl text-green-600 font-black mt-2 md:mt-4">{selectedPrinter.price} €</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-green-50 dark:bg-green-900/10 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-green-100 dark:border-green-900/20">
                      <p className="font-black text-green-700 dark:text-green-400 text-[10px] md:text-sm mb-2 md:mb-4 uppercase tracking-widest">Points Forts</p>
                      <ul className="text-xs md:text-sm space-y-1.5 md:space-y-2 text-gray-700 dark:text-gray-300 font-medium">
                        {selectedPrinter.pros.map(pr => <li key={pr} className="flex gap-2"><span className="text-green-500 font-bold">✓</span> {pr}</li>)}
                      </ul>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/10 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-red-100 dark:border-red-900/20">
                      <p className="font-black text-red-700 dark:text-red-400 text-[10px] md:text-sm mb-2 md:mb-4 uppercase tracking-widest">Points Faibles</p>
                      <ul className="text-xs md:text-sm space-y-1.5 md:space-y-2 text-gray-700 dark:text-gray-300 font-medium">
                        {selectedPrinter.cons.map(cn => <li key={cn} className="flex gap-2"><span className="text-red-500 font-bold">✗</span> {cn}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-6 md:pt-10 border-t border-gray-100 dark:border-zinc-800">
                <div className="space-y-0.5 md:space-y-1"><p className="text-gray-400 text-[8px] md:text-[10px] uppercase font-black tracking-widest">Volume</p><p className="font-bold text-sm md:text-lg text-gray-900 dark:text-white">{selectedPrinter.buildVolume}</p></div>
                <div className="space-y-0.5 md:space-y-1"><p className="text-gray-400 text-[8px] md:text-[10px] uppercase font-black tracking-widest">Buse</p><p className="font-bold text-sm md:text-lg text-gray-900 dark:text-white">{selectedPrinter.nozzleType}</p></div>
                <div className="space-y-0.5 md:space-y-1"><p className="text-gray-400 text-[8px] md:text-[10px] uppercase font-black tracking-widest">Diamètre</p><p className="font-bold text-sm md:text-lg text-gray-900 dark:text-white">{selectedPrinter.nozzleDiameter} mm</p></div>
                <div className="space-y-0.5 md:space-y-1"><p className="text-gray-400 text-[8px] md:text-[10px] uppercase font-black tracking-widest">Extrusion</p><p className="font-bold text-sm md:text-lg text-gray-900 dark:text-white">{selectedPrinter.maxNozzleTemp} °C</p></div>
                <div className="space-y-0.5 md:space-y-1"><p className="text-gray-400 text-[8px] md:text-[10px] uppercase font-black tracking-widest">Plateau</p><p className="font-bold text-sm md:text-lg text-gray-900 dark:text-white">{selectedPrinter.maxBedTemp} °C</p></div>
                <div className="space-y-0.5 md:space-y-1"><p className="text-gray-400 text-[8px] md:text-[10px] uppercase font-black tracking-widest">Multi</p><p className="font-bold text-xs md:text-lg text-gray-900 dark:text-white">{selectedPrinter.multicolor.supported ? "Oui" : 'Non'}</p></div>
                <div className="col-span-2 space-y-0.5 md:space-y-1"><p className="text-gray-400 text-[8px] md:text-[10px] uppercase font-black tracking-widest">Tech</p><p className="font-bold text-xs md:text-lg text-gray-900 dark:text-white">{selectedPrinter.newTech}</p></div>
                <div className="col-span-full pt-4 md:pt-6">
                  <p className="text-gray-400 text-[8px] md:text-[10px] uppercase font-black tracking-widest mb-3 md:mb-4">Compatibilité Filaments</p>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {selectedPrinter.filaments.map(f => (
                      <span key={f} className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black tracking-wider shadow-sm">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilamentsPage = ({ t }: { t: TranslationStrings }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 p-4 max-w-7xl mx-auto pb-20">
      {filaments.map(f => (
        <div key={f.name} className="bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-4 md:space-y-6 transition-all hover:shadow-2xl hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{f.name}</h2>
            <StarRating rating={f.difficulty} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed min-h-[50px] md:min-h-[60px] font-medium">{f.description}</p>
          <div className="space-y-4 md:space-y-5">
            <div className="bg-green-50 dark:bg-green-900/10 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-green-100 dark:border-green-900/20">
              <p className="font-black text-green-700 dark:text-green-400 text-[10px] md:text-sm mb-2 md:mb-3 uppercase tracking-widest">Qualités</p>
              <ul className="text-xs md:text-sm space-y-1 md:space-y-1.5 text-gray-700 dark:text-gray-300 font-medium">
                {f.pros.map(p => <li key={p}>• {p}</li>)}
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-red-100 dark:border-red-900/20">
              <p className="font-black text-red-700 dark:text-red-400 text-[10px] md:text-sm mb-2 md:mb-3 uppercase tracking-widest">Défauts</p>
              <ul className="text-xs md:text-sm space-y-1 md:space-y-1.5 text-gray-700 dark:text-gray-300 font-medium">
                {f.cons.map(c => <li key={c}>• {c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FilamentBrandsPage = ({ t }: { t: TranslationStrings }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4 max-w-7xl mx-auto pb-20">
      {filamentBrands.map(b => (
        <div key={b.name} className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-lg space-y-6 hover:shadow-2xl transition-all">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-4 tracking-tighter">{b.name}</h2>
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-black uppercase text-green-600 tracking-widest mb-2">Points Forts</p>
              {b.pros.map(p => <p key={p} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-3 font-medium">
                <span className="text-green-500 font-bold">✓</span> {p}
              </p>)}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-red-600 tracking-widest mb-2">Points Faibles</p>
              {b.cons.map(p => <p key={p} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-3 font-medium">
                <span className="text-red-500 font-bold">✗</span> {p}
              </p>)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ComparePage = ({ t, lang }: { t: TranslationStrings, lang: Language }) => {
  const [tab, setTab] = useState<'printers' | 'brands'>('printers');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState('');
  const [isComparing, setIsComparing] = useState(false);

  const list = tab === 'printers' ? allRequestedPrinters : filamentBrands;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const handleCompare = async () => {
    if (selectedIds.length < 2) return;
    setIsComparing(true);
    setAnalysis('');
    const selectedItems = list.filter(item => selectedIds.includes(tab === 'printers' ? (item as any).id : (item as any).name));
    const result = await getComparisonAnalysis(selectedItems, tab === 'printers' ? 'printer' : 'brand', lang);
    setAnalysis(result);
    setIsComparing(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 md:space-y-8 pb-32">
      <div className="flex bg-gray-200 dark:bg-zinc-800 p-1.5 md:p-2 rounded-2xl w-fit mx-auto shadow-inner transition-all sm:scale-100 scale-90">
        <button 
          className={`px-6 md:px-12 py-2.5 md:py-3.5 rounded-xl font-black transition-all uppercase tracking-widest text-[10px] md:text-xs ${tab === 'printers' ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xl md:scale-105' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => { setTab('printers'); setSelectedIds([]); setAnalysis(''); }}
        >
          {t.compareTabs.printers}
        </button>
        <button 
          className={`px-6 md:px-12 py-2.5 md:py-3.5 rounded-xl font-black transition-all uppercase tracking-widest text-[10px] md:text-xs ${tab === 'brands' ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xl md:scale-105' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => { setTab('brands'); setSelectedIds([]); setAnalysis(''); }}
        >
          {t.compareTabs.brands}
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-5 max-h-[300px] md:max-h-[450px] overflow-y-auto p-4 md:p-6 custom-scrollbar bg-white dark:bg-zinc-900/50 rounded-2xl md:rounded-[3rem] border border-gray-100 dark:border-zinc-800">
        {list.map(item => {
          const id = tab === 'printers' ? (item as any).id : (item as any).name;
          const isSelected = selectedIds.includes(id);
          return (
            <div 
              key={id} 
              className={`p-3 md:p-5 rounded-xl md:rounded-3xl border-2 cursor-pointer transition-all text-center flex flex-col items-center gap-2 md:gap-4 group ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 md:scale-105 shadow-lg' : 'border-transparent bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 shadow-sm'}`}
              onClick={() => toggleSelect(id)}
            >
              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center font-black text-xs md:text-sm shadow-inner transition-transform group-hover:scale-110 ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-zinc-800 text-gray-400'}`}>
                {isSelected ? selectedIds.indexOf(id) + 1 : '+'}
              </div>
              <p className={`text-[8px] md:text-[11px] font-black line-clamp-2 uppercase tracking-tighter ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>{item.name}</p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-4 md:pt-8">
        <button 
          onClick={handleCompare}
          disabled={isComparing || selectedIds.length < 2}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-16 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-3 md:gap-5 text-sm md:text-lg uppercase tracking-widest"
        >
          {isComparing ? <div className="animate-spin rounded-full h-5 w-5 md:h-7 md:w-7 border-4 border-white border-t-transparent" /> : <ArrowRightLeft className="w-5 h-5 md:w-7 md:h-7" />}
          {isComparing ? 'Analyse...' : t.compareBtn}
        </button>
      </div>

      {selectedIds.length >= 2 && (
        <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="overflow-x-auto bg-white dark:bg-zinc-900 rounded-3xl md:rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-xl md:shadow-2xl overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  <th className="p-4 md:p-10 bg-gray-50 dark:bg-zinc-800/50 w-48 md:w-72 text-[10px] md:text-xs font-black uppercase text-gray-400 tracking-widest md:tracking-[0.2em]">Specs</th>
                  {selectedIds.map(id => {
                    const item = list.find(i => (tab === 'printers' ? (i as any).id : (i as any).name) === id);
                    return <th key={id} className="p-4 md:p-10 font-black text-blue-600 dark:text-blue-400 min-w-[150px] md:min-w-[250px] text-center text-base md:text-xl tracking-tighter">{item?.name}</th>;
                  })}
                </tr>
              </thead>
              <tbody className="text-sm md:text-base">
                {tab === 'printers' ? (
                  <>
                    <tr className="border-b border-gray-50 dark:border-zinc-800/50">
                      <td className="p-4 md:p-10 font-black text-gray-900 dark:text-white uppercase text-[10px] md:text-xs tracking-wider">Prix</td>
                      {selectedIds.map(id => {
                        const p = allRequestedPrinters.find(i => i.id === id);
                        return <td key={id} className="p-4 md:p-10 text-center font-black text-lg md:text-2xl text-green-600 tracking-tighter">{p?.price} €</td>;
                      })}
                    </tr>
                    <tr className="border-b border-gray-50 dark:border-zinc-800/50">
                      <td className="p-4 md:p-10 font-black text-gray-900 dark:text-white uppercase text-[10px] md:text-xs tracking-wider">Volume</td>
                      {selectedIds.map(id => {
                        const p = allRequestedPrinters.find(i => i.id === id);
                        return <td key={id} className="p-4 md:p-10 text-center text-gray-700 dark:text-gray-300 font-bold">{p?.buildVolume}</td>;
                      })}
                    </tr>
                    <tr className="border-b border-gray-50 dark:border-zinc-800/50">
                      <td className="p-4 md:p-10 font-black text-gray-900 dark:text-white uppercase text-[10px] md:text-xs tracking-wider">Buse</td>
                      {selectedIds.map(id => {
                        const p = allRequestedPrinters.find(i => i.id === id);
                        return <td key={id} className="p-4 md:p-10 text-center text-gray-700 dark:text-gray-300 font-bold">{p?.nozzleType} ({p?.nozzleDiameter}mm)</td>;
                      })}
                    </tr>
                    <tr className="border-b border-gray-50 dark:border-zinc-800/50">
                      <td className="p-4 md:p-10 font-black text-gray-900 dark:text-white uppercase text-[10px] md:text-xs tracking-wider">Tech</td>
                      {selectedIds.map(id => {
                        const p = allRequestedPrinters.find(i => i.id === id);
                        return <td key={id} className="p-4 md:p-10 text-center text-[10px] md:text-xs text-gray-500 font-medium italic leading-relaxed">{p?.newTech}</td>;
                      })}
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="border-b border-gray-50 dark:border-zinc-800/50">
                      <td className="p-4 md:p-10 font-black text-gray-900 dark:text-white uppercase text-[10px] md:text-xs tracking-wider">Qualités</td>
                      {selectedIds.map(id => {
                        const b = filamentBrands.find(i => i.name === id);
                        return <td key={id} className="p-4 md:p-10 text-xs md:text-sm text-gray-700 dark:text-gray-300 font-bold leading-relaxed">{b?.pros.join(', ')}</td>;
                      })}
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {analysis && (
            <div className="bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-600/20 dark:to-purple-600/20 p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border-2 md:border-4 border-blue-200 dark:border-blue-900 flex flex-col md:flex-row gap-6 md:gap-10 items-center shadow-xl">
              <div className="p-4 md:p-6 bg-blue-600 text-white rounded-2xl md:rounded-[2rem] shadow-xl shrink-0 animate-pulse"><Lightbulb className="w-8 h-8 md:w-12 md:h-12" /></div>
              <div>
                <h3 className="text-[10px] md:text-sm font-black text-blue-600 uppercase tracking-widest md:tracking-[0.4em] mb-2 md:mb-4 text-center md:text-left">Analyse Comparative IA</h3>
                <p className="text-lg md:text-3xl font-bold leading-tight text-blue-900 dark:text-blue-50 italic tracking-tight text-center md:text-left">{analysis}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FilamentSelectorPage = ({ t }: { t: TranslationStrings }) => {
  const [selectedId, setSelectedId] = useState('');
  const printer = useMemo(() => allRequestedPrinters.find(p => p.id === selectedId), [selectedId]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 md:space-y-12 pb-32">
      <div className="bg-white dark:bg-zinc-900 p-6 md:p-12 rounded-3xl md:rounded-[3rem] shadow-2xl border border-gray-100 dark:border-zinc-800 space-y-4 md:space-y-8">
        <label className="block text-xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight md:leading-none">{t.selectPrinter}</label>
        <div className="relative">
          <select 
            className="w-full p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-lg md:text-2xl font-black outline-none focus:ring-8 focus:ring-blue-500/10 appearance-none cursor-pointer shadow-inner transition-all hover:border-blue-400"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">-- Sélectionnez --</option>
            {allRequestedPrinters.map(p => <option key={p.id} value={p.id}>{p.brand} {p.name}</option>)}
          </select>
          <ChevronDown className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600 w-6 h-6 md:w-8 md:h-8" />
        </div>
      </div>

      {printer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 animate-in slide-in-from-bottom-16 duration-700">
          {filaments.map(f => {
            const isCompatible = printer.filaments.includes(f.name) || printer.maxNozzleTemp >= 260; 
            const rating = isCompatible ? Math.max(1, 6 - f.difficulty) : 0;
            return (
              <div key={f.name} className={`p-6 md:p-10 rounded-2xl md:rounded-[3rem] border-2 md:border-4 transition-all ${isCompatible ? 'bg-white dark:bg-zinc-900 border-green-200 dark:border-green-900 shadow-xl md:shadow-2xl md:scale-105' : 'bg-gray-100 dark:bg-zinc-800 opacity-40 grayscale blur-[1px]'}`}>
                <div className="flex justify-between items-center mb-4 md:mb-8">
                  <h3 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{f.name}</h3>
                  {isCompatible ? <StarRating rating={rating} /> : <span className="text-[8px] md:text-[10px] font-black text-red-600 uppercase tracking-widest border-2 border-red-200 px-2 py-1 rounded-lg">Incompatible</span>}
                </div>
                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {isCompatible ? "Optimisé pour cette machine." : "Limitation technique détectée."}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const RecommendationPage = ({ t, lang }: { t: TranslationStrings, lang: Language }) => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer('');
    const res = await getPrinterRecommendation(query, lang);
    setAnswer(res);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-10 md:space-y-16 py-6 md:py-10 pb-32">
      <div className="text-center space-y-4 md:space-y-6">
        <h1 className="text-4xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight md:leading-none">Conseiller IA</h1>
        <p className="text-lg md:text-2xl font-bold tracking-tight text-gray-500">L'expertise d'un pro dans votre poche.</p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1.5 md:-inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl md:rounded-[4rem] blur-xl opacity-20 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[3rem] shadow-2xl p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8 items-center border border-gray-100 dark:border-zinc-800">
          <input 
            className="flex-1 bg-transparent p-4 md:p-6 text-lg md:text-2xl outline-none text-gray-900 dark:text-white w-full font-bold tracking-tight placeholder:text-gray-300"
            placeholder={t.askAi}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button 
            onClick={handleAsk}
            disabled={loading}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-16 py-4 md:py-6 rounded-xl md:rounded-[2rem] font-black flex items-center justify-center gap-3 md:gap-5 shadow-2xl transition-all active:scale-95 disabled:opacity-50 text-base md:text-xl"
          >
            {loading ? <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-4 border-white border-t-transparent" /> : <BrainCircuit className="w-6 h-6 md:w-8 md:h-8" />}
            ANALYSER
          </button>
        </div>
      </div>

      {answer && (
        <div className="bg-white dark:bg-zinc-900 p-8 md:p-16 rounded-3xl md:rounded-[4rem] border border-gray-100 dark:border-zinc-800 shadow-2xl animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-20 duration-1000">
          <div className="prose dark:prose-invert max-w-none whitespace-pre-line text-lg md:text-2xl leading-relaxed text-gray-800 dark:text-gray-200 font-medium font-serif">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [page, setPage] = useState('home');
  const [lang, setLang] = useState<Language>('FR');
  const [theme, setTheme] = useState<Theme>('light');

  const t = translations[lang];

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#000000';
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#f9fafb';
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLang = () => {
    const langs: Language[] = ['FR', 'EN', 'DE'];
    const idx = (langs.indexOf(lang) + 1) % langs.length;
    setLang(langs[idx]);
  };

  const navItems = [
    { id: 'home', icon: <Monitor className="w-5 h-5 lg:w-6 lg:h-6" />, label: t.home },
    { id: 'printers', icon: <PrinterIcon className="w-5 h-5 lg:w-6 lg:h-6" />, label: t.printers },
    { id: 'filaments', icon: <Layers className="w-5 h-5 lg:w-6 lg:h-6" />, label: t.filaments },
    { id: 'brands', icon: <Info className="w-5 h-5 lg:w-6 lg:h-6" />, label: t.brands },
    { id: 'compare', icon: <ArrowRightLeft className="w-5 h-5 lg:w-6 lg:h-6" />, label: t.compare },
    { id: 'choice', icon: <HelpCircle className="w-5 h-5 lg:w-6 lg:h-6" />, label: t.filamentChoice },
    { id: 'recommend', icon: <Lightbulb className="w-5 h-5 lg:w-6 lg:h-6" />, label: t.recommendation },
  ];

  return (
    <div className={`min-h-screen font-sans transition-all duration-1000 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-zinc-900'}`}>
      {/* Sidebar Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-3xl border-t border-gray-100 dark:border-zinc-800 z-40 lg:top-0 lg:bottom-0 lg:right-auto lg:w-[20rem] xl:w-[24rem] lg:border-r lg:border-t-0 p-4 md:p-8 flex lg:flex-col gap-4 md:gap-8 overflow-y-auto no-scrollbar">
        
        {/* Logo and Global Controls (Always on top) */}
        <div className="hidden lg:flex flex-col gap-8 mb-8">
          <div className="flex items-center gap-6 px-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 rounded-[1.5rem] flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-blue-500/30">3D</div>
            <div>
              <h1 className="font-black text-3xl tracking-tighter leading-none text-gray-900 dark:text-white">EXPERT</h1>
              <p className="text-[12px] font-black text-blue-600 tracking-[0.3em] uppercase mt-2">Compare</p>
            </div>
          </div>

          <div className="flex gap-4 px-2">
            <button onClick={toggleTheme} className="flex-1 flex items-center justify-center gap-3 p-4 rounded-[1.2rem] bg-gray-100 dark:bg-zinc-800/50 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all font-black group shadow-sm text-gray-900 dark:text-white">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span className="text-[10px] uppercase tracking-widest">{theme === 'light' ? 'Nuit' : 'Jour'}</span>
            </button>
            <button onClick={toggleLang} className="flex-1 flex items-center justify-center gap-3 p-4 rounded-[1.2rem] bg-gray-100 dark:bg-zinc-800/50 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all font-black shadow-sm text-gray-900 dark:text-white">
              <Languages size={20} />
              <span className="text-[10px] uppercase tracking-widest">{lang}</span>
            </button>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex lg:flex-col h-full items-center lg:items-stretch gap-2 md:gap-4 overflow-x-auto lg:overflow-visible no-scrollbar w-full pb-2 md:pb-10">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex flex-col lg:flex-row items-center gap-2 lg:gap-6 px-4 md:px-8 py-3 md:py-6 rounded-xl md:rounded-[1.5rem] transition-all whitespace-nowrap shrink-0 group ${page === item.id ? 'bg-blue-600 text-white shadow-xl md:shadow-2xl shadow-blue-500/50 lg:translate-x-2' : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:text-gray-900'}`}
            >
              <div className={`${page === item.id ? 'scale-110 lg:scale-125' : 'group-hover:scale-110'} transition-transform duration-500`}>{item.icon}</div>
              <span className="text-[8px] md:text-[10px] lg:text-base font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-24 lg:pb-10 lg:pl-[20rem] xl:pl-[24rem] min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-3xl lg:hidden px-4 md:px-8 py-3 md:py-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center transition-all shadow-sm">
          <div className="flex items-center gap-2 md:gap-5">
             <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-600 rounded-lg md:rounded-[1rem] flex items-center justify-center text-white font-black text-xs md:text-lg shadow-xl shadow-blue-500/20">3D</div>
             <div className="font-black text-sm md:text-xl tracking-tighter text-gray-900 dark:text-white uppercase leading-none">Expert<br/><span className="text-[8px] md:text-xs tracking-widest text-blue-600">Compare</span></div>
          </div>
          <div className="flex gap-1.5">
            <button onClick={toggleTheme} className="p-2.5 md:p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg md:rounded-xl text-gray-900 dark:text-white shadow-sm hover:scale-105 transition-transform">{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}</button>
            <button onClick={toggleLang} className="p-2.5 md:p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg md:rounded-xl font-black text-[9px] text-gray-900 dark:text-white shadow-sm uppercase hover:scale-105 transition-transform">{lang}</button>
          </div>
        </header>

        <div className="p-4 md:p-10 lg:p-20 animate-in fade-in duration-1000">
          {page === 'home' && <HomePage t={t} onRate={(r, f) => console.log('Feedback:', r, f)} />}
          {page === 'printers' && <PrintersPage t={t} lang={lang} />}
          {page === 'filaments' && <FilamentsPage t={t} />}
          {page === 'brands' && <FilamentBrandsPage t={t} />}
          {page === 'compare' && <ComparePage t={t} lang={lang} />}
          {page === 'choice' && <FilamentSelectorPage t={t} />}
          {page === 'recommend' && <RecommendationPage t={t} lang={lang} />}
        </div>
      </main>
    </div>
  );
}
