
export type Language = 'FR' | 'EN' | 'DE';
export type Theme = 'light' | 'dark';

export interface PrinterVariant {
  name: string;
  price: number;
}

export interface Printer {
  id: string;
  brand: string;
  name: string;
  price: number; // Base price
  comboPrice?: number; // Optional combo price
  variants?: PrinterVariant[]; // Optional list of variants/combos
  enclosed: boolean; // Enclosed (fermée) or open (ouverte)
  structure: 'CoreXY' | 'Cartésienne XYZ' | 'CoreXZ' | 'Delta' | 'IDEX';
  discontinued?: boolean; // True for old/out of stock models
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
  // Detailed technical specifications from official datasheets
  maxSpeed?: number;
  maxAcceleration?: string;
  maxFlow?: string;
  chassis?: string;
  dimensions?: string;
  weight?: string;
  screen?: string;
  chamberHeating?: string;
  filtration?: string;
  camera?: string;
  sensors?: string[];
  extruderGears?: string;
  supportedPlates?: string[];
  laserModule?: string;
  cuttingModule?: string;
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
  };
  homeBoxes?: {
    siteInfoBadge: string;
    siteInfoTitle: string;
    siteInfoSubtitle: string;
    priceUpdatedLabel: string;
    contentUpdatedLabel: string;
    lastUpdatedPrefix: string;
    eventsBadge: string;
    eventsTag: string;
    eventsTitle: string;
    eventsDeals: string;
    anycubicTag: string;
    anycubicDiscount: string;
    anycubicTitle: string;
    anycubicDesc: string;
    anycubicBtn: string;
    elegooTag: string;
    elegooDiscount: string;
    elegooTitle: string;
    elegooDesc: string;
    elegooBtn: string;
    aiSearchTitle: string;
    rateSubtitle: string;
    rateSuccessTitle: string;
    rateSuccessDesc: string;
    rateOpenMail: string;
    rateAnother: string;
    ratePlaceholder: string;
    rateSubmit: string;
    rateSubmitting: string;
  };
  aiAdvisor?: {
    title: string;
    subtitle: string;
    sampleQuestions: string[];
    analyzeBtn: string;
    analysisTitle: string;
    analysisSubtitle: string;
  };
  specsTable?: {
    fullTableTitle: string;
    viewTableBtn: string;
    hideTableBtn: string;
    pointsForts: string;
    pointsFaibles: string;
    basePrice: string;
    comboPrice: string;
    availableVariants: string;
    enclosed: string;
    open: string;
    activeCatalog: string;
    legacyCatalog: string;
    secCommercial: string;
    secStructure: string;
    secToolhead: string;
    secSpeed: string;
    secMulticolor: string;
    secElectronics: string;
    secHighlights: string;
    brandModel: string;
    commercialStatus: string;
    basePriceLabel: string;
    comboPriceLabel: string;
    architecture: string;
    enclosureType: string;
    chassis: string;
    buildVolume: string;
    dimensions: string;
    netWeight: string;
    extruderGears: string;
    nozzleMaterial: string;
    maxNozzleTemp: string;
    maxBedTemp: string;
    chamberHeat: string;
    airFiltration: string;
    maxSpeed: string;
    maxAccel: string;
    flowRate: string;
    bedLeveling: string;
    printSurface: string;
    multicolorSystem: string;
    supportedFilaments: string;
    controlScreen: string;
    cameraMonitoring: string;
    sensorsSafety: string;
    connectivity: string;
    slicers: string;
    innovations: string;
    filterByBrand: string;
    allBrands: string;
    clearFilter: string;
    activeModels: string;
    oldModels: string;
    sortBy: string;
  };
  filters?: {
    all: string;
    enclosed: string;
    open: string;
    multicolorAll: string;
    multicolorSupported: string;
    monocolor: string;
    structureAll: string;
    brandLabel: string;
    enclosureLabel: string;
    colorsLabel: string;
    structureLabel: string;
    activeCatalogLabel: string;
    legacyCatalogLabel: string;
    noPrintersFound: string;
    resetFilters: string;
    discontinuedNotice: string;
  };
  comparison?: {
    characteristicsCol: string;
    activeConfig: string;
    comboVersionBtn: string;
    baseVersionBtn: string;
    comboTag: string;
    baseTag: string;
    detailedComparisonBtn: string;
    hideDetailedComparisonBtn: string;
    detailedComparisonTitle: string;
    selectedModelsCount: string;
    analyzing: string;
    singleColor: string;
    multiColorYes: string;
    filamentsLabel: string;
    brandQualities: string;
  };
}
