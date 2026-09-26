import { Language } from './types';

// Dictionary mapping French phrases found in pros, cons, and technical specs to English and German
const dictionary: Record<string, { EN: string; DE: string }> = {
  // Common Pros
  "Plug & Play et étalonnage tout-en-un": { EN: "Plug & Play and all-in-one calibration", DE: "Plug & Play und All-in-One-Kalibrierung" },
  "Très silencieuse": { EN: "Very quiet operation", DE: "Sehr leiser Betrieb" },
  "Silencieuse": { EN: "Quiet operation", DE: "Leiser Betrieb" },
  "Qualité d'impression exemplaire": { EN: "Exemplary print quality", DE: "Vorbildliche Druckqualität" },
  "Excellente qualité": { EN: "Excellent quality", DE: "Hervorragende Qualität" },
  "Excellente finition": { EN: "Excellent build finish", DE: "Hervorragende Verarbeitung" },
  "Vitesse impressionnante 500 mm/s": { EN: "Impressive speed 500 mm/s", DE: "Beeindruckende Geschwindigkeit 500 mm/s" },
  "Vitesse impressionnante 600 mm/s": { EN: "Impressive 600 mm/s speed", DE: "Beeindruckende 600 mm/s Geschwindigkeit" },
  "Vitesse 600 mm/s de série": { EN: "600 mm/s standard speed", DE: "600 mm/s Standardgeschwindigkeit" },
  "Vitesse 600 mm/s": { EN: "600 mm/s speed", DE: "600 mm/s Geschwindigkeit" },
  "Vitesse record de 1000 mm/s": { EN: "Record speed of 1000 mm/s", DE: "Rekordgeschwindigkeit von 1000 mm/s" },
  "Vitesse 1000 mm/s et débit jusqu'à 65 mm³/s": { EN: "1000 mm/s speed and flow rate up to 65 mm³/s", DE: "1000 mm/s und Durchfluss bis zu 65 mm³/s" },
  "Vitesse extrême jusqu’à 700 mm/s": { EN: "Extreme speed up to 700 mm/s", DE: "Extreme Geschwindigkeit bis zu 700 mm/s" },
  "Vitesse 500 mm/s et Klipper natif à moins de 190 €": { EN: "500 mm/s speed and native Klipper under €190", DE: "500 mm/s und natives Klipper unter 190 €" },
  "Vitesse 500 mm/s et tirants de stabilité": { EN: "500 mm/s speed and stability tie-rods", DE: "500 mm/s und verstärkende Stabilisierungsstangen" },
  "Changement de buse ultra-rapide": { EN: "Ultra-fast quick-swap nozzle", DE: "Ultraschneller Düsenwechsel" },
  "Buse démontage rapide": { EN: "Quick-swap nozzle", DE: "Schnellwechseldüse" },
  "Buse acier trempé rapide": { EN: "Quick-swap hardened steel nozzle", DE: "Schnellwechselbare gehärtete Stahldüse" },
  "Buse acier trempé démontable sans outil": { EN: "Tool-free quick-swap hardened steel nozzle", DE: "Werkzeuglos wechselbare gehärtete Stahldüse" },
  "Buse acier trempé de série": { EN: "Hardened steel nozzle included", DE: "Gehärtete Stahldüse serienmäßig" },
  "Buse 320°C acier trempé": { EN: "320°C hardened steel nozzle", DE: "320°C gehärtete Stahldüse" },
  "Buse haute température 320°C en acier trempé": { EN: "320°C high-temp hardened steel nozzle", DE: "320°C Hochtemperatur-Stahldüse" },
  "Buse 350°C et chambre active 65°C": { EN: "350°C nozzle and active 65°C chamber", DE: "350°C Düse und aktive 65°C Kammer" },
  "Buse 350 ℃ pour composites avancés": { EN: "350 ℃ nozzle for advanced composites", DE: "350 ℃ Düse für moderne Verbundwerkstoffe" },
  "Buse poussée à 350 °C pour matériaux industriels (PPA-CF, PPS-CF)": { EN: "350 °C nozzle for industrial materials (PPA-CF, PPS-CF)", DE: "350 °C Düse für Industriematerialien (PPA-CF, PPS-CF)" },
  "Double buse haute température 350°C sans purge": { EN: "Dual 350°C high-temp nozzles without purge waste", DE: "Doppeldüse 350°C ohne Spülmüll" },
  "Plateau chauffant jusqu'à 100°C": { EN: "Heated bed up to 100°C", DE: "Heizbett bis zu 100°C" },
  "Grand volume utile 330×320×325 mm": { EN: "Large build volume 330×320×325 mm", DE: "Großes Bauvolumen 330×320×325 mm" },
  "Grand volume 340×320×340 mm": { EN: "Large volume 340×320×340 mm", DE: "Großes Volumen 340×320×340 mm" },
  "Grand volume utile 350×350×350 mm": { EN: "Spacious 350×350×350 mm volume", DE: "Großes 350×350×350 mm Bauvolumen" },
  "Volume XXL 350×350×350 mm entièrement fermé et chauffé à 60 ℃": { EN: "XXL 350×350×350 mm volume fully enclosed and heated to 60 ℃", DE: "XXL-Volumen 350×350×350 mm voll geschlossen und auf 60 ℃ beheizt" },
  "Volume géant 420×420×500 mm multicolore": { EN: "Giant 420×420×500 mm multicolor volume", DE: "Riesiges 420×420×500 mm Mehrfarben-Volumen" },
  "Volume titanesque d’un mètre de hauteur": { EN: "Titanic 1-meter high build volume", DE: "Gigantisches Bauvolumen mit 1 Meter Höhe" },
  "Volume gigantesque 400×400×400 mm": { EN: "Gigantic 400×400×400 mm build volume", DE: "Riesiges 400×400×400 mm Bauvolumen" },
  "Grand volume fermé 300×300×300 mm à prix très attractif": { EN: "Large enclosed volume 300×300×300 mm at attractive price", DE: "Großer geschlossener Bauraum 300×300×300 mm zum attraktiven Preis" },
  "Rapport qualité/prix imbattable": { EN: "Unbeatable price-performance ratio", DE: "Unschlagbares Preis-Leistungs-Verhältnis" },
  "Rapport qualité/prix imbattable à 329 € avec boîtier séchant": { EN: "Unbeatable value at €329 with drying box", DE: "Unschlagbarer Wert für 329 € inkl. Trockenbox" },
  "Boîtier fermé pour ABS/ASA": { EN: "Enclosed chamber for ABS/ASA", DE: "Geschlossenes Gehäuse für ABS/ASA" },
  "Boîtier fermé avec caméra IA et filtration charbon": { EN: "Enclosed chamber with AI camera and carbon filtration", DE: "Geschlossener Bauraum mit KI-Kamera und Aktivkohlefilter" },
  "Boîtier fermé adapté ABS, ASA, Nylon, PC": { EN: "Enclosed chamber suitable for ABS, ASA, Nylon, PC", DE: "Geschlossene Kammer für ABS, ASA, Nylon, PC" },
  "Chambre chauffée activement jusqu'à 65°C": { EN: "Actively heated chamber up to 65°C", DE: "Aktiv beheizter Bauraum bis 65°C" },
  "Chambre chauffée activement à 60 ℃ pour matériaux ultra-techniques (PA-CF, PPA-CF)": { EN: "Actively heated chamber at 60 ℃ for high-tech filaments (PA-CF, PPA-CF)", DE: "Aktiv beheizter Bauraum bei 60 ℃ für Hochleistungsmaterialien (PA-CF, PPA-CF)" },
  "Filtration charbon noix de coco et Wi-Fi double bande": { EN: "Coconut carbon filter and dual-band Wi-Fi", DE: "Kokos-Aktivkohlefilter und Dualband-WLAN" },
  "Filtration HEPA H12 + Charbon": { EN: "HEPA H12 + Carbon filtration", DE: "HEPA H12 + Aktivkohlefilterung" },
  "Double filtration HEPA & Charbon": { EN: "Dual HEPA & Carbon filtration", DE: "Doppelte HEPA- & Aktivkohlefilterung" },
  "Purificateur d’air": { EN: "Air purifier built-in", DE: "Integrierter Luftreiniger" },
  "Caméra IA et Input Shaping inclus": { EN: "AI Camera and Input Shaping included", DE: "KI-Kamera und Input Shaping enthalten" },
  "Double caméra IA intégrée": { EN: "Dual integrated AI cameras", DE: "Integrierte duale KI-Kameras" },
  "Double LiDAR IA pour première couche parfaite": { EN: "Dual AI LiDAR for flawless first layer", DE: "Duales KI-LiDAR für perfekte erste Schicht" },
  "Moteurs servo haute précision en boucle fermée": { EN: "Closed-loop high-precision servo motors", DE: "Hochpräzise Servomotoren mit geschlossenem Regelkreis" },
  "Multicolore ultra rapide sans purge": { EN: "Ultra-fast waste-free multicolor", DE: "Ultraschneller Mehrfarbendruck ohne Spülmüll" },
  "Support jusqu’à 16 couleurs avec le système CFS": { EN: "Supports up to 16 colors with the CFS system", DE: "Unterstützt bis zu 16 Farben mit dem CFS-System" },
  "Compatibilité multicolore CFS jusqu’à 16 couleurs": { EN: "CFS multicolor compatibility up to 16 colors", DE: "CFS-Mehrfarbenkompatibilität bis zu 16 Farben" },
  "Record du marché jusqu'à 19 couleurs simultanées": { EN: "Market record up to 19 simultaneous colors", DE: "Marktrekord mit bis zu 19 gleichzeitigen Farben" },
  "Record du marché jusqu’à 19 couleurs simultanées": { EN: "Market record up to 19 simultaneous colors", DE: "Marktrekord mit bis zu 19 gleichzeitigen Farben" },
  "Boîtier ACE Pro V2 avec séchage double PTC 55°C": { EN: "ACE Pro V2 box with dual PTC 55°C drying", DE: "ACE Pro V2 Box mit doppelter PTC 55°C Trocknung" },
  "Séchage actif des filaments intégré au boîtier 4 couleurs": { EN: "Active drying built into the 4-color box", DE: "Aktive Trocknung in der 4-Farben-Box integriert" },
  "Séchage actif en version combo": { EN: "Active filament drying in combo edition", DE: "Aktive Trocknung in der Combo-Version" },
  "Étalonnage LeviQ 3.0 automatique sans réglage feuille": { EN: "Automatic LeviQ 3.0 leveling without paper", DE: "Automatisches LeviQ 3.0 Nivellieren ohne Papier" },
  "Nivellement 121 points": { EN: "121-point auto-leveling", DE: "121-Punkte-Autonivellierung" },
  "CoreXY en aluminium moulé très rigide": { EN: "Ultra-rigid die-cast aluminum CoreXY", DE: "Sehr steife Druckguss-Aluminium-CoreXY-Struktur" },
  "CoreXY fermé très abordable (309 €)": { EN: "Very affordable enclosed CoreXY (€309)", DE: "Sehr erschwinglicher geschlossener CoreXY (309 €)" },
  "CoreXY fermé sous les 310€": { EN: "Enclosed CoreXY under €310", DE: "Geschlossener CoreXY unter 310 €" },
  "Prix multicolore très agressif à 259 €": { EN: "Very aggressive multicolor price at €259", DE: "Sehr aggressiver Mehrfarbenpreis ab 259 €" },
  "Prix promo saisissant à 349 € seule (au lieu de 549 €)": { EN: "Striking promo at €349 standalone (was €549)", DE: "Starke Aktion für 349 € einzeln (statt 549 €)" },
  "Remise exceptionnelle à 569 € (au lieu de 899 €)": { EN: "Huge discount at €569 (was €899)", DE: "Riesiger Rabatt für 569 € (statt 899 €)" },
  "Super tarif à 199 € seule (au lieu de 379 €)": { EN: "Amazing price at €199 standalone (was €379)", DE: "Hammerpreis für 199 € einzeln (statt 379 €)" },
  "Prête pour filaments carbone (CF) dès la sortie de boîte": { EN: "Carbon-fiber (CF) ready out of the box", DE: "Direkt ab Werk bereit für Carbon-Filamente (CF)" },
  "Plateau PEI texturé doré double face": { EN: "Double-sided golden textured PEI build plate", DE: "Doppelseitiges goldenes strukturiertes PEI-Druckbett" },
  "Alimentation fluide extrudeur nouvelle génération": { EN: "Smooth next-gen extruder feeding", DE: "Reibungsloser Extruder-Einzug der nächsten Generation" },
  "Légère (6.8 kg) et très rapide (500 mm/s)": { EN: "Lightweight (6.8 kg) and very fast (500 mm/s)", DE: "Leicht (6.8 kg) und sehr schnell (500 mm/s)" },
  "Gestion RFID des filaments et relais automatique": { EN: "RFID filament management and auto-spool relay", DE: "RFID-Filamentverwaltung und automatischer Spulenwechsel" },
  "Tension active de courroie et RFID": { EN: "Active belt tensioning and RFID", DE: "Aktive Riemenspannung und RFID" },
  "Très rapide et robuste": { EN: "Very fast and sturdy", DE: "Sehr schnell und robust" },
  "Prix très accessible pour une CoreXY fermée": { EN: "Very accessible price for an enclosed CoreXY", DE: "Sehr günstiger Preis für einen geschlossenen CoreXY" },
  "Structure cubique ultra rigide pour impressions lourdes": { EN: "Ultra-rigid cubic structure for heavy prints", DE: "Ultra-steife kubische Struktur für schwere Drucke" },
  "Volume XXL fermé 350mm pour grands projets techniques": { EN: "XXL enclosed 350mm volume for technical prints", DE: "Großes geschlossenes 350 mm Volumen für technische Drucke" },
  "Accélération phénoménale de 30 000 mm/s²": { EN: "Phenomenal acceleration of 30,000 mm/s²", DE: "Phänomenale Beschleunigung von 30.000 mm/s²" },
  "Supporte les composites et filaments techniques jusqu’à 320 °C": { EN: "Supports composites and technical filaments up to 320 °C", DE: "Unterstützt Verbundwerkstoffe bis 320 °C" },
  "Triple vis Z avec 3 barres de guidage linéaire": { EN: "Triple Z-lead screws with 3 linear guide rods", DE: "Dreifache Z-Spindeln mit 3 Linearführungen" },
  "Boîtier multicolore CANVAS optionnel": { EN: "Optional CANVAS multicolor unit", DE: "Optionale CANVAS-Mehrfarbeneinheit" },
  "Niveau sonore remarquable ≤45 dB": { EN: "Remarkably quiet ≤45 dB", DE: "Bemerkenswert leise ≤45 dB" },
  "Écran 5\" HD et détection de bourrage": { EN: "5\" HD screen and clog detection", DE: "5\" HD-Display und Verstopfungserkennung" },
  "Écran 5\" tactile et buse 350 °C": { EN: "5\" touchscreen and 350 °C nozzle", DE: "5\" Touchscreen und 350 °C Düse" },
  "CoreXY haute vitesse à moins de 300 €": { EN: "High-speed CoreXY under €300", DE: "Schneller CoreXY unter 300 €" },
  "Triple vis Z avec barres linéaires": { EN: "Triple Z-axis screws with linear rods", DE: "Dreifache Z-Achsen-Spindeln mit Linearstangen" },
  "Plateau de 820×820 mm divisé en 4 zones chauffantes indépendantes": { EN: "820×820 mm bed split into 4 independent heating zones", DE: "820×820 mm Druckbett mit 4 unabhängigen Heizzonen" },
  "Capacité multi-têtes jusqu’à 4 pièces en parallèle": { EN: "Multi-head capability up to 4 parts in parallel", DE: "Mehrkopf-Fähigkeit für bis zu 4 Teile gleichzeitig" },
  "Buse haute température 300 °C compatible Nylon": { EN: "300 °C high-temp nozzle compatible with Nylon", DE: "300 °C Düse kompatibel mit Nylon" },
  "Ventilation auxiliaire très puissante": { EN: "Powerful auxiliary cooling fan bar", DE: "Sehr starke Zusatzlüfterleiste" },
  "Rails métalliques en acier rigides et durables": { EN: "Rigid and durable all-metal steel rails", DE: "Präzise und langlebige Ganzmetallschienen aus Stahl" },
  "Plateau chauffant intelligent à double zone": { EN: "Smart dual-zone heated print bed", DE: "Intelligentes Doppelzonen-Heizbett" },
  "Buse 300 °C et vitesse 500 mm/s": { EN: "300 °C nozzle and 500 mm/s speed", DE: "300 °C Düse und 500 mm/s Geschwindigkeit" },
  "Superbe volume intermédiaire 320mm": { EN: "Superb 320mm mid-size volume", DE: "Hervorragendes 320 mm Zwischenformat" },
  "Wi-Fi natif et contrôle Klipper à distance": { EN: "Native Wi-Fi and remote Klipper control", DE: "Integriertes WLAN und Klipper-Fernsteuerung" },
  "Volume XXL géant à prix imbattable (439 €)": { EN: "Giant XXL volume at unbeatable price (€439)", DE: "Riesiges XXL-Volumen zum Bestpreis (439 €)" },
  "Klipper et Wi-Fi intégrés": { EN: "Built-in Klipper and Wi-Fi", DE: "Integriertes Klipper und WLAN" },
  "Excellente stabilité grâce aux renforts": { EN: "Great stability thanks to reinforcing rods", DE: "Exzellente Stabilität dank Verstrebungen" },
  "Prix plancher ultra accessible (149 €)": { EN: "Ultra-low entry price (€149)", DE: "Sehr günstiger Einstiegspreis (149 €)" },
  "Très silencieuse et fiable pour débutants": { EN: "Very quiet and reliable for beginners", DE: "Sehr leise und zuverlässig für Einsteiger" },
  "Double vis sans fin sur l’axe Z": { EN: "Dual lead screws on the Z-axis", DE: "Doppelspindeln auf der Z-Achse" },
  "Parfaite pour filaments techniques": { EN: "Perfect for technical filaments", DE: "Perfekt für technische Filamente" },
  "Grande solidité": { EN: "High rigidity and durability", DE: "Hohe Stabilität und Haltbarkeit" },
  "Fermée et compacte": { EN: "Enclosed and compact", DE: "Geschlossen und kompakt" },
  "Prix raisonnable": { EN: "Reasonable price", DE: "Angemessener Preis" },
  "Châssis rigide": { EN: "Rigid chassis", DE: "Steifes Chassis" },
  "Chambre chauffée": { EN: "Heated chamber", DE: "Beheizter Bauraum" },
  "Excellents résultats sur ABS/ASA/PC": { EN: "Excellent results with ABS/ASA/PC", DE: "Hervorragende Ergebnisse bei ABS/ASA/PC" },
  "Impression haute température": { EN: "High-temperature printing", DE: "Hochtemperatur-Druck" },
  "Volume vertical de 600mm": { EN: "600mm tall vertical build volume", DE: "600 mm hohes vertikales Bauvolumen" },
  "Extrudeur double": { EN: "Dual extruder setup", DE: "Doppel-Extruder-Setup" },
  "Nivellement automatique": { EN: "Automatic bed leveling", DE: "Automatische Bettnivellierung" },
  "Extrêmement rapide sous les 300€": { EN: "Extremely fast under €300", DE: "Extrem schnell unter 300 €" },
  "Sécurité en intérieur (HEPA)": { EN: "Indoor safe (HEPA filtration)", DE: "Sicher im Innenbereich (HEPA-Filter)" },
  "Boîtier fermé silencieux": { EN: "Quiet enclosed chamber", DE: "Leises geschlossenes Gehäuse" },
  "Grande stabilité": { EN: "Rock-solid stability", DE: "Große Stabilität" },
  "Matériaux techniques": { EN: "Technical engineering materials", DE: "Technische Hochleistungsmaterialien" },
  "Compatible multicolore": { EN: "Multicolor compatible", DE: "Mehrfarb-kompatibel" },
  "Volume Voron open source géant": { EN: "Huge open-source Voron build volume", DE: "Riesiges Open-Source-Voron-Bauvolumen" },
  "CoreXY 350mm très rapide": { EN: "Very fast 350mm CoreXY", DE: "Sehr schneller 350 mm CoreXY" },
  "Excellente communauté open-source": { EN: "Superb open-source community", DE: "Hervorragende Open-Source-Community" },
  "Prix compétitif": { EN: "Competitive pricing", DE: "Wettbewerbsfähiger Preis" },
  "Super rapport qualité/prix à 209€": { EN: "Great value at €209", DE: "Tolles Preis-Leistungs-Verhältnis für 209 €" },
  "Ultra rapide et compacte": { EN: "Ultra-fast and compact", DE: "Ultraschnell und kompakt" },
  "Impression bicolore/support soluble rapide": { EN: "Dual-color/soluble support fast printing", DE: "Schneller Zweifarbdruck / lösliche Stützen" },
  "Zéro déchet de purge": { EN: "Zero purge waste", DE: "Null Spülmüll" },
  "Atelier complet 3D + Laser 40W + CNC": { EN: "Complete workshop 3D + 40W Laser + CNC", DE: "Komplette Werkstatt 3D + 40W Laser + CNC" },
  "Boîtier fermé géant": { EN: "Giant enclosed chamber", DE: "Riesiger geschlossener Bauraum" },
  "Qualité industrielle": { EN: "Industrial quality", DE: "Industrielle Qualität" },
  "Plateau géant 400mm": { EN: "Giant 400mm build plate", DE: "Riesiges 400 mm Druckbett" },
  "Modules interchangeables en 1 min": { EN: "Tool-free 1-min quick-swap modules", DE: "In 1 Min. austauschbare Module" },
  "Facile à imprimer": { EN: "Easy to print", DE: "Einfach zu drucken" },
  "Pas de warping": { EN: "Zero warping", DE: "Kein Verzug (Warping)" },
  "Solide": { EN: "Strong and sturdy", DE: "Stabil und fest" },
  "Résistant aux UV": { EN: "UV resistant", DE: "UV-beständig" },
  "Durable": { EN: "Durable", DE: "Langlebig" },
  "Recyclable": { EN: "Recyclable", DE: "Recycelbar" },
  "Clarté optique": { EN: "Optical clarity", DE: "Optische Klarheit" },
  "Résiste à la chaleur": { EN: "Heat resistant", DE: "Hitzebeständig" },
  "Lissable": { EN: "Smoothable with vapor", DE: "Dampfglättbar" },
  "Tenue extérieure parfaite": { EN: "Perfect outdoor weatherability", DE: "Perfekte Witterungsbeständigkeit" },
  "Incassable": { EN: "Virtually unbreakable", DE: "Nahezu unzerbrechlich" },
  "Flexible": { EN: "Flexible", DE: "Flexibel" },
  "Faible friction": { EN: "Low friction", DE: "Geringe Reibung" },
  "Rigidité extrême": { EN: "Extreme stiffness", DE: "Extreme Steifigkeit" },
  "Ultra léger": { EN: "Ultra lightweight", DE: "Ultra-leicht" },

  // Common Cons
  "Volume compact (180mm)": { EN: "Compact volume (180mm)", DE: "Kompaktes Bauvolumen (180 mm)" },
  "Châssis ouvert (ABS/ASA non recommandés)": { EN: "Open frame (ABS/ASA not recommended)", DE: "Offenes Gehäuse (ABS/ASA nicht empfohlen)" },
  "Structure ouverte (ABS/ASA non recommandés)": { EN: "Open structure (ABS/ASA not recommended)", DE: "Offene Struktur (ABS/ASA nicht empfohlen)" },
  "Châssis ouvert (plateau limité à 80°C)": { EN: "Open frame (bed capped at 80°C)", DE: "Offenes Chassis (Heizbett auf 80°C begrenzt)" },
  "Structure ouverte (pas d’enceinte fermée)": { EN: "Open structure (no enclosed chamber)", DE: "Offene Struktur (kein geschlossener Bauraum)" },
  "Châssis ouvert (semi-fermé sans porte vitrée)": { EN: "Open frame (semi-enclosed without glass door)", DE: "Offenes Chassis (halbgeschlossen ohne Glastür)" },
  "Machine ouverte": { EN: "Open frame machine", DE: "Offene Maschine" },
  "Non fermée": { EN: "Non-enclosed", DE: "Nicht geschlossen" },
  "Petit volume 200mm": { EN: "Small 200mm build volume", DE: "Kleines 200 mm Bauvolumen" },
  "Structure ouverte": { EN: "Open structure", DE: "Offene Struktur" },
  "Structure ouverte (sensible aux courants d’air)": { EN: "Open structure (draft sensitive)", DE: "Offene Struktur (zugluftempfindlich)" },
  "Châssis ouvert": { EN: "Open chassis", DE: "Offenes Chassis" },
  "Machine ouverte imposante": { EN: "Bulky open frame machine", DE: "Große offene Maschine" },
  "Modèle discontinué": { EN: "Discontinued model", DE: "Eingestelltes Modell" },
  "Modèle discontinué (remplacé par X2D / P2S)": { EN: "Discontinued (replaced by X2D / P2S)", DE: "Eingestellt (ersetzt durch X2D / P2S)" },
  "Modèle discontinué (remplacé par Kobra 3 Max & Max V2)": { EN: "Discontinued (replaced by Kobra 3 Max & Max V2)", DE: "Eingestellt (ersetzt durch Kobra 3 Max & Max V2)" },
  "Pas de caisson d'origine": { EN: "No factory enclosure", DE: "Kein Gehäuse ab Werk" },
  "Écran monochrome 2.7\" à boutons": { EN: "2.7\" monochrome button screen", DE: "2.7\" Monochrom-Display mit Tasten" },
  "Caméra 0.5 fps basse cadence": { EN: "Low frame rate 0.5 fps camera", DE: "Kamera mit niedriger Bildrate (0.5 fps)" },
  "Prix supérieur au P1S": { EN: "Pricier than the P1S", DE: "Höherer Preis als beim P1S" },
  "Machine professionnelle haut de gamme": { EN: "High-end professional machine", DE: "Professionelle High-End-Maschine" },
  "Machine imposante (30 kg)": { EN: "Heavy machine (30 kg)", DE: "Schwere Maschine (30 kg)" },
  "Prix très élevé": { EN: "Very high price", DE: "Sehr hoher Preis" },
  "Machine haut de gamme avancée": { EN: "Advanced premium machine", DE: "Fortgeschrittene High-End-Maschine" },
  "Volume standard (220×220×235 mm)": { EN: "Standard volume (220×220×235 mm)", DE: "Standardvolumen (220×220×235 mm)" },
  "Volume standard (220mm)": { EN: "Standard 220mm volume", DE: "Standardgröße (220 mm)" },
  "Poids important (23.7 kg)": { EN: "Heavy weight (23.7 kg)", DE: "Hohes Gewicht (23.7 kg)" },
  "Poids industriel imposant (35 kg)": { EN: "Heavy industrial weight (35 kg)", DE: "Schweres Industriegewicht (35 kg)" },
  "Budget premium": { EN: "Premium budget required", DE: "Premium-Preisklasse" },
  "Impression monocouleur uniquement": { EN: "Single color printing only", DE: "Nur einfarbiger Druck" },
  "Monocouleur": { EN: "Single color only", DE: "Nur einfarbig" },
  "Non adaptée ABS (température buse limitée à 260 ℃)": { EN: "Not suited for ABS (nozzle max 260 ℃)", DE: "Nicht für ABS geeignet (Düse max. 260 ℃)" },
  "Plateau limité à 90 °C": { EN: "Bed temperature capped at 90 °C", DE: "Heizbett auf 90 °C begrenzt" },
  "Plateau limité à 85 °C": { EN: "Bed temperature capped at 85 °C", DE: "Heizbett auf 85 °C begrenzt" },
  "Encombrement du boîtier ACE Pro à côté de la machine": { EN: "Desk footprint with ACE Pro unit placed beside", DE: "Platzbedarf mit externer ACE Pro Einheit" },
  "Incombrante": { EN: "Bulky and heavy", DE: "Sperrig" },
  "Machine très encombrante": { EN: "Very bulky machine", DE: "Sehr sperrige Maschine" },
  "Plateau lourd limitant l’accélération sur l’axe Y": { EN: "Heavy bed limits acceleration on the Y-axis", DE: "Schweres Bett begrenzt Beschleunigung auf der Y-Achse" },
  "Encombrement important dans l’atelier": { EN: "Large workshop footprint", DE: "Großer Platzbedarf in der Werkstatt" },
  "Machine imposante et lourde (24.5 kg)": { EN: "Large and heavy machine (24.5 kg)", DE: "Große und schwere Maschine (24.5 kg)" },
  "Poids important (29 kg)": { EN: "Heavy weight (29 kg)", DE: "Hohes Gewicht (29 kg)" },
  "Budget haut de gamme": { EN: "High-end budget", DE: "Höheres Preissegment" },
  "Câblage imposant lors de l’utilisation de multiples boîtiers": { EN: "Extensive cabling when using multiple hubs", DE: "Umfangreiche Verkabelung bei mehreren Hubs" },
  "Poids colossal (104 kg) et encombrement extrême (1.2m de large / 1.4m de haut)": { EN: "Huge weight (104 kg) and extreme size (1.2m wide / 1.4m high)", DE: "Kolossales Gewicht (104 kg) und extreme Maße (1.2 m breit / 1.4 m hoch)" },
  "Consommation électrique 1530W": { EN: "High 1530W power draw", DE: "Hoher Stromverbrauch von 1530 W" },
  "Niveau sonore de la ventilation": { EN: "Audible fan noise", DE: "Hörbare Lüftergeräusche" },
  "Ventilation bruyante": { EN: "Loud cooling fan", DE: "Lauter Lüfter" },
  "Ventilation puissante bruyante": { EN: "Powerful but loud fan", DE: "Leistungsstarker, aber lauter Lüfter" },
  "Encombrement au sol important": { EN: "Significant floor footprint", DE: "Große Stellfläche" },
  "Châssis très imposant": { EN: "Very large frame", DE: "Sehr wuchtiges Gehäuse" },
  "Vitesse classique 180 mm/s (génération précédente)": { EN: "Standard 180 mm/s speed (previous gen)", DE: "Klassische 180 mm/s (vorherige Generation)" },
  "Température max buse 260 °C": { EN: "Max nozzle temp 260 °C", DE: "Max. Düsentemperatur 260 °C" },
  "Fragile à la chaleur (55°C)": { EN: "Low heat resistance (55°C)", DE: "Geringe Hitzebeständigkeit (55°C)" },
  "Cassant": { EN: "Brittle", DE: "Spröde" },
  "Moins résistant": { EN: "Lower impact resistance", DE: "Geringere Schlagfestigkeit" },
  "Fils d'ange (stringing)": { EN: "Prone to stringing", DE: "Neigt zum Fädenziehen (Stringing)" },
  "Rayures faciles": { EN: "Easily scratched", DE: "Kratzanfällig" },
  "Nécessite caisson fermé": { EN: "Requires enclosed chamber", DE: "Erfordert geschlossenen Bauraum" },
  "Odeurs à l'impression": { EN: "Strong print odors", DE: "Geruchsentwicklung beim Drucken" },
  "Sensible au warping": { EN: "Prone to warping", DE: "Verzugsempfindlich" },
  "Prix plus élevé": { EN: "Higher price", DE: "Höherer Preis" },
  "Difficile à imprimer": { EN: "Challenging to print", DE: "Schwierig zu drucken" },
  "Très sensible à l'humidité": { EN: "Very moisture sensitive", DE: "Sehr feuchtigkeitsempfindlich" },
  "Très lent à imprimer": { EN: "Very slow print speed", DE: "Sehr langsam zu drucken" },
  "Difficile avec extrudeur Bowden": { EN: "Difficult with Bowden extruders", DE: "Schwierig bei Bowden-Extrudern" },
  "Abrasif (buse acier requise)": { EN: "Abrasive (hardened steel nozzle required)", DE: "Abrasiv (gehärtete Stahldüse erforderlich)" },
  "Fragilité en torsion": { EN: "Brittle under torsion", DE: "Spröde bei Torsion" },
  "Prix premium": { EN: "Premium price", DE: "Premium-Preis" },

  // Flashforge Pros & Features
  "Double filtration d’air HEPA + charbon actif pour intérieur": { EN: "Dual HEPA + activated carbon filtration for indoor safety", DE: "Doppelte HEPA- und Aktivkohle-Luftfilterung für Innenräume" },
  "Double filtration d’air HEPA et charbon actif": { EN: "Dual HEPA and activated carbon air filtration", DE: "Doppelte HEPA- und Aktivkohle-Luftfilterung" },
  "Mode ultra silencieux à 50 dB": { EN: "Ultra-quiet operation at 50 dB", DE: "Ultra-leiser Betrieb mit 50 dB" },
  "Fonctionnement ultra silencieux (50 dB en mode calme)": { EN: "Ultra-quiet operation (50 dB in low-noise mode)", DE: "Ultra-leiser Betrieb (50 dB im Flüstermodus)" },
  "Buse clipsable interchangeable en 3 secondes": { EN: "Quick-swap clip-on nozzle in 3 seconds", DE: "In 3 Sekunden wechselbare Klick-Düse" },
  "Buse démontable rapidement en 3 secondes": { EN: "Quick-swap nozzle in 3 seconds", DE: "Schnell abnehmbare Düse in 3 Sekunden" },
  "Changement de buse instantané sans outil": { EN: "Instant tool-free nozzle change", DE: "Sofortiger werkzeugloser Düsenwechsel" },
  "Caméra HD et arrêt automatique intégrés": { EN: "Built-in HD camera and auto shut-off", DE: "Integrierte HD-Kamera und automatische Abschaltung" },
  "Caméra HD et arrêt automatique intégrés de série": { EN: "Built-in HD camera and auto shut-off included", DE: "Integrierte HD-Kamera und automatische Abschaltung serienmäßig" },
  "Vitesse déplacement 600 mm/s sous les 280 €": { EN: "600 mm/s travel speed under €280", DE: "600 mm/s Verfahrgeschwindigkeit unter 280 €" },
  "CoreXY 600 mm/s ultra véloce à moins de 300 €": { EN: "Ultra-fast 600 mm/s CoreXY under €300", DE: "Ultraschneller 600 mm/s CoreXY unter 300 €" },
  "Auto-nivellement sans feuille en un clic": { EN: "One-click hands-free auto-leveling without paper", DE: "Ein-Klick-Autonivellierung ohne Papier" },
  "Nivellement automatique mains libres en un clic": { EN: "One-click hands-free auto-leveling", DE: "Vollautomatisches Ein-Klick-Freihand-Nivellieren" },
  "Écran 4.3\" tactile réactif": { EN: "Responsive 4.3\" touchscreen", DE: "Reaktionsschneller 4.3\" Touchscreen" },
  "Écran tactile 4.3 pouces réactif": { EN: "Responsive 4.3-inch touchscreen", DE: "Reaktionsschneller 4.3-Zoll-Touchscreen" },
  "Buse poussée à 300 °C compatible TPU techniques et filaments carbone": { EN: "300 °C nozzle compatible with technical TPU and carbon filaments", DE: "300 °C Düse kompatibel mit technischem TPU und Carbon-Filamenten" },
  "Gestion multi-appareils native pour fermes d’impression": { EN: "Native multi-device management for print farms", DE: "Natives Multi-Geräte-Management für Druckfarmen" },
  "Gestion multi-machines native pour fermes d’impression 3D": { EN: "Native multi-printer management for 3D print farms", DE: "Natives Multi-Drucker-Management für 3D-Druckfarmen" },
  "Vitesse 600 mm/s et accélération 20 000 mm/s²": { EN: "600 mm/s speed and 20,000 mm/s² acceleration", DE: "600 mm/s Geschwindigkeit und 20.000 mm/s² Beschleunigung" },
  "4 têtes d’outils indépendantes pour imprimer en multi-matériaux sans tour de purge ni gaspillage": { EN: "4 independent toolheads for multi-material printing without purge towers or waste", DE: "4 unabhängige Werkzeugköpfe für Multimaterial-Druck ohne Spülturm oder Abfall" },
  "4 têtes d’impression indépendantes sans perte de matière ni tour de purge": { EN: "4 independent print heads with zero material waste or purge tower", DE: "4 unabhängige Druckköpfe ohne Materialverlust oder Spülturm" },
  "4 têtes d’impression indépendantes sous caisson clos sans aucun déchet de purge": { EN: "4 independent print heads in enclosed chamber with zero purge waste", DE: "4 unabhängige Druckköpfe im geschlossenen Bauraum ohne Spülabfall" },
  "Accélération phénoménale de 30 000 mm/s² et débit de 32 mm³/s": { EN: "Phenomenal 30,000 mm/s² acceleration and 32 mm³/s flow rate", DE: "Phänomenale Beschleunigung von 30.000 mm/s² und 32 mm³/s Durchfluss" },
  "Accélération phénoménale de 30 000 mm/s² et débit 32 mm³/s": { EN: "Phenomenal 30,000 mm/s² acceleration and 32 mm³/s flow rate", DE: "Phänomenale Beschleunigung von 30.000 mm/s² und 32 mm³/s Durchfluss" },
  "Accélération folle de 30 000 mm/s² et buse 320 °C": { EN: "Extreme 30,000 mm/s² acceleration and 320 °C nozzle", DE: "Extreme Beschleunigung von 30.000 mm/s² und 320 °C Düse" },
  "Buse haute température 320 °C et plateau 120 °C": { EN: "320 °C high-temp nozzle and 120 °C heated bed", DE: "320 °C Hochtemperatur-Düse und 120 °C Heizbett" },
  "Caméra Full HD et gestion multi-machines intégrées": { EN: "Integrated Full HD camera and multi-printer farm management", DE: "Integrierte Full-HD-Kamera und Multi-Geräte-Farm-Management" },
  "Caméra Full HD intégrée et Wi-Fi double bande 2.4/5 GHz": { EN: "Integrated Full HD camera and dual-band 2.4/5 GHz Wi-Fi", DE: "Integrierte Full-HD-Kamera und Dualband-WLAN 2.4/5 GHz" },
  "Chambre activement chauffée jusqu’à 65 °C pour plastiques industriels (PC, Nylon, PPS-CF)": { EN: "Actively heated chamber up to 65 °C for engineering plastics (PC, Nylon, PPS-CF)", DE: "Aktiv beheizter Bauraum bis 65 °C für Industriepolymere (PC, Nylon, PPS-CF)" },
  "Double filtration HEPA 13 + charbon actif et refroidissement auxiliaire": { EN: "Dual HEPA 13 + activated carbon filtration and auxiliary cooling", DE: "Doppelte HEPA 13- und Aktivkohle-Filterung sowie Zusatzkühlung" },
  "Capteur de porte sécurisée et accélération 30 000 mm/s²": { EN: "Safety door sensor and 30,000 mm/s² acceleration", DE: "Türsicherheitssensor und 30.000 mm/s² Beschleunigung" },
  "Double extrudeur pour supports solubles et bi-matières": { EN: "Dual extruder for soluble supports and dual-materials", DE: "Doppelextruder für lösliche Stützen und Zwei-Material-Druck" },
  "Volume vertical immense de 600 mm": { EN: "Immense 600 mm vertical build volume", DE: "Riesiges vertikales Bauvolumen von 600 mm" },

  // Flashforge Cons
  "Volume compact de 220×220×220 mm": { EN: "Compact build volume of 220×220×220 mm", DE: "Kompaktes Bauvolumen von 220×220×220 mm" },
  "Impression monocouleur": { EN: "Single-color printing only", DE: "Nur einfarbiger Druck" },
  "Structure ouverte (ABS/ASA déconseillés sans caisson)": { EN: "Open frame (ABS/ASA not recommended without enclosure)", DE: "Offene Struktur (ABS/ASA ohne Gehäuse nicht empfohlen)" },
  "Structure ouverte (non recommandée pour ABS/ASA sans caisson)": { EN: "Open frame (not recommended for ABS/ASA without enclosure)", DE: "Offenes Gehäuse (nicht empfohlen für ABS/ASA ohne Kammer)" },
  "Pas de caméra intégrée de série": { EN: "No built-in camera included as standard", DE: "Keine serienmäßige Kamera integriert" },
  "Pas de caméra de série (en option)": { EN: "No standard camera (optional accessory)", DE: "Keine Standard-Kamera (optional erhältlich)" },
  "Structure ouverte d’origine": { EN: "Open frame by default", DE: "Standardmäßig offener Rahmen" },
  "Caméra et éclairage en options extensibles": { EN: "Camera and lighting available as optional add-ons", DE: "Kamera und Beleuchtung als optionale Erweiterungen" },
  "Caméra et éclairage de chambre en options extensibles": { EN: "Camera and chamber lighting available as optional add-ons", DE: "Kamera und Bauraumbeleuchtung als optionale Erweiterungen" },
  "Conception à cadre ouvert (nécessite un kit caisson pour ABS/PA-CF)": { EN: "Open frame design (requires enclosure kit for ABS/PA-CF)", DE: "Offenes Rahmendesign (erfordert Gehäuse-Kit für ABS/PA-CF)" },
  "Largeur importante avec les 4 dévidoirs de filaments": { EN: "Significant width with 4 filament spool holders mounted", DE: "Große Breite mit 4 montierten Spulenhaltern" },
  "Largeur importante avec les dévidoirs de filaments": { EN: "Large width with external filament spools", DE: "Erhebliche Gesamtbreite mit Spulenhaltern" },
  "Poids important de 18 kg": { EN: "Heavy weight of 18 kg", DE: "Hohes Gewicht von 18 kg" },
  "Consommation électrique de 850W": { EN: "850W peak power consumption", DE: "850W Spitzenstromverbrauch" },

  // Flashforge Sensors & Features
  "Surveillance par caméra": { EN: "Camera surveillance & live view", DE: "Kameraüberwachung & Live-Ansicht" },
  "Alerte de fin de filament": { EN: "Filament runout alert", DE: "Filament-Ende-Warnung" },
  "Arrêt automatique": { EN: "Auto power-off", DE: "Automatische Abschaltung" },
  "Reprise après coupure de courant": { EN: "Power loss recovery", DE: "Wiederaufnahme nach Stromausfall" },
  "Mode faible bruit 50 dB": { EN: "50 dB low-noise mode", DE: "50 dB Flüstermodus" },
  "Compensation des vibrations": { EN: "Vibration compensation", DE: "Vibrationskompensation" },
  "Récupération après coupure de courant": { EN: "Power loss recovery", DE: "Wiederaufnahme nach Stromausfall" },
  "Auto-nivellement en 1 clic sans feuille": { EN: "1-click paper-free auto-leveling", DE: "1-Klick-Autonivellierung ohne Papier" },
  "Rétablissement du courant": { EN: "Power loss recovery", DE: "Stromausfall-Wiederherstellung" },
  "Mise à niveau automatique": { EN: "Automatic bed leveling", DE: "Automatische Bettnivellierung" },
  "Mise à niveau automatique complète": { EN: "Fully automatic bed leveling", DE: "Vollautomatische Bettnivellierung" },
  "Gestion multi-appareils (Ferme)": { EN: "Multi-device farm management", DE: "Multi-Geräte-Farmverwaltung" },
  "Éclairage et caméra extensibles": { EN: "Expandable chamber lighting & camera", DE: "Erweiterbare Bauraumbeleuchtung & Kamera" },
  "4 têtes d’outils indépendantes avec détection fin de filament": { EN: "4 independent toolheads with individual filament detection", DE: "4 unabhängige Werkzeugköpfe mit Filamentendsensoren" },
  "4 têtes d’outils indépendantes avec capteurs de filament": { EN: "4 independent toolheads with filament sensors", DE: "4 unabhängige Werkzeugköpfe mit Filamentsensoren" },
  "Étalonnage dynamique du débit (Calibrage automatique PA)": { EN: "Dynamic flow calibration (automatic PA pressure calibration)", DE: "Dynamische Durchflusskalibrierung (automatische PA-Kalibrierung)" },
  "Étalonnage dynamique du débit (Calibrage PA)": { EN: "Dynamic flow calibration (PA calibration)", DE: "Dynamische Durchflusskalibrierung (PA-Kalibrierung)" },
  "Éclairage de chambre": { EN: "Chamber LED illumination", DE: "Bauraum-LED-Beleuchtung" },
  "Gestion de plusieurs imprimantes": { EN: "Multi-printer fleet management", DE: "Multi-Drucker-Flottenmanagement" },
  "Allumage/extinction en une seule touche": { EN: "One-touch power on/off", DE: "Ein-Tasten-Ein-/Ausschalten" },
  "Allumage en une seule touche": { EN: "One-touch power on", DE: "Ein-Tasten-Einschalten" },
  "Chambre activement chauffée à 65 °C": { EN: "Actively heated chamber at 65 °C", DE: "Aktiv beheizter Bauraum bei 65 °C" },
  "Filtre HEPA 13 + charbon actif": { EN: "HEPA 13 + activated carbon filter", DE: "HEPA 13 + Aktivkohlefilter" },
  "Détection de porte (porte avant et couvercle supérieur)": { EN: "Door safety sensor (front door & top lid)", DE: "Türsensor (Fronttür & oberer Deckel)" },
  "Ventilateur de refroidissement auxiliaire": { EN: "Auxiliary part cooling fan", DE: "Zusatzbauteillüfter" },

  // Flashforge newTech
  "Double filtration HEPA + charbon actif interne/externe, Mode silencieux 50 dB, Buse démontage rapide en 3 secondes, Vitesse 600 mm/s, Arrêt automatique": {
    EN: "Dual internal/external HEPA + carbon filtration, 50 dB quiet mode, 3-second quick-swap nozzle, 600 mm/s speed, auto power-off",
    DE: "Doppelte interne/externe HEPA- + Aktivkohle-Filterung, 50 dB Flüstermodus, 3-Sekunden-Schnellwechseldüse, 600 mm/s, automatische Abschaltung"
  },
  "CoreXY 600 mm/s ultra accessible, Auto-nivellement complet en 1 clic, Buse interchangeable en 3 secondes": {
    EN: "Ultra-accessible 600 mm/s CoreXY, 1-click hands-free auto-leveling, 3-second quick-swap nozzle",
    DE: "Sehr erschwinglicher 600 mm/s CoreXY, 1-Klick-Autonivellierung, in 3 Sekunden wechselbare Düse"
  },
  "Buse haute température 300 °C, Vitesse déplacement 600 mm/s (impression 300 mm/s), Gestion multi-appareils pour fermes d’impression": {
    EN: "300 °C high-temp nozzle, 600 mm/s travel speed (300 mm/s print), multi-device management for print farms",
    DE: "300 °C Hochtemperatur-Düse, 600 mm/s Verfahrgeschwindigkeit (300 mm/s Druck), Multi-Geräte-Management für Farmen"
  },
  "4 têtes d’outils indépendantes sans aucune perte de filament, Calibrage automatique PA, Accélération extrême 30 000 mm/s², Buse 320 °C, Wi-Fi 2.4/5 GHz": {
    EN: "4 independent toolheads with zero purge waste, automatic PA pressure calibration, extreme 30,000 mm/s² acceleration, 320 °C nozzle, 2.4/5 GHz dual Wi-Fi",
    DE: "4 unabhängige Werkzeugköpfe ohne Filamentverschwendung, automatische PA-Kalibrierung, extreme 30.000 mm/s² Beschleunigung, 320 °C Düse, 2.4/5 GHz Dualband-WLAN"
  },
  "4 têtes d’outils indépendantes en caisson fermé, Chambre activement chauffée à 65 °C, Filtre HEPA 13 + charbon actif, Détection de porte, Buse 320 °C, Accélération 30 000 mm/s²": {
    EN: "4 independent toolheads in enclosed chamber, actively heated chamber up to 65 °C, HEPA 13 + carbon filter, door sensor, 320 °C nozzle, 30,000 mm/s² acceleration",
    DE: "4 unabhängige Werkzeugköpfe im geschlossenen Gehäuse, aktiv beheizter Bauraum bis 65 °C, HEPA 13 + Aktivkohlefilter, Türsensor, 320 °C Düse, 30.000 mm/s² Beschleunigung"
  }
};

