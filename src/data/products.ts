import { Product, AccessoryItem, DeliveryZone } from '../types';

import heroCylindersImg from '../assets/images/adal_hero_cylinders_1788432361025.jpg';
import cylinder6kgImg from '../assets/images/cylinder_domestic_6kg_1788432398897.jpg';
import cylinder12kgImg from '../assets/images/cylinder_family_12kg_1788432412719.jpg';
import accessoriesImg from '../assets/images/gas_accessories_set_1788432384154.jpg';

export { heroCylindersImg, cylinder6kgImg, cylinder12kgImg, accessoriesImg };

export const CYLINDER_PRODUCTS: Product[] = [
  {
    id: 'lpg-3kg',
    name: '3kg Compact LPG Cylinder',
    category: '3kg',
    sizeKg: 3,
    description: 'Ultra-portable compact cylinder designed for students, solo studio living, and quick outdoor camping cooking.',
    bestFor: 'Students, Singles & Outdoor Camping',
    burnDuration: 'Approx. 2–3 weeks (daily domestic use)',
    refillPriceUGX: 28000,
    completePriceUGX: 115000,
    currentType: 'refill',
    rating: 4.8,
    reviewsCount: 142,
    inStock: true,
    image: cylinder6kgImg,
    features: [
      'Direct burner screw top or compact regulator compatible',
      'Tamper-evident heat shrink safety seal',
      'Tested to 30 bar pressure standards',
      'Anti-corrosive powder coated steel body'
    ],
    specs: {
      valveType: 'Compact Camping / Standard Screw 16mm',
      tareWeight: '3.4 kg',
      totalWeight: '6.4 kg (when filled)',
      certification: 'UNBS Certified (US EAS 900)'
    }
  },
  {
    id: 'lpg-6kg',
    name: '6kg Household Domestic Cylinder',
    category: '6kg',
    sizeKg: 6,
    description: 'Uganda’s most popular home cooking gas cylinder. Compact, easy to handle, and fits perfectly in any kitchen or apartment.',
    bestFor: 'Small families, apartments, and couples',
    burnDuration: 'Approx. 4–6 weeks (daily family cooking)',
    refillPriceUGX: 52000,
    completePriceUGX: 185000,
    currentType: 'refill',
    rating: 4.9,
    reviewsCount: 388,
    inStock: true,
    image: cylinder6kgImg,
    features: [
      'Universal quick-fit or screw valve compatibility',
      'Includes free grill burner on complete set purchase',
      'Digital scale certified weight check on delivery',
      'Reinforced safety shroud handle for safe carrying'
    ],
    specs: {
      valveType: '20mm Compact Valve / Standard Household',
      tareWeight: '6.5 kg',
      totalWeight: '12.5 kg (when filled)',
      certification: 'UNBS Certified (US EAS 900) & ISO 9001'
    }
  },
  {
    id: 'lpg-12.5kg',
    name: '12.5kg Family Standard Cylinder',
    category: '12.5kg',
    sizeKg: 12.5,
    description: 'The premier choice for standard homes and busy family kitchens in Mbarara. Long-lasting, economical, and dependable clean cooking.',
    bestFor: 'Medium to large families & frequent home chefs',
    burnDuration: 'Approx. 8–12 weeks continuous family cooking',
    refillPriceUGX: 110000,
    completePriceUGX: 310000,
    currentType: 'refill',
    rating: 4.95,
    reviewsCount: 520,
    inStock: true,
    image: cylinder12kgImg,
    features: [
      'Standard 20mm click-on valve with safety auto-shutoff support',
      'Long-lasting economical burn with high thermal efficiency',
      'Zero soot — keeps your cooking pots sparkling clean',
      'Pressure relief valve engineered to international safety standards'
    ],
    specs: {
      valveType: '20mm Universal Click-On / Compact Valve',
      tareWeight: '13.2 kg',
      totalWeight: '25.7 kg (when filled)',
      certification: 'UNBS Certified (US EAS 900) & ISO 4706'
    }
  },
  {
    id: 'lpg-38kg',
    name: '38kg Commercial Heavy-Duty Cylinder',
    category: '38kg',
    sizeKg: 38,
    description: 'High-capacity industrial cylinder engineered for hotels, restaurants, bakeries, schools, and institutional catering across Mbarara.',
    bestFor: 'Restaurants, Hotels, Bakeries & Commercial Kitchens',
    burnDuration: 'Heavy commercial continuous high-flame operation',
    refillPriceUGX: 320000,
    completePriceUGX: 780000,
    currentType: 'refill',
    rating: 5.0,
    reviewsCount: 94,
    inStock: true,
    image: heroCylindersImg,
    features: [
      'High-flow POL brass valve for multi-burner high flame commercial stoves',
      'Heavy-duty industrial steel shell tested to 35 bar',
      'Direct manifold linkage ready for multi-cylinder setups',
      'Dedicated commercial delivery vehicle with free technician hookup'
    ],
    specs: {
      valveType: 'Heavy Industrial POL Threaded Brass Valve',
      tareWeight: '32.0 kg',
      totalWeight: '70.0 kg (when filled)',
      certification: 'UNBS Certified & High-Pressure Commercial Grade'
    }
  }
];

