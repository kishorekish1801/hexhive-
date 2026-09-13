export type Product = {
  id: number;

  slug: string;

  // English
  name: string;

  // Swedish
  nameSv?: string | null;

  category: string;

  price: number;

  rating: number;

  // English
  description: string;

  // Swedish
  descriptionSv?: string | null;

  material: string;

  colors: string[];

  dimensions: string;

  printTime: string;

  imageUrl?: string | null;
};

export const products: Product[] = [
  {
    id: 1,

    slug: "custom-name-keychain",

    name: "Custom Name Keychain",

    nameSv: "Personlig nyckelring med namn",

    category: "Keychains",

    price: 299,

    rating: 4.8,

    description:
      "A personalized 3D printed keychain made with your name or custom text. A simple and unique everyday accessory or gift.",

    descriptionSv:
      "En personlig 3D-printad nyckelring med ditt namn eller valfri text. En enkel och unik accessoar för vardagen eller en personlig present.",

    material: "PLA",

    colors: [
      "Black",
      "White",
      "Red",
      "Blue",
      "Green",
    ],

    dimensions: "Approx. 60 × 25 mm",

    printTime: "2–4 hours",
  },

  {
    id: 2,

    slug: "geometric-planter",

    name: "Geometric Planter",

    nameSv: "Geometrisk blomkruka",

    category: "Home Decor",

    price: 599,

    rating: 4.7,

    description:
      "A modern geometric planter designed to add a unique 3D printed touch to your home or workspace.",

    descriptionSv:
      "En modern geometrisk blomkruka som ger ditt hem eller din arbetsplats en unik 3D-printad detalj.",

    material: "PLA",

    colors: [
      "Black",
      "White",
      "Gray",
      "Green",
    ],

    dimensions:
      "Approx. 100 × 100 × 100 mm",

    printTime: "5–7 hours",
  },

  {
    id: 3,

    slug: "desk-organizer",

    name: "Desk Organizer",

    nameSv: "Skrivbordsorganisatör",

    category: "Desk Accessories",

    price: 799,

    rating: 4.9,

    description:
      "Keep your workspace clean and organized with this practical and stylish 3D printed desk organizer.",

    descriptionSv:
      "Håll din arbetsplats ren och organiserad med denna praktiska och stilrena 3D-printade skrivbordsorganisatör.",

    material: "PLA",

    colors: [
      "Black",
      "White",
      "Gray",
    ],

    dimensions:
      "Approx. 180 × 100 × 80 mm",

    printTime: "6–9 hours",
  },

  {
    id: 4,

    slug: "miniature-figure",

    name: "Miniature Figure",

    nameSv: "Miniatyrfigur",

    category: "Miniatures",

    price: 999,

    rating: 4.8,

    description:
      "A detailed 3D printed miniature figure perfect for collectors, displays and gifts.",

    descriptionSv:
      "En detaljerad 3D-printad miniatyrfigur som passar perfekt för samlare, dekoration och presenter.",

    material: "Resin",

    colors: [
      "White",
      "Gray",
      "Black",
    ],

    dimensions: "Approx. 100 mm tall",

    printTime: "8–12 hours",
  },

  {
    id: 5,

    slug: "anime-character-figure",

    name: "Anime Character Figure",

    nameSv: "Animekaraktärsfigur",

    category: "Anime",

    price: 1299,

    rating: 4.9,

    description:
      "Bring your favorite anime-inspired characters to life with a detailed 3D printed display figure.",

    descriptionSv:
      "Ge liv åt dina favoriter bland animeinspirerade karaktärer med en detaljerad 3D-printad figur för utställning.",

    material: "Resin",

    colors: [
      "White",
      "Black",
      "Custom",
    ],

    dimensions: "Approx. 150 mm tall",

    printTime: "10–16 hours",
  },

  {
    id: 6,

    slug: "gaming-controller-stand",

    name: "Gaming Controller Stand",

    nameSv: "Ställ för spelkontroll",

    category: "Gaming",

    price: 699,

    rating: 4.6,

    description:
      "A strong and stylish stand designed to keep your gaming controller organized when you're not playing.",

    descriptionSv:
      "Ett stabilt och stilrent ställ som håller din spelkontroll organiserad när du inte spelar.",

    material: "PETG",

    colors: [
      "Black",
      "White",
      "Red",
      "Blue",
    ],

    dimensions:
      "Approx. 150 × 100 × 120 mm",

    printTime: "5–8 hours",
  },

  {
    id: 7,

    slug: "personalized-name-plate",

    name: "Personalized Name Plate",

    nameSv: "Personlig namnskylt",

    category: "Gifts",

    price: 499,

    rating: 4.8,

    description:
      "Create a personalized name plate for your desk, bedroom, workspace or as a special gift.",

    descriptionSv:
      "Skapa en personlig namnskylt för skrivbordet, sovrummet, arbetsplatsen eller som en speciell present.",

    material: "PLA",

    colors: [
      "Black",
      "White",
      "Red",
      "Blue",
    ],

    dimensions:
      "Approx. 150 × 40 mm",

    printTime: "3–5 hours",
  },

  {
    id: 8,

    slug: "custom-3d-print",

    name: "Custom 3D Print",

    nameSv: "Anpassad 3D-utskrift",

    category: "Custom Prints",

    price: 799,

    rating: 5.0,

    description:
      "Have your own design? Send us your 3D model and we'll review it and create a custom print for you.",

    descriptionSv:
      "Har du en egen design? Skicka din 3D-modell till oss så granskar vi den och skapar en anpassad 3D-utskrift åt dig.",

    material: "PLA / PETG / Resin",

    colors: ["Custom"],

    dimensions: "Based on your design",

    printTime: "Depends on model",
  },
];