/**
 * Translates a pro/con or spec sentence into the requested language (FR, EN, DE).
 */
export function translateProCon(text: string, lang: Language): string {
  if (!text || lang === 'FR') return text;
  
  const clean = text.trim();
  if (dictionary[clean] && dictionary[clean][lang]) {
    return dictionary[clean][lang];
  }

  // Fallback pattern translations
  if (lang === 'EN') {
    return clean
      .replace(/Très silencieuse/gi, 'Very quiet')
      .replace(/Structure ouverte/gi, 'Open frame structure')
      .replace(/Châssis ouvert/gi, 'Open chassis')
      .replace(/Boîtier fermé/gi, 'Enclosed chamber')
      .replace(/Boîtier FERMÉ/gi, 'ENCLOSED chamber')
      .replace(/Vitesse impressionnante/gi, 'Impressive speed')
      .replace(/Vitesse ultra rapide/gi, 'Ultra-fast speed')
      .replace(/Grand volume/gi, 'Large build volume')
      .replace(/Très grand volume/gi, 'Very large build volume')
      .replace(/Volume géant/gi, 'Giant build volume')
      .replace(/Rapport qualité\/prix imbattable/gi, 'Unbeatable value for money')
      .replace(/Modèle discontinué/gi, 'Discontinued model')
      .replace(/Prix réduit/gi, 'Reduced price')
      .replace(/Buse acier trempé/gi, 'Hardened steel nozzle')
      .replace(/Plateau chauffant/gi, 'Heated bed')
      .replace(/Double buse/gi, 'Dual nozzle')
      .replace(/Chambre chauffée activement/gi, 'Actively heated chamber')
      .replace(/Monocouleur/gi, 'Single-color only')
      .replace(/sans purge/gi, 'waste-free');
  }

  if (lang === 'DE') {
    return clean
      .replace(/Très silencieuse/gi, 'Sehr leise')
      .replace(/Structure ouverte/gi, 'Offene Struktur')
      .replace(/Châssis ouvert/gi, 'Offenes Gehäuse')
      .replace(/Boîtier fermé/gi, 'Geschlossener Bauraum')
      .replace(/Boîtier FERMÉ/gi, 'GESCHLOSSENER Bauraum')
      .replace(/Vitesse impressionnante/gi, 'Beeindruckende Geschwindigkeit')
      .replace(/Grand volume/gi, 'Großes Bauvolumen')
      .replace(/Très grand volume/gi, 'Sehr großes Bauvolumen')
      .replace(/Volume géant/gi, 'Riesiges Bauvolumen')
      .replace(/Rapport qualité\/prix imbattable/gi, 'Unschlagbares Preis-Leistungs-Verhältnis')
      .replace(/Modèle discontinué/gi, 'Eingestelltes Modell')
      .replace(/Prix réduit/gi, 'Reduzierter Preis')
      .replace(/Buse acier trempé/gi, 'Gehärtete Stahldüse')
      .replace(/Plateau chauffant/gi, 'Heizbett')
      .replace(/Double buse/gi, 'Doppeldüse')
      .replace(/Chambre chauffée activement/gi, 'Aktiv beheizter Bauraum')
      .replace(/Monocouleur/gi, 'Nur einfarbig')
      .replace(/sans purge/gi, 'ohne Spülmüll');
  }

  return text;
}