export const ACCESSORY_PRODUCTS: AccessoryItem[] = [
  {
    id: 'acc-regulator-gauge',
    name: 'Heavy-Duty Brass Safety Regulator with Dial Gauge',
    category: 'accessories',
    description: 'Premium brass pressure regulator with an intuitive color-coded gas level & pressure gauge. Features built-in excess flow auto-shutoff.',
    priceUGX: 45000,
    image: accessoriesImg,
    rating: 4.9,
    reviewsCount: 215,
    inStock: true,
    features: [
      'Real-time gas level indicator dial',
      'Automatic safety gas leak shut-off valve',
      'Solid brass connector with tight rubber seal',
      'UNBS approved domestic safety standard'
    ],
    compatibility: 'Universal fit for 6kg and 12.5kg standard household cylinders'
  },
  {
    id: 'acc-braided-hose',
    name: 'Braided High-Pressure Safety Gas Hose (2 Meters)',
    category: 'accessories',
    description: 'Three-layer reinforced gas hose with stainless steel braided mesh protection against rodent bites, accidental kinks, and high heat.',
    priceUGX: 25000,
    image: accessoriesImg,
    rating: 4.85,
    reviewsCount: 168,
    inStock: true,
    features: [
      'Steel-braided outer sleeve prevents rat bites & puncturing',
      'Comes with 2 heavy-duty stainless steel butterfly hose clamps',
      'Flame-retardant and weather-resistant inner lining',
      'Burst pressure rated up to 60 bar'
    ],
    compatibility: 'All standard domestic & commercial LPG cooking gas setups'
  },
  {
    id: 'acc-auto-lighter',
    name: 'Electronic Long-Reach Automatic Gas Lighter',
    category: 'accessories',
    description: 'Safe, battery-free piezo-electric spark lighter with extended stainless steel wand. Keeps your hands safely away from the burner flame.',
    priceUGX: 15000,
    image: accessoriesImg,
    rating: 4.7,
    reviewsCount: 92,
    inStock: true,
    features: [
      'No batteries, refills, or flints required — 30,000+ instant sparks',
      '30cm extended stainless steel safety wand',
      'Ergonomic grip with wall hanging loop',
      'Wind-resistant instant ignition for gas burners'
    ],
    compatibility: 'Any gas burner, stove, camping top, or oven'
  },
  {
    id: 'acc-burner-stand',
    name: 'Heavy-Gauge Cast Iron Tabletop Burner Stand',
    category: 'accessories',
    description: 'Sturdy, rust-proof reinforced cast iron stand engineered to support heavy cooking pots, boiling cauldrons, and large family sufurias safely.',
    priceUGX: 75000,
    image: accessoriesImg,
    rating: 4.9,
    reviewsCount: 114,
    inStock: true,
    features: [
      'Reinforced four-leg anti-slip rubber padded base',
      'Supports up to 80kg weight without wobbling',
      'Heat-resistant electroplated enamel finish',
      'Optimum oxygen mixing ring for a pure blue flame'
    ],
    compatibility: 'Fits 6kg, 12.5kg, and 38kg gas setups'
  }
];

