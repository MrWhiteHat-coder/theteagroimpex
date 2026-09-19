/*
  THETE AGRO IMPEX — CENTRALIZED PRODUCT CATALOGUE
  ------------------------------------------------
  To add or edit products, change entries below only.
  Each product needs: id, slug, name, category, shortDescription, description,
  image (main), thumb (optional square crop), specifications (array),
  origin, packaging, availability, tags and keywords (used by search).
  Detail pages are served at /products/<slug> (see netlify.toml / server.js).
  After editing, run: node generate-sitemap.js
*/
const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Spices',
  'Cereals & Grains',
  'Pulses & Legumes'
];

const PRODUCTS_DATA = [
  /* ---------------- VEGETABLES ---------------- */
  {
    id: 'onion',
    slug: 'onion',
    name: 'Onion',
    category: 'Vegetables',
    tag: 'Nashik origin',
    image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=1000&q=85',
    thumb: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Cured Nashik red onions, size-graded for long-haul shipments.',
    description: 'Red onions from the Nashik belt — one of India\'s largest onion-growing regions — properly cured and graded (45–55 mm, 55–65 mm and larger), packed for reefer and dry container shipments.',
    specifications: ['Cured skins for long transit', 'Common grades: 45–55 mm, 55–65 mm, 65 mm+', 'Reefer-friendly packing'],
    origin: 'Nashik, Maharashtra',
    packaging: '5–50 kg mesh bags, jumbo bags on request',
    availability: 'Year round (variety dependent)',
    keywords: ['onion', 'red onion', 'nashik onion', 'laser onion', 'onion exporter india', 'vegetable exporter']
  },
  {
    id: 'tomato',
    slug: 'tomato',
    name: 'Tomato',
    category: 'Vegetables',
    tag: 'Farm fresh',
    image: 'https://images.unsplash.com/photo-1741517287385-8a5c97b92c56?auto=format&fit=crop&w=1000&q=85',
    thumb: 'https://images.unsplash.com/photo-1741517287385-8a5c97b92c56?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Firm, uniformly ripe tomatoes graded for fresh consumption.',
    description: 'Firm, vine-ripened tomatoes graded for uniform ripeness and size, suitable for fresh consumption and supplied in breathing packing to retain quality in transit.',
    specifications: ['Uniform ripeness grading', 'Breathing packing for transit'],
    origin: 'Maharashtra & Regional Farms',
    packaging: 'Ventilated cartons / crates',
    availability: 'Seasonal peaks',
    keywords: ['tomato', 'fresh tomato', 'tomato exporter india', 'vegetable exporter']
  },
  {
    id: 'green-chilli',
    slug: 'green-chilli',
    name: 'Green Chilli',
    category: 'Vegetables',
    tag: 'Farm fresh',
    image: 'https://images.unsplash.com/photo-1783000837411-d91c45d67f6d?auto=format&fit=crop&w=1000&q=85',
    thumb: 'https://images.unsplash.com/photo-1783000837411-d91c45d67f6d?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Fresh green chillies graded for length, colour and pungency.',
    description: 'Fresh green chillies sourced from Maharashtra growers, graded for length and colour and packed in ventilated packs to hold freshness through transit.',
    specifications: ['Graded by length and colour', 'Ventilated packing for freshness'],
    origin: 'Maharashtra & Regional Farms',
    packaging: 'Ventilated cartons / mesh bags',
    availability: 'Seasonal peaks, variety dependent',
    keywords: ['green chilli', 'chilli exporter', 'fresh chillies india', 'vegetable exporter']
  },

  /* ---------------- FRUITS ---------------- */
  {
    id: 'pomegranate',
    slug: 'pomegranate',
    name: 'Pomegranate',
    category: 'Fruits',
    tag: 'Seasonal',
    image: 'https://images.unsplash.com/photo-1574709755755-1699988a9c82?auto=format&fit=crop&w=1000&q=85',
    thumb: 'https://images.unsplash.com/photo-1574709755755-1699988a9c82?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Deep-aril pomegranates graded by count and colour.',
    description: 'Pomegranates from Maharashtra orchards — a state known for the Bhagwa variety — graded by fruit count per box with deep aril colour, packed in export cartons with liners.',
    specifications: ['Graded by count per carton', 'Deep aril colour selection', 'Export cartons with liners'],
    origin: 'Maharashtra Orchards',
    packaging: '3–5 kg export cartons with liners',
    availability: 'Seasonal (main window Sep–Feb)',
    keywords: ['pomegranate', 'bhagwa', 'anar', 'fruit exporter india']
  },
  {
    id: 'banana',
    slug: 'banana',
    name: 'Banana',
    category: 'Fruits',
    tag: 'Year round',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1000&q=85',
    thumb: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Export-grade G9 Cavendish bananas packed at controlled maturity.',
    description: 'Grand Naine (G9) Cavendish bananas harvested at controlled maturity, washed, graded by hand count and packed in poly-lined cartons for reefer shipment.',
    specifications: ['Graded by hand count per box', 'Poly-lined export cartons', 'Harvested to order'],
    origin: 'Maharashtra & Gujarat growers',
    packaging: '13.5 / 18.5 kg poly-lined cartons',
    availability: 'Year round',
    keywords: ['banana', 'g9', 'cavendish', 'fruit exporter india']
  },

  /* ---------------- SPICES ---------------- */
  {
    id: 'turmeric',
    slug: 'turmeric',
    name: 'Turmeric (Raw & Powder)',
    category: 'Spices',
    tag: 'Made to order',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=85',
    thumb: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Turmeric fingers (raw) and powder with declared curcumin content.',
    description: 'Whole turmeric fingers (raw) and ground turmeric powder with declared curcumin content, sourced from direct processors with lot-wise documentation.',
    specifications: ['Raw fingers and ground powder', 'Curcumin content as declared per lot'],
    origin: 'Direct Agro Processors',
    packaging: '25 / 50 kg bags',
    availability: 'Year round',
    keywords: ['turmeric', 'haldi', 'curcumin', 'turmeric raw', 'turmeric powder', 'spice exporter india']
  },

  /* ---------------- CEREALS & GRAINS ---------------- */
  {
    id: 'raw-rice',
    slug: 'raw-rice',
    name: 'Raw Rice',
    category: 'Cereals & Grains',
    tag: 'Export grade',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=85',
    thumb: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Sortex-cleaned raw (white) rice milled to buyer specification.',
    description: 'Raw (white) rice, milled and sortex-cleaned, available in long and medium grain varieties. Supplied bagged or in bulk liner for wholesale and institutional buyers.',
    specifications: ['Sortex cleaned', 'Long / medium grain options', 'Broken % as per contract'],
    origin: 'Indian Mills',
    packaging: '25 / 50 kg PP / non-woven bags, bulk liner on request',
    availability: 'Year round',
    keywords: ['raw rice', 'white rice', 'rice exporter india', 'raw rice exporter']
  },
  {
    id: 'steam-rice',
    slug: 'steam-rice',
    name: 'Steam Rice',
    category: 'Cereals & Grains',
    tag: 'Export grade',
    image: 'https://images.unsplash.com/photo-1686820740687-426a7b9b2043?auto=format&fit=crop&w=1000&q=85',
    thumb: 'https://images.unsplash.com/photo-1686820740687-426a7b9b2043?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Steam-treated rice with separate, non-sticky grains on cooking.',
    description: 'Steam rice — paddy steamed before milling — giving grains a firm bite and non-sticky cooking, popular with Middle East and African buyers. Milled, sortex-cleaned and bagged to order.',
    specifications: ['Steam-treated before milling', 'Sortex cleaned', 'Grain length as per variety'],
    origin: 'Indian Mills',
    packaging: '25 / 50 kg PP / non-woven bags, bulk liner on request',
    availability: 'Year round',
    keywords: ['steam rice', 'rice exporter india', 'steam basmati', 'non sticky rice']
  },

  /* ---------------- PULSES & LEGUMES ---------------- */
  {
    id: 'toor-dal',
    slug: 'toor-dal',
    name: 'Toor Dal',
    category: 'Pulses & Legumes',
    tag: 'Pantry staples',
    image: 'https://images.unsplash.com/photo-1638378545909-d78bd9b4271c?auto=format&fit=crop&w=1000&q=85',
    thumb: 'https://images.unsplash.com/photo-1638378545909-d78bd9b4271c?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Machine-cleaned toor (arhar) dal with consistent moisture.',
    description: 'Machine-cleaned toor (arhar / pigeon pea) dal with consistent moisture and purity, supplied in poly-lined bags for wholesale and packing houses.',
    specifications: ['Machine cleaned', 'Moisture as per contract', 'Poly-lined packing'],
    origin: 'Central & Western India',
    packaging: '25 / 50 kg PP bags, poly-lined',
    availability: 'Year round',
    keywords: ['toor dal', 'arhar dal', 'pigeon peas', 'tuar', 'dal exporter india']
  },
  {
    id: 'moong-dal',
    slug: 'moong-dal',
    name: 'Moong Dal',
    category: 'Pulses & Legumes',
    tag: 'Pantry staples',
    image: 'https://images.unsplash.com/photo-1672660589379-891ab59588a8?auto=format&fit=crop&w=1000&q=85',
    thumb: 'https://images.unsplash.com/photo-1672660589379-891ab59588a8?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Split and cleaned moong (mung) dal, bright and consistent.',
    description: 'Split moong (mung bean) dal, machine-cleaned with bright colour and consistent grading — favoured for its light digestion and wide use across cuisines.',
    specifications: ['Machine cleaned and split', 'Consistent colour grading', 'Poly-lined packing'],
    origin: 'Central & Western India',
    packaging: '25 / 50 kg PP bags, poly-lined',
    availability: 'Year round',
    keywords: ['moong dal', 'mung dal', 'green gram', 'dal exporter india']
  },
  {
    id: 'masoor-dal',
    slug: 'masoor-dal',
    name: 'Masoor Dal',
    category: 'Pulses & Legumes',
    tag: 'Pantry staples',
    image: 'https://images.unsplash.com/photo-1708436477916-f97964f3ccf1?auto=format&fit=crop&w=1000&q=85',
    thumb: 'https://images.unsplash.com/photo-1708436477916-f97964f3ccf1?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Red masoor (split lentils), cleaned to export purity levels.',
    description: 'Split red masoor (red lentils), machine-cleaned to export purity levels with consistent grain size — a staple for wholesale distribution and food processing.',
    specifications: ['Machine cleaned', 'Uniform split size', 'Moisture as per contract'],
    origin: 'Central & Western India',
    packaging: '25 / 50 kg PP bags, poly-lined',
    availability: 'Year round',
    keywords: ['masoor dal', 'red lentils', 'red lentil exporter', 'dal exporter india']
  },
  {
    id: 'udid-dal',
    slug: 'udid-dal',
    name: 'Udid Dal',
    category: 'Pulses & Legumes',
    tag: 'Pantry staples',
    image: 'https://images.unsplash.com/photo-1574661309443-d2c5974954d7?auto=format&fit=crop&w=1000&q=85',
    thumb: 'https://images.unsplash.com/photo-1574661309443-d2c5974954d7?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Split black gram (udid / urad) dal, cleaned and graded.',
    description: 'Split udid (urad / black gram) dal, machine-cleaned and graded — available with skin and skinless forms — used widely for batters, flours and everyday cooking.',
    specifications: ['With-skin and skinless options', 'Machine cleaned and graded', 'Moisture as per contract'],
    origin: 'Central & Western India',
    packaging: '25 / 50 kg PP bags, poly-lined',
    availability: 'Year round',
    keywords: ['udid dal', 'urad dal', 'black gram', 'vigna mungo', 'dal exporter india']
  }
];

if (typeof window !== 'undefined') {
  window.PRODUCTS_DATA = PRODUCTS_DATA;
  window.PRODUCT_CATEGORIES = CATEGORIES;
}