/**
 * Translates general technical values in the modal table (Structure, Enclosure, etc.)
 */
export function translateSpecValue(field: string, value: any, lang: Language): string {
  if (value === undefined || value === null) return '-';
  const str = String(value);
  if (lang === 'FR') return str;

  if (field === 'structure') {
    if (lang === 'EN') {
      return str.replace('Cartésienne XYZ', 'Cartesian XYZ');
    }
    if (lang === 'DE') {
      return str.replace('Cartésienne XYZ', 'Kartesisch XYZ');
    }
  }

  if (field === 'enclosed') {
    const isEnclosed = typeof value === 'boolean' ? value : str.toLowerCase().includes('fermé') || str.toLowerCase().includes('enclosed');
    if (lang === 'EN') {
      return isEnclosed 
        ? 'Enclosed Chamber (Fully sealed, ideal for technical filaments)' 
        : 'Open Frame (Open chassis structure)';
    }
    if (lang === 'DE') {
      return isEnclosed 
        ? 'Geschlossener Bauraum (Vollständig versiegelt, ideal für technische Filamente)' 
        : 'Offener Rahmen (Offenes Chassis)';
    }
  }

  if (field === 'status') {
    const isDiscontinued = typeof value === 'boolean' ? value : str.toLowerCase().includes('ancien') || str.toLowerCase().includes('discontinued');
    if (lang === 'EN') {
      return isDiscontinued ? 'Discontinued Model / Legacy Catalog' : 'Currently Available (Active Catalog)';
    }
    if (lang === 'DE') {
      return isDiscontinued ? 'Auslaufmodell / Historischer Katalog' : 'Aktuell erhältlich (Aktiver Katalog)';
    }
  }

  return str;
}

