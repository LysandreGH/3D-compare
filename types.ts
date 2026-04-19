
export type Language = 'FR' | 'EN' | 'DE';
export type Theme = 'light' | 'dark';

export interface Printer {
  id: string;
  brand: string;
  name: string;
  price: number;
  buildVolume: string;
  filaments: string[];
  maxNozzleTemp: number;
  maxBedTemp: number;
  nozzleType: string; // laiton, acier inoxydable, acier trempé
  nozzleDiameter: number;
  multicolor: {
    supported: boolean;
    system?: string; // ex: AMS, CFS, MMU3
  };
  newTech: string; // ex: Double buses, système vortex
  pros: string[];
  cons: string[];
  image: string;
}

export interface FilamentType {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  difficulty: number; // 1-5 stars
}

export interface FilamentBrand {
  name: string;
  pros: string[];
  cons: string[];
}

export interface TranslationStrings {
  home: string;
  printers: string;
  filaments: string;
  brands: string;
  compare: string;
  filamentChoice: string;
  recommendation: string;
  purpose: string;
  aiAttribution: string;
  rateApp: string;
  searchPlaceholder: string;
  minPrice: string;
  maxPrice: string;
  details: string;
  characteristics: string;
  compareTabs: {
    printers: string;
    brands: string;
  };
  compareBtn: string;
  reset: string;
  selectPrinter: string;
  askAi: string;
  aiThinking: string;
  noResults: string;
  techSpecs: {
    brand: string;
    price: string;
    volume: string;
    compat: string;
    tempNozzle: string;
    tempBed: string;
    nozzleType: string;
    nozzleDiam: string;
    multicolor: string;
    tech: string;
  }
}