export const MBARARA_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-city',
    name: 'Mbarara City Center & High Street',
    estTime: '20–30 mins',
    deliveryFeeUGX: 0,
    popularLandmarks: 'Main Post Office, Stanbic Bank, Independence Park, Central Market'
  },
  {
    id: 'zone-kamukuzi',
    name: 'Kamukuzi & Booma Hill',
    estTime: '25–35 mins',
    deliveryFeeUGX: 2000,
    popularLandmarks: 'District HQ, Golf Course, Booma Grounds, Boma Officers Mess'
  },
  {
    id: 'zone-kakoba',
    name: 'Kakoba & Alliance / Ntare',
    estTime: '25–35 mins',
    deliveryFeeUGX: 2000,
    popularLandmarks: 'Ntare School, Kakoba Roundabout, Bishop Stuart Univ. gate, Lugazi'
  },
  {
    id: 'zone-nyamitanga',
    name: 'Nyamitanga & Katete',
    estTime: '30–40 mins',
    deliveryFeeUGX: 3000,
    popularLandmarks: 'Nyamitanga Cathedral, River Rwizi Bridge, Katete Trading Center'
  },
  {
    id: 'zone-ruharo',
    name: 'Ruharo & Bwizibwera Road',
    estTime: '30–45 mins',
    deliveryFeeUGX: 3000,
    popularLandmarks: 'Ruharo Mission Hospital, St. James Cathedral, Makenke Barracks turn'
  },
  {
    id: 'zone-kakiika',
    name: 'Kakiika & Koranorya / Rwebikoona',
    estTime: '30–45 mins',
    deliveryFeeUGX: 3000,
    popularLandmarks: 'Rwebikoona Market, Koranorya Stage, Coca Cola Depot, Kakiika Prison road'
  },
  {
    id: 'zone-biharwe',
    name: 'Biharwe & Eclipse Monument',
    estTime: '40–55 mins',
    deliveryFeeUGX: 5000,
    popularLandmarks: '1520 AD Biharwe Eclipse Monument, Masaka Road Toll, Biharwe Town'
  }
];

export const SAFETY_TIPS = [
  {
    title: 'Keep Cylinders Upright & Well Ventilated',
    detail: 'Always position your LPG gas cylinder vertically on a flat, stable surface. Never store or transport cylinders sideways. Ensure continuous cross-ventilation in your cooking space.'
  },
  {
    title: 'The Soapy Water Leak Test',
    detail: 'Never use a matchstick, lighter, or open flame to check for gas leaks! Apply soapy water on the valve, regulator joint, and hose. If bubbles form, immediately close the regulator switch and call Adal Uganda hotline.'
  },
  {
    title: 'Turn Off Regulator When Not In Use',
    detail: 'Before retiring to bed or leaving your residence in Mbarara, make it a daily habit to turn the regulator switch to the OFF (horizontal) position.'
  },
  {
    title: 'Inspect Hose & Clamps Every 6 Months',
    detail: 'Check your orange safety gas hose for cracks, brittleness, or stiffness. We recommend replacing hoses every 2 years and regulators every 5 years for guaranteed safety.'
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Mugisha Kenneth',
    role: 'Head Chef, Ankole Kingdom Bistro (Booma, Mbarara)',
    comment: 'Adal Uganda has never let our restaurant down. During peak weekend dinner rushes when we need emergency 38kg cylinders, their truck delivers to Booma in under 35 minutes with certified full weight scales.',
    rating: 5,
    cylinder: '38kg Commercial'
  },
  {
    id: 2,
    name: 'Sarah Ainembabazi',
    role: 'Homeowner in Kamukuzi Division',
    comment: 'The free leak inspection on delivery is what won my trust. The rider not only carried the 12.5kg cylinder into my kitchen but also performed a soapy water check and tested my stove burner flame.',
    rating: 5,
    cylinder: '12.5kg Family Cylinder'
  },
  {
    id: 3,
    name: 'Brian Tumuhimbise',
    role: 'MUST Medical Student (Kakoba)',
    comment: 'I ordered a 6kg refill via their instant WhatsApp order system while in lectures, and by the time I walked back to my hostel in Kakoba, the cylinder was at my door! Pure blue flame, no black soot on pots.',
    rating: 5,
    cylinder: '6kg Household Refill'
  }
];