/**
 * Translates brand-specific Bed Leveling technology
 */
export function translateBedLeveling(brand: string, lang: Language): string {
  if (lang === 'FR') {
    if (brand === 'Flashforge') return 'Nivellement entièrement automatique sans feuille (Capteurs de pression/jauge & compensation Z automatique)';
    if (brand === 'Anycubic') return 'LeviQ 3.0 / LeviQ 2.0 automatique multipoint (Compensation Z automatique & calibrage inductif/piezo sans réglage manuel)';
    if (brand === 'Bambu Lab') return 'Automatique multipoint complet (Capteurs piezo / jauge de contrainte & offset Z auto sans feuille)';
    if (brand === 'Creality') return 'Nivellement entièrement automatique mains libres (CR-Touch / Jauge Strain Gauge / 64 points auto selon modèle)';
    if (brand === 'Elegoo') return 'Auto-nivellement 121 points multipoint (ou capteur sans contact haute densité selon modèle)';
    return 'Automatique multipoint complet avec compensation Z et nivellement haute précision';
  }

  if (lang === 'EN') {
    if (brand === 'Flashforge') return 'Hands-free fully automatic leveling (Pressure sensors / strain gauge & auto Z-offset without paper)';
    if (brand === 'Anycubic') return 'LeviQ 3.0 / LeviQ 2.0 automatic multi-point (Auto Z-offset compensation & inductive/piezo calibration without manual leveling)';
    if (brand === 'Bambu Lab') return 'Fully automatic multi-point (Piezo sensors / strain gauge & auto Z-offset without paper leveling)';
    if (brand === 'Creality') return 'Hands-free fully automatic leveling (CR-Touch / Strain Gauge / 64-point auto depending on model)';
    if (brand === 'Elegoo') return '121-point multi-point auto-leveling (or high-density contactless sensor depending on model)';
    return 'Full automatic multi-point with Z-compensation and high precision leveling';
  }

  if (lang === 'DE') {
    if (brand === 'Flashforge') return 'Vollautomatisches Freihand-Nivellieren (Drucksensoren / Dehnungsmessstreifen & automatischer Z-Offset)';
    if (brand === 'Anycubic') return 'LeviQ 3.0 / LeviQ 2.0 automatische Mehrpunkt-Nivellierung (Automatischer Z-Offset & induktive/Piezo-Kalibrierung ohne Papier)';
    if (brand === 'Bambu Lab') return 'Vollautomatische Mehrpunkt-Nivellierung (Piezosensoren / Dehnungsmessstreifen & automatischer Z-Offset ohne Papier)';
    if (brand === 'Creality') return 'Vollautomatisches Freihand-Nivellieren (CR-Touch / Dehnungsmessstreifen / 64-Punkte-Automatik je nach Modell)';
    if (brand === 'Elegoo') return '121-Punkte-Mehrpunkt-Autonivellierung (oder berührungsloser High-Density-Sensor je nach Modell)';
    return 'Vollautomatische Mehrpunkt-Nivellierung mit Z-Kompensation und hoher Präzision';
  }

  return '';
}

