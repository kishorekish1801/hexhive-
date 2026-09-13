import { Product } from "@/data/products";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getImageUrl(imageUrl?: string | null) {
  if (!imageUrl) {
    return null;
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `${API_URL}${imageUrl}`;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  return data.map((product: any) => ({
    id: Number(product.id),
    slug: product.slug,

    name: product.name,
    nameSv: product.nameSv ?? null,

    category: product.category,

    price: Number(product.price),
    rating: Number(product.rating),

    description: product.description,
    descriptionSv: product.descriptionSv ?? null,

    material: product.material,
    colors: product.colors,
    dimensions: product.dimensions,
    printTime: product.printTime,

    imageUrl: getImageUrl(product.imageUrl),
  }));
}

export async function getProduct(
  slug: string
): Promise<Product | null> {
  const response = await fetch(
    `${API_URL}/products/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const product = await response.json();

  return {
    id: Number(product.id),
    slug: product.slug,

    name: product.name,
    nameSv: product.nameSv ?? null,

    category: product.category,

    price: Number(product.price),
    rating: Number(product.rating),

    description: product.description,
    descriptionSv: product.descriptionSv ?? null,

    material: product.material,
    colors: product.colors,
    dimensions: product.dimensions,
    printTime: product.printTime,

    imageUrl: getImageUrl(product.imageUrl),
  };
}