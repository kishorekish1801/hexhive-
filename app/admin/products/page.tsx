
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  material: string;
  colors: string[];
  dimensions: string;
  printTime: string;
  imageUrl?: string | null;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const emptyProduct = {
  slug: "",
  name: "",
  category: "",
  price: "",
  rating: "5",
  description: "",
  material: "",
  colors: "",
  dimensions: "",
  printTime: "",
};

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(emptyProduct);

  const [editingSlug, setEditingSlug] =
    useState<string | null>(null);

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [currentImageUrl, setCurrentImageUrl] =
    useState<string | null>(null);

  async function fetchProducts() {
    try {
      setError("");

      const token =
        localStorage.getItem("admin_token");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch products"
        );
      }

      const data = await response.json();

      setProducts(
        data.map((product: any) => ({
          ...product,
          id: Number(product.id),
          price: Number(product.price),
          rating: Number(product.rating),
          imageUrl:
            product.imageUrl ?? null,
        }))
      );
    } catch (error: any) {
      setError(
        error.message ||
          "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function updateForm(
    field: string,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(emptyProduct);
    setEditingSlug(null);
    setSelectedImage(null);
    setImagePreview(null);
    setCurrentImageUrl(null);
    setError("");
  }

  function startEdit(product: Product) {
    setEditingSlug(product.slug);

    setForm({
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: String(product.price),
      rating: String(product.rating),
      description: product.description,
      material: product.material,
      colors: product.colors.join(", "),
      dimensions: product.dimensions,
      printTime: product.printTime,
    });

    setSelectedImage(null);
    setImagePreview(null);
    setCurrentImageUrl(
      product.imageUrl
        ? `${API_URL}${product.imageUrl}`
        : null
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG, WEBP and GIF images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    setError("");

    setSelectedImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }

  async function uploadImage(
    file: File,
    token: string
  ): Promise<string> {
    const formData = new FormData();

    formData.append("image", file);

    setUploading(true);

    try {
      const response = await fetch(
        `${API_URL}/products/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "admin_token"
        );

        router.push("/admin/login");

        throw new Error(
          "Your session has expired."
        );
      }

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to upload image"
        );
      }

      return data.imageUrl;
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const token =
        localStorage.getItem("admin_token");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      let imageUrl =
        currentImageUrl
          ? currentImageUrl.replace(
              API_URL,
              ""
            )
          : null;

      /*
       * Upload a new image first
       */
      if (selectedImage) {
        imageUrl = await uploadImage(
          selectedImage,
          token
        );
      }

      const payload = {
        slug: form.slug.trim(),
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        rating: Number(form.rating),
        description:
          form.description.trim(),
        material: form.material.trim(),

        colors: form.colors
          .split(",")
          .map((color) => color.trim())
          .filter(Boolean),

        dimensions:
          form.dimensions.trim(),

        printTime:
          form.printTime.trim(),

        imageUrl,
      };

      if (
        !payload.slug ||
        !payload.name
      ) {
        throw new Error(
          "Product name and slug are required"
        );
      }

      if (
        !Number.isFinite(payload.price) ||
        payload.price <= 0
      ) {
        throw new Error(
          "Price must be greater than 0"
        );
      }

      if (
        !Number.isFinite(payload.rating) ||
        payload.rating < 0 ||
        payload.rating > 5
      ) {
        throw new Error(
          "Rating must be between 0 and 5"
        );
      }

      const url = editingSlug
        ? `${API_URL}/products/${editingSlug}`
        : `${API_URL}/products`;

      const method = editingSlug
        ? "PATCH"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        localStorage.removeItem(
          "admin_token"
        );

        router.push("/admin/login");
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save product"
        );
      }

      resetForm();

      await fetchProducts();
    } catch (error: any) {
      setError(
        error.message ||
          "Failed to save product"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(
    product: Product
  ) {
    const confirmed =
      window.confirm(
        `Delete "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const token =
        localStorage.getItem(
          "admin_token"
        );

      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/products/${product.slug}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "admin_token"
        );

        router.push("/admin/login");
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete product"
        );
      }

      if (
        editingSlug === product.slug
      ) {
        resetForm();
      }

      await fetchProducts();
    } catch (error: any) {
      setError(
        error.message ||
          "Failed to delete product"
      );
    }
  }

  return (
    <>
      <AdminNav />

      <main
        className="min-h-screen px-6 py-10"
        style={{
          backgroundColor:
            "var(--background)",

          color:
            "var(--foreground)",
        }}
      >
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8">
            <p
              className="text-sm font-semibold uppercase tracking-[0.25em]"
              style={{
                color: "var(--muted)",
              }}
            >
              RD nordform AB
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Admin Products
            </h1>

            <p
              className="mt-2 text-sm"
              style={{
                color: "var(--muted)",
              }}
            >
              Manage products in the RD nordform store
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Product Form */}
          <section
            className="mb-10 rounded-2xl border p-6"
            style={{
              backgroundColor:
                "var(--surface)",

              borderColor:
                "var(--border)",
            }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {editingSlug
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  {editingSlug
                    ? "Update the selected product."
                    : "Create a new product for your store."}
                </p>
              </div>

              {editingSlug && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border px-4 py-2 text-sm font-medium transition-opacity hover:opacity-70"
                  style={{
                    borderColor:
                      "var(--border)",
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 md:grid-cols-2"
            >

              {/* Product Image */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Product Image
                </label>

                <div
                  className="rounded-2xl border p-5"
                  style={{
                    borderColor:
                      "var(--border)",

                    backgroundColor:
                      "var(--background)",
                  }}
                >
                  {/* Image Preview */}
                  {(imagePreview ||
                    currentImageUrl) && (
                    <div className="mb-5 overflow-hidden rounded-xl border">
                      <img
                        src={
                          imagePreview ||
                          currentImageUrl ||
                          ""
                        }
                        alt="Product preview"
                        className="h-72 w-full object-contain"
                      />
                    </div>
                  )}

                  {!imagePreview &&
                    !currentImageUrl && (
                      <div
                        className="mb-5 flex h-56 items-center justify-center rounded-xl border border-dashed"
                        style={{
                          borderColor:
                            "var(--border)",
                        }}
                      >
                        <div className="text-center">
                          <div className="text-5xl">
                            🖼️
                          </div>

                          <p
                            className="mt-3 text-sm"
                            style={{
                              color:
                                "var(--muted)",
                            }}
                          >
                            No image selected
                          </p>
                        </div>
                      </div>
                    )}

                  <label
                    className="flex cursor-pointer items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-70"
                    style={{
                      borderColor:
                        "var(--border)",

                      color:
                        "var(--foreground)",
                    }}
                  >
                    {selectedImage
                      ? "Change Image"
                      : "Choose Image"}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={
                        handleImageChange
                      }
                      className="hidden"
                    />
                  </label>

                  <p
                    className="mt-3 text-center text-xs"
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    JPG, PNG, WEBP or GIF ·
                    Maximum 5 MB
                  </p>

                  {selectedImage && (
                    <p
                      className="mt-2 text-center text-xs font-medium"
                      style={{
                        color:
                          "var(--foreground)",
                      }}
                    >
                      Selected:{" "}
                      {selectedImage.name}
                    </p>
                  )}

                  {uploading && (
                    <p
                      className="mt-3 text-center text-sm font-semibold"
                      style={{
                        color:
                          "var(--foreground)",
                      }}
                    >
                      Uploading image...
                    </p>
                  )}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product Name
                </label>

                <input
                  value={form.name}
                  onChange={(event) =>
                    updateForm(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Example: Custom Name Keychain"
                  required
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  style={{
                    backgroundColor:
                      "var(--background)",

                    borderColor:
                      "var(--border)",

                    color:
                      "var(--foreground)",
                  }}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Slug
                </label>

                <input
                  value={form.slug}
                  onChange={(event) =>
                    updateForm(
                      "slug",
                      event.target.value
                    )
                  }
                  placeholder="custom-name-keychain"
                  required
                  disabled={!!editingSlug}
                  className="w-full rounded-xl border px-4 py-3 outline-none disabled:opacity-50"
                  style={{
                    backgroundColor:
                      "var(--background)",

                    borderColor:
                      "var(--border)",

                    color:
                      "var(--foreground)",
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <input
                  value={form.category}
                  onChange={(event) =>
                    updateForm(
                      "category",
                      event.target.value
                    )
                  }
                  placeholder="Keychains"
                  required
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  style={{
                    backgroundColor:
                      "var(--background)",

                    borderColor:
                      "var(--border)",

                    color:
                      "var(--foreground)",
                  }}
                />
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price (SEK)
                </label>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    updateForm(
                      "price",
                      event.target.value
                    )
                  }
                  placeholder="799"
                  required
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  style={{
                    backgroundColor:
                      "var(--background)",

                    borderColor:
                      "var(--border)",

                    color:
                      "var(--foreground)",
                  }}
                />
              </div>

              {/* Rating */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Rating
                </label>

                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={(event) =>
                    updateForm(
                      "rating",
                      event.target.value
                    )
                  }
                  placeholder="5"
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  style={{
                    backgroundColor:
                      "var(--background)",

                    borderColor:
                      "var(--border)",

                    color:
                      "var(--foreground)",
                  }}
                />
              </div>

              {/* Material */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Material
                </label>

                <input
                  value={form.material}
                  onChange={(event) =>
                    updateForm(
                      "material",
                      event.target.value
                    )
                  }
                  placeholder="PLA"
                  required
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  style={{
                    backgroundColor:
                      "var(--background)",

                    borderColor:
                      "var(--border)",

                    color:
                      "var(--foreground)",
                  }}
                />
              </div>

              {/* Colors */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Colors
                </label>

                <input
                  value={form.colors}
                  onChange={(event) =>
                    updateForm(
                      "colors",
                      event.target.value
                    )
                  }
                  placeholder="Black, White, Red, Blue"
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  style={{
                    backgroundColor:
                      "var(--background)",

                    borderColor:
                      "var(--border)",

                    color:
                      "var(--foreground)",
                  }}
                />

                <p
                  className="mt-1 text-xs"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  Separate colors with commas.
                </p>
              </div>

              {/* Dimensions */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Dimensions
                </label>

                <input
                  value={form.dimensions}
                  onChange={(event) =>
                    updateForm(
                      "dimensions",
                      event.target.value
                    )
                  }
                  placeholder="Approx. 100 × 100 × 100 mm"
                  required
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  style={{
                    backgroundColor:
                      "var(--background)",

                    borderColor:
                      "var(--border)",

                    color:
                      "var(--foreground)",
                  }}
                />
              </div>

              {/* Print Time */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Print Time
                </label>

                <input
                  value={form.printTime}
                  onChange={(event) =>
                    updateForm(
                      "printTime",
                      event.target.value
                    )
                  }
                  placeholder="5–7 hours"
                  required
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  style={{
                    backgroundColor:
                      "var(--background)",

                    borderColor:
                      "var(--border)",

                    color:
                      "var(--foreground)",
                  }}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Describe the product..."
                  required
                  rows={4}
                  className="w-full rounded-xl border px-4 py-3 outline-none"
                  style={{
                    backgroundColor:
                      "var(--background)",

                    borderColor:
                      "var(--border)",

                    color:
                      "var(--foreground)",
                  }}
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={
                    saving || uploading
                  }
                  className="w-full rounded-xl px-6 py-3 font-semibold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor:
                      "var(--foreground)",

                    color:
                      "var(--background)",
                  }}
                >
                  {uploading
                    ? "Uploading Image..."
                    : saving
                      ? "Saving..."
                      : editingSlug
                        ? "Update Product"
                        : "Add Product"}
                </button>
              </div>

            </form>
          </section>

          {/* Products */}
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold">
                Products ({products.length})
              </h2>

              <p
                className="mt-1 text-sm"
                style={{
                  color: "var(--muted)",
                }}
              >
                All products currently stored in PostgreSQL
              </p>
            </div>

            {loading ? (
              <div
                className="rounded-2xl border p-8 text-center"
                style={{
                  backgroundColor:
                    "var(--surface)",

                  borderColor:
                    "var(--border)",
                }}
              >
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div
                className="rounded-2xl border p-8 text-center"
                style={{
                  backgroundColor:
                    "var(--surface)",

                  borderColor:
                    "var(--border)",
                }}
              >
                No products found.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {products.map(
                  (product) => (
                    <article
                      key={product.id}
                      className="overflow-hidden rounded-2xl border"
                      style={{
                        backgroundColor:
                          "var(--surface)",

                        borderColor:
                          "var(--border)",
                      }}
                    >

                      {/* Product Image */}
                      {product.imageUrl ? (
                        <div className="h-56 w-full overflow-hidden">
                          <img
                            src={`${API_URL}${product.imageUrl}`}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="flex h-56 items-center justify-center"
                          style={{
                            backgroundColor:
                              "var(--background)",
                          }}
                        >
                          <div className="text-center">
                            <div className="text-5xl">
                              🖨️
                            </div>

                            <p
                              className="mt-2 text-sm"
                              style={{
                                color:
                                  "var(--muted)",
                              }}
                            >
                              No image
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="p-5">

                        {/* Product Header */}
                        <div className="mb-4">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-lg font-bold">
                              {product.name}
                            </h3>

                            <span
                              className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                              style={{
                                backgroundColor:
                                  "var(--background)",
                              }}
                            >
                              {product.price} kr
                            </span>
                          </div>

                          <p
                            className="mt-1 text-sm"
                            style={{
                              color:
                                "var(--muted)",
                            }}
                          >
                            {product.category}
                          </p>
                        </div>

                        {/* Description */}
                        <p
                          className="mb-4 text-sm leading-6"
                          style={{
                            color:
                              "var(--muted)",
                          }}
                        >
                          {product.description}
                        </p>

                        {/* Details */}
                        <div
                          className="space-y-2 border-t pt-4 text-sm"
                          style={{
                            borderColor:
                              "var(--border)",
                          }}
                        >
                          <p>
                            <strong>
                              Material:
                            </strong>{" "}
                            {product.material}
                          </p>

                          <p>
                            <strong>
                              Rating:
                            </strong>{" "}
                            ⭐ {product.rating}
                          </p>

                          <p>
                            <strong>
                              Colors:
                            </strong>{" "}
                            {product.colors.join(
                              ", "
                            )}
                          </p>

                          <p>
                            <strong>
                              Dimensions:
                            </strong>{" "}
                            {product.dimensions}
                          </p>

                          <p>
                            <strong>
                              Print time:
                            </strong>{" "}
                            {product.printTime}
                          </p>
                        </div>

                        {/* Buttons */}
                        <div className="mt-5 flex gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              startEdit(
                                product
                              )
                            }
                            className="flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-70"
                            style={{
                              borderColor:
                                "var(--border)",
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteProduct(
                                product
                              )
                            }
                            className="flex-1 rounded-xl border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 transition-opacity hover:opacity-70"
                          >
                            Delete
                          </button>
                        </div>

                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </section>

        </div>
      </main>
    </>
  );
}