/**
 * Translates brand-specific Print Surface description
 */
export function translatePrintSurface(brand: string, lang: Language): string {
  if (lang === 'FR') {
    if (brand === 'Flashforge') return 'Plaque flexible en acier ressort magnétique amovible avec revêtement PEI texturé';
    if (brand === 'Anycubic') return 'Plateau magnétique flexible en acier ressort à revêtement PEI texturé haute adhérence (Compatible PEI haute température)';
    if (brand === 'Bambu Lab') return 'Plateau flexible magnétique en acier ressort à revêtement PEI texturé (Compatible PEI lisse, Haute Température, SuperTack)';
    if (brand === 'Creality') return 'Plaque de construction flexible en acier ressort à revêtement PEI ou époxy haute adhérence';
    if (brand === 'Elegoo') return 'Feuille d’acier à ressort double face (PEI texturé + surface spécifique PLA) ou PEI haute température';
    return 'Plateau flexible magnétique en acier ressort avec revêtement PEI texturé';
  }

  if (lang === 'EN') {
    if (brand === 'Flashforge') return 'Removable flexible magnetic spring steel sheet with textured PEI coating';
    if (brand === 'Anycubic') return 'Flexible spring steel magnetic build plate with high-adhesion textured PEI coating (High-temp PEI compatible)';
    if (brand === 'Bambu Lab') return 'Flexible spring steel magnetic build plate with textured PEI coating (Compatible with Smooth PEI, High Temp, SuperTack)';
    if (brand === 'Creality') return 'Flexible spring steel build plate with textured PEI or high-adhesion epoxy coating';
    if (brand === 'Elegoo') return 'Double-sided spring steel sheet (Textured PEI + smooth PLA surface) or high-temp PEI';
    return 'Flexible spring steel magnetic build plate with textured PEI coating';
  }

  if (lang === 'DE') {
    if (brand === 'Flashforge') return 'Abnehmbares flexibles magnetisches Federstahlblech mit strukturierter PEI-Beschichtung';
    if (brand === 'Anycubic') return 'Flexibles Federstahl-Magnetdruckbett mit hochhaftender strukturierter PEI-Beschichtung (Hochtemperatur-PEI kompatibel)';
    if (brand === 'Bambu Lab') return 'Flexibles Federstahl-Magnetdruckbett mit strukturierter PEI-Beschichtung (Kompatibel mit glattem PEI, Hochtemperatur, SuperTack)';
    if (brand === 'Creality') return 'Flexible Federstahl-Bauplatte mit strukturierter PEI- oder hochhaftender Epoxidbeschichtung';
    if (brand === 'Elegoo') return 'Doppelseitiges Federstahlblech (strukturiertes PEI + glatte PLA-Oberfläche) oder Hochtemperatur-PEI';
    return 'Flexibles Federstahl-Magnetdruckbett mit strukturierter PEI-Beschichtung';
  }

  return '';
}

