import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    slug: "custom-name-keychain",
    name: "Custom Name Keychain",
    category: "Keychains",
    price: 299,
    rating: 4.8,
    description:
      "A personalized 3D printed keychain made with your name or custom text. A simple and unique everyday accessory or gift.",
    material: "PLA",
    colors: ["Black", "White", "Red", "Blue", "Green"],
    dimensions: "Approx. 60 × 25 mm",
    printTime: "2–4 hours",
  },
  {
    slug: "geometric-planter",
    name: "Geometric Planter",
    category: "Home Decor",
    price: 599,
    rating: 4.7,
    description:
      "A modern geometric planter designed to add a unique 3D printed touch to your home or workspace.",
    material: "PLA",
    colors: ["Black", "White", "Gray", "Green"],
    dimensions: "Approx. 100 × 100 × 100 mm",
    printTime: "5–7 hours",
  },
  {
    slug: "desk-organizer",
    name: "Desk Organizer",
    category: "Desk Accessories",
    price: 799,
    rating: 4.9,
    description:
      "Keep your workspace clean and organized with this practical and stylish 3D printed desk organizer.",
    material: "PLA",
    colors: ["Black", "White", "Gray"],
    dimensions: "Approx. 180 × 100 × 80 mm",
    printTime: "6–9 hours",
  },
  {
    slug: "miniature-figure",
    name: "Miniature Figure",
    category: "Miniatures",
    price: 999,
    rating: 4.8,
    description:
      "A detailed 3D printed miniature figure perfect for collectors, displays and gifts.",
    material: "Resin",
    colors: ["White", "Gray", "Black"],
    dimensions: "Approx. 100 mm tall",
    printTime: "8–12 hours",
  },
  {
    slug: "anime-character-figure",
    name: "Anime Character Figure",
    category: "Anime",
    price: 1299,
    rating: 4.9,
    description:
      "Bring your favorite anime-inspired characters to life with a detailed 3D printed display figure.",
    material: "Resin",
    colors: ["White", "Black", "Custom"],
    dimensions: "Approx. 150 mm tall",
    printTime: "10–16 hours",
  },
  {
    slug: "gaming-controller-stand",
    name: "Gaming Controller Stand",
    category: "Gaming",
    price: 699,
    rating: 4.6,
    description:
      "A strong and stylish stand designed to keep your gaming controller organized when you're not playing.",
    material: "PETG",
    colors: ["Black", "White", "Red", "Blue"],
    dimensions: "Approx. 150 × 100 × 120 mm",
    printTime: "5–8 hours",
  },
  {
    slug: "personalized-name-plate",
    name: "Personalized Name Plate",
    category: "Gifts",
    price: 499,
    rating: 4.8,
    description:
      "Create a personalized name plate for your desk, bedroom, workspace or as a special gift.",
    material: "PLA",
    colors: ["Black", "White", "Red", "Blue"],
    dimensions: "Approx. 150 × 40 mm",
    printTime: "3–5 hours",
  },
  {
    slug: "custom-3d-print",
    name: "Custom 3D Print",
    category: "Custom Prints",
    price: 799,
    rating: 5.0,
    description:
      "Have your own design? Send us your 3D model and we'll review it and create a custom print for you.",
    material: "PLA / PETG / Resin",
    colors: ["Custom"],
    dimensions: "Based on your design",
    printTime: "Depends on model",
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      update: product,
      create: product,
    });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