/**
 * Translates brand-specific Network Connectivity
 */
export function translateConnectivity(brand: string, lang: Language): string {
  if (lang === 'FR') {
    if (brand === 'Flashforge') return 'Wi-Fi (2.4 GHz / 5 GHz double bande selon modèle), Port Ethernet RJ45, Port USB, FlashCloud';
    if (brand === 'Anycubic') return 'Wi-Fi (2.4 GHz / 5 GHz double bande selon modèle), Port USB, Anycubic Cloud & App Mobile Anycubic';
    if (brand === 'Bambu Lab') return 'Wi-Fi (2.4 GHz / 5 GHz double bande selon modèle), Bambu-Bus, App Mobile & Bambu Studio Cloud/LAN';
    if (brand === 'Creality') return 'Wi-Fi, Port RJ45 / USB, Creality Cloud & Application Mobile Creality';
    if (brand === 'Elegoo') return 'Wi-Fi, Port Ethernet RJ45, Port USB & Interface Web Klipper';
    return 'Wi-Fi, Port USB, Application Mobile dédiée & Cloud constructeur';
  }

  if (lang === 'EN') {
    if (brand === 'Flashforge') return 'Wi-Fi (2.4 GHz / 5 GHz dual-band depending on model), RJ45 Ethernet Port, USB Port, FlashCloud';
    if (brand === 'Anycubic') return 'Wi-Fi (2.4 GHz / 5 GHz dual-band depending on model), USB Port, Anycubic Cloud & Anycubic Mobile App';
    if (brand === 'Bambu Lab') return 'Wi-Fi (2.4 GHz / 5 GHz dual-band depending on model), Bambu-Bus, Mobile App & Bambu Studio Cloud/LAN';
    if (brand === 'Creality') return 'Wi-Fi, RJ45 Ethernet / USB Port, Creality Cloud & Creality Mobile App';
    if (brand === 'Elegoo') return 'Wi-Fi, RJ45 Ethernet Port, USB Port & Klipper Web Interface';
    return 'Wi-Fi, USB Port, Dedicated Mobile App & Manufacturer Cloud';
  }

  if (lang === 'DE') {
    if (brand === 'Flashforge') return 'WLAN (2.4 GHz / 5 GHz Dualband je nach Modell), RJ45-Ethernet-Port, USB-Port, FlashCloud';
    if (brand === 'Anycubic') return 'WLAN (2.4 GHz / 5 GHz Dualband je nach Modell), USB-Port, Anycubic Cloud & Anycubic Mobile App';
    if (brand === 'Bambu Lab') return 'WLAN (2.4 GHz / 5 GHz Dualband je nach Modell), Bambu-Bus, Mobile App & Bambu Studio Cloud/LAN';
    if (brand === 'Creality') return 'WLAN, RJ45 Ethernet / USB-Port, Creality Cloud & Creality Mobile App';
    if (brand === 'Elegoo') return 'WLAN, RJ45-Ethernet-Port, USB-Port & Klipper Web-Interface';
    return 'WLAN, USB-Port, eigene Mobile App & Hersteller-Cloud';
  }

  return '';
}

/**
 * Translates Slicer compatibility
 */
export function translateSlicers(brand: string, lang: Language): string {
  if (lang === 'FR') {
    if (brand === 'Flashforge') return 'FlashPrint 5, Orca-Flashforge, OrcaSlicer';
    if (brand === 'Anycubic') return 'Anycubic Slicer / Anycubic Slicer Next, OrcaSlicer, PrusaSlicer, Cura (G-code standard)';
    if (brand === 'Bambu Lab') return 'Bambu Studio, OrcaSlicer, PrusaSlicer, SuperSlicer, Cura (G-code standard)';
    if (brand === 'Creality') return 'Creality Print, OrcaSlicer, PrusaSlicer, Cura';
    if (brand === 'Elegoo') return 'Elegoo Slicer, OrcaSlicer, Cura';
    return 'OrcaSlicer, PrusaSlicer, Cura, Slicer officiel constructeur';
  }

  if (lang === 'EN') {
    if (brand === 'Flashforge') return 'FlashPrint 5, Orca-Flashforge, OrcaSlicer';
    if (brand === 'Anycubic') return 'Anycubic Slicer / Anycubic Slicer Next, OrcaSlicer, PrusaSlicer, Cura (Standard G-code)';
    if (brand === 'Bambu Lab') return 'Bambu Studio, OrcaSlicer, PrusaSlicer, SuperSlicer, Cura (Standard G-code)';
    if (brand === 'Creality') return 'Creality Print, OrcaSlicer, PrusaSlicer, Cura';
    if (brand === 'Elegoo') return 'Elegoo Slicer, OrcaSlicer, Cura';
    return 'OrcaSlicer, PrusaSlicer, Cura, official manufacturer slicer';
  }

  if (lang === 'DE') {
    if (brand === 'Flashforge') return 'FlashPrint 5, Orca-Flashforge, OrcaSlicer';
    if (brand === 'Anycubic') return 'Anycubic Slicer / Anycubic Slicer Next, OrcaSlicer, PrusaSlicer, Cura (Standard-G-Code)';
    if (brand === 'Bambu Lab') return 'Bambu Studio, OrcaSlicer, PrusaSlicer, SuperSlicer, Cura (Standard-G-Code)';
    if (brand === 'Creality') return 'Creality Print, OrcaSlicer, PrusaSlicer, Cura';
    if (brand === 'Elegoo') return 'Elegoo Slicer, OrcaSlicer, Cura';
    return 'OrcaSlicer, PrusaSlicer, Cura, offizieller Hersteller-Slicer';
  }

  return '';
}

/**
 * Translates Chamber Thermal Management
 */
export function translateChamberHeating(value: string | undefined, enclosed: boolean, lang: Language): string {
  if (value) {
    if (lang === 'FR') return value;
    if (lang === 'EN') {
      return value
        .replace(/Chauffage actif de la chambre supporté/gi, 'Actively heated chamber supported')
        .replace(/Chauffage actif de la chambre/gi, 'Actively heated chamber')
        .replace(/Chambre chauffée activement/gi, 'Actively heated chamber')
        .replace(/Chambre activement chauffée/gi, 'Actively heated chamber')
        .replace(/Chauffage passif régulé avec double circulation/gi, 'Passive regulated heating with dual circulation')
        .replace(/Chauffage passif régulé/gi, 'Passive regulated heating')
        .replace(/Régulée/gi, 'Regulated')
        .replace(/Passif/gi, 'Passive');
    }
    if (lang === 'DE') {
      return value
        .replace(/Chauffage actif de la chambre supporté/gi, 'Aktiv beheizter Bauraum unterstützt')
        .replace(/Chauffage actif de la chambre/gi, 'Aktiv beheizter Bauraum')
        .replace(/Chambre chauffée activement/gi, 'Aktiv beheizter Bauraum')
        .replace(/Chambre activement chauffée/gi, 'Aktiv beheizter Bauraum')
        .replace(/Chauffage passif régulé avec double circulation/gi, 'Passive geregelte Beheizung mit doppelter Zirkulation')
        .replace(/Chauffage passif régulé/gi, 'Passive geregelte Beheizung')
        .replace(/Régulée/gi, 'Geregelt')
        .replace(/Passif/gi, 'Passiv');
    }
  }

  if (enclosed) {
    if (lang === 'FR') return 'Chauffage passif régulé par le plateau chauffant';
    if (lang === 'EN') return 'Passive heating regulated by the heated bed';
    if (lang === 'DE') return 'Passive Beheizung über das beheizte Druckbett geregelt';
  }

  if (lang === 'FR') return 'Pas de caisson chauffé (Machine ouverte)';
  if (lang === 'EN') return 'No heated chamber (Open frame machine)';
  if (lang === 'DE') return 'Kein beheizter Bauraum (Offene Maschine)';
  return '';
}

/**
 * Translates Air Filtration systems
 */
export function translateFiltration(filtration: string | undefined, lang: Language): string {
  if (!filtration) return '-';
  if (lang === 'FR') return filtration;

  if (lang === 'EN') {
    return filtration
      .replace(/Circulation interne \+ circulation externe \(HEPA \+ charbon actif\)/gi, 'Internal + external air circulation (HEPA + activated carbon)')
      .replace(/Circulation interne \+ externe \(Filtre HEPA \+ Charbon actif\)/gi, 'Internal + external circulation (HEPA filter + activated carbon)')
      .replace(/Filtre HEPA13 \+ charbon actif haute efficacité/gi, 'HEPA 13 + high-efficiency activated carbon filter')
      .replace(/Filtre HEPA13 \+ charbon actif/gi, 'HEPA 13 + activated carbon filter')
      .replace(/Double filtration HEPA H12 \+ Charbon actif haute capacité/gi, 'Dual HEPA H12 + high-capacity activated carbon filtration')
      .replace(/Purificateur d’air intégré avec filtre à charbon actif/gi, 'Built-in air purifier with activated carbon filter')
      .replace(/Purificateur d’air intégré \(Air Purifier charbon actif\)/gi, 'Built-in air purifier (Activated carbon filter)')
      .replace(/Filtre à charbon actif haute densité \+ filtre anti-particules VOC/gi, 'High-density activated carbon + anti-VOC particle filter')
      .replace(/Purificateur d’air à cristaux nano-minéraux \(Nano Mineral Crystal\)/gi, 'Air purifier with nano mineral crystals')
      .replace(/Purificateur d’air HEPA \+ Charbon actif de coquille de noix de coco/gi, 'HEPA + coconut shell activated carbon air purifier')
      .replace(/Système de filtration d’air à double filtre HEPA \+ charbon actif/gi, 'Air filtration system with dual HEPA + activated carbon filters');
  }

  if (lang === 'DE') {
    return filtration
      .replace(/Circulation interne \+ circulation externe \(HEPA \+ charbon actif\)/gi, 'Interne + externe Umluft (HEPA + Aktivkohle)')
      .replace(/Circulation interne \+ externe \(Filtre HEPA \+ Charbon actif\)/gi, 'Interne + externe Umluft (HEPA-Filter + Aktivkohle)')
      .replace(/Filtre HEPA13 \+ charbon actif haute efficacité/gi, 'HEPA 13- + hocheffizienter Aktivkohlefilter')
      .replace(/Filtre HEPA13 \+ charbon actif/gi, 'HEPA 13- + Aktivkohlefilter')
      .replace(/Double filtration HEPA H12 \+ Charbon actif haute capacité/gi, 'Doppelte HEPA H12- + Hochleistungs-Aktivkohlefilterung')
      .replace(/Purificateur d’air intégré avec filtre à charbon actif/gi, 'Integrierter Luftreiniger mit Aktivkohlefilter')
      .replace(/Purificateur d’air intégré \(Air Purifier charbon actif\)/gi, 'Integrierter Luftreiniger (Aktivkohle)')
      .replace(/Filtre à charbon actif haute densité \+ filtre anti-particules VOC/gi, 'Hochdichter Aktivkohlefilter + Anti-VOC-Partikelfilter')
      .replace(/Purificateur d’air à cristaux nano-minéraux \(Nano Mineral Crystal\)/gi, 'Luftreiniger mit Nano-Mineralkristallen')
      .replace(/Purificateur d’air HEPA \+ Charbon actif de coquille de noix de coco/gi, 'HEPA + Kokosnussschalen-Aktivkohle-Luftreiniger')
      .replace(/Système de filtration d’air à double filtre HEPA \+ charbon actif/gi, 'Luftfiltersystem mit dualem HEPA- + Aktivkohlefilter');
  }

  return filtration;
}

/**
 * Translates sensors & safety systems
 */
export function translateSensors(sensors: string[] | undefined, lang: Language): string {
  if (!sensors || sensors.length === 0) {
    if (lang === 'FR') return 'Capteur fin de filament, Reprise après coupure, Capteur de vibrations';
    if (lang === 'EN') return 'Filament runout sensor, Power loss recovery, Vibration compensation sensor';
    if (lang === 'DE') return 'Filament-Endsensor, Wiederaufnahme nach Stromausfall, Vibrationssensor';
  }

  return (sensors || []).map(s => translateProCon(s, lang)).join(' • ');
}

/**
 * Translates camera & monitoring
 */
export function translateCamera(camera: string | undefined, enclosed: boolean, price: number, lang: Language): string {
  if (camera) {
    if (lang === 'FR') return camera;
    if (lang === 'EN') return camera.replace(/intégrée/gi, 'integrated').replace(/Optionnelle/gi, 'Optional');
    if (lang === 'DE') return camera.replace(/intégrée/gi, 'integriert').replace(/Optionnelle/gi, 'Optional');
  }

  if (enclosed || price > 400) {
    if (lang === 'FR') return 'Caméra HD intégrée (Détection spaghettis IA, surveillance, Time-lapse)';
    if (lang === 'EN') return 'Built-in HD Camera (AI spaghetti detection, live monitoring, Time-lapse)';
    if (lang === 'DE') return 'Integrierte HD-Kamera (KI-Spaghetti-Erkennung, Live-Überwachung, Zeitraffer)';
  }

  if (lang === 'FR') return 'Optionnelle';
  if (lang === 'EN') return 'Optional';
  if (lang === 'DE') return 'Optional';
  return '';
}

/**
 * Translates new tech & innovations highlights
 */
export function translateNewTech(text: string, lang: Language): string {
  if (!text || lang === 'FR') return text;
  return translateProCon(text, lang);
}

/**
 * Translates screen description
 */
export function translateScreen(screen: string | undefined, lang: Language): string {
  if (!screen) {
    if (lang === 'FR') return 'Écran tactile couleur HD';
    if (lang === 'EN') return 'Color HD Touchscreen';
    if (lang === 'DE') return 'Farb-HD-Touchscreen';
    return 'Écran tactile couleur HD';
  }
  if (lang === 'FR') return screen;
  if (lang === 'EN') {
    return screen
      .replace(/tactile couleur/gi, 'color touchscreen')
      .replace(/tactile/gi, 'touchscreen')
      .replace(/pouces/gi, 'inches')
      .replace(/Écran/gi, 'Screen')
      .replace(/écran/gi, 'screen');
  }
  if (lang === 'DE') {
    return screen
      .replace(/tactile couleur/gi, 'Farb-Touchscreen')
      .replace(/tactile/gi, 'Touchscreen')
      .replace(/pouces/gi, 'Zoll')
      .replace(/Écran/gi, 'Display')
      .replace(/écran/gi, 'Display');
  }
  return screen;
}

/**
 * Translates speed description text
 */
export function translateSpeed(speed: number | undefined, structure: string, lang: Language): string {
  if (speed) return `${speed} mm/s`;
  if (structure === 'CoreXY') {
    if (lang === 'FR') return '500 à 600 mm/s';
    if (lang === 'EN') return '500 to 600 mm/s';
    if (lang === 'DE') return '500 bis 600 mm/s';
  }
  if (lang === 'FR') return '300 à 500 mm/s';
  if (lang === 'EN') return '300 to 500 mm/s';
  if (lang === 'DE') return '300 bis 500 mm/s';
  return '300-500 mm/s';
}
