
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type ModelFile = {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
};

type ReferenceImage = {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
};

type Quote = {
  id: number;
  customerName: string;
  email: string;
  phone?: string | null;

  modelFiles?: ModelFile[] | null;
  referenceImages?: ReferenceImage[] | null;

  material: string;
  color: string;
  quantity: number;
  printQuality: string;
  additionalNotes?: string | null;

  status: string;
  quotedPrice?: string | number | null;
  estimatedDelivery?: string | null;
  adminNotes?: string | null;

  createdAt: string;
  updatedAt: string;
};

const STATUS_OPTIONS = [
  "NEW",
  "REVIEWING",
  "QUOTED",
  "ACCEPTED",
  "REJECTED",
  "COMPLETED",
];

function formatStatus(status: string) {
  switch (status) {
    case "NEW":
      return "New";

    case "REVIEWING":
      return "Reviewing";

    case "QUOTED":
      return "Quoted";

    case "ACCEPTED":
      return "Accepted";

    case "REJECTED":
      return "Rejected";

    case "COMPLETED":
      return "Completed";

    default:
      return status;
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "NEW":
      return {
        backgroundColor: "#dbeafe",
        color: "#1e40af",
      };

    case "REVIEWING":
      return {
        backgroundColor: "#fef3c7",
        color: "#92400e",
      };

    case "QUOTED":
      return {
        backgroundColor: "#ede9fe",
        color: "#6d28d9",
      };

    case "ACCEPTED":
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
      };

    case "REJECTED":
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
      };

    case "COMPLETED":
      return {
        backgroundColor: "#d1fae5",
        color: "#065f46",
      };

    default:
      return {
        backgroundColor: "var(--surface-secondary)",
        color: "var(--foreground)",
      };
  }
}

function formatFileSize(bytes: number) {
  if (!bytes || bytes <= 0) {
    return "Unknown size";
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatPrice(value: string | number | null | undefined) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not quoted";
  }

  return `${Number(value).toFixed(2)} kr`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminQuotesPage() {
  const router = useRouter();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedQuote, setSelectedQuote] =
    useState<Quote | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editStatus, setEditStatus] =
    useState("NEW");

  const [editQuotedPrice, setEditQuotedPrice] =
    useState("");

  const [editEstimatedDelivery, setEditEstimatedDelivery] =
    useState("");

  const [editAdminNotes, setEditAdminNotes] =
    useState("");

  useEffect(() => {
    const token =
      localStorage.getItem("admin_token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    loadQuotes(token);
  }, [router]);

  async function loadQuotes(token?: string) {
    try {
      setLoading(true);
      setError("");

      const adminToken =
        token ||
        localStorage.getItem("admin_token");

      if (!adminToken) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/quotes`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${adminToken}`,
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

      if (!response.ok) {
        throw new Error(
          "Failed to load customer quotes"
        );
      }

      const data = await response.json();

      setQuotes(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load customer quote requests. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredQuotes = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return quotes;
    }

    return quotes.filter((quote) => {
      return (
        String(quote.id)
          .toLowerCase()
          .includes(searchValue) ||
        quote.customerName
          .toLowerCase()
          .includes(searchValue) ||
        quote.email
          .toLowerCase()
          .includes(searchValue) ||
        quote.status
          .toLowerCase()
          .includes(searchValue) ||
        quote.material
          .toLowerCase()
          .includes(searchValue)
      );
    });
  }, [quotes, search]);

  const statistics = useMemo(() => {
    return {
      total: quotes.length,

      newQuotes: quotes.filter(
        (quote) =>
          quote.status === "NEW"
      ).length,

      reviewing: quotes.filter(
        (quote) =>
          quote.status === "REVIEWING"
      ).length,

      quoted: quotes.filter(
        (quote) =>
          quote.status === "QUOTED"
      ).length,
    };
  }, [quotes]);

  function openQuote(quote: Quote) {
    setSelectedQuote(quote);

    setEditStatus(
      quote.status || "NEW"
    );

    setEditQuotedPrice(
      quote.quotedPrice !== null &&
        quote.quotedPrice !== undefined
        ? String(quote.quotedPrice)
        : ""
    );

    setEditEstimatedDelivery(
      quote.estimatedDelivery || ""
    );

    setEditAdminNotes(
      quote.adminNotes || ""
    );
  }

  function closeQuote() {
    if (saving || deleting) {
      return;
    }

    setSelectedQuote(null);
  }

  async function saveQuote() {
    if (!selectedQuote) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token =
        localStorage.getItem(
          "admin_token"
        );

      if (!token) {
        router.push("/admin/login");
        return;
      }

      let quotedPrice:
        | number
        | null = null;

      if (
        editQuotedPrice.trim() !== ""
      ) {
        const parsedPrice =
          Number(
            editQuotedPrice
          );

        if (
          !Number.isFinite(
            parsedPrice
          ) ||
          parsedPrice < 0
        ) {
          throw new Error(
            "Quoted price must be a valid number."
          );
        }

        quotedPrice = parsedPrice;
      }

      const response = await fetch(
        `${API_URL}/quotes/${selectedQuote.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: editStatus,

            quotedPrice,

            estimatedDelivery:
              editEstimatedDelivery.trim() ||
              null,

            adminNotes:
              editAdminNotes.trim() ||
              null,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "admin_token"
        );

        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        const errorData =
          await response.json().catch(
            () => null
          );

        throw new Error(
          errorData?.message ||
            "Failed to update quote"
        );
      }

      const updatedQuote =
        await response.json();

      setQuotes((currentQuotes) =>
        currentQuotes.map(
          (quote) =>
            quote.id ===
            updatedQuote.id
              ? updatedQuote
              : quote
        )
      );

      setSelectedQuote(
        updatedQuote
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update quote."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteQuote() {
    if (!selectedQuote) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete quote request #${selectedQuote.id} from ${selectedQuote.customerName}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
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
        `${API_URL}/quotes/${selectedQuote.id}`,
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

      if (!response.ok) {
        throw new Error(
          "Failed to delete quote"
        );
      }

      setQuotes((currentQuotes) =>
        currentQuotes.filter(
          (quote) =>
            quote.id !==
            selectedQuote.id
        )
      );

      setSelectedQuote(null);
    } catch (error) {
      console.error(error);

      setError(
        "Failed to delete quote request."
      );
    } finally {
      setDeleting(false);
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
          color: "var(--foreground)",
        }}
      >
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Customer Print Quotes
              </h1>

              <p
                className="mt-2 text-sm"
                style={{
                  color: "var(--muted)",
                }}
              >
                View and manage customer 3D printing quote requests.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadQuotes()
              }
              className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-70"
              style={{
                borderColor:
                  "var(--border)",
                backgroundColor:
                  "var(--surface)",
              }}
            >
              ↻ Refresh
            </button>
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="mb-6 rounded-xl border p-4 text-sm"
              style={{
                backgroundColor:
                  "var(--surface)",
                borderColor:
                  "var(--border)",
                color:
                  "var(--foreground)",
              }}
            >
              {error}
            </div>
          )}

          {/* STATISTICS */}

          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor:
                  "var(--surface)",
                borderColor:
                  "var(--border)",
              }}
            >
              <p
                className="text-sm"
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                Total Quotes
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.total}
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor:
                  "var(--surface)",
                borderColor:
                  "var(--border)",
              }}
            >
              <p
                className="text-sm"
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                New
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.newQuotes}
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor:
                  "var(--surface)",
                borderColor:
                  "var(--border)",
              }}
            >
              <p
                className="text-sm"
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                Reviewing
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.reviewing}
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor:
                  "var(--surface)",
                borderColor:
                  "var(--border)",
              }}
            >
              <p
                className="text-sm"
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                Quoted
              </p>

              <p className="mt-2 text-3xl font-bold">
                {statistics.quoted}
              </p>
            </div>

          </section>

          {/* SEARCH */}

          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search customer, email, quote ID, status or material..."
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
              style={{
                backgroundColor:
                  "var(--surface)",
                borderColor:
                  "var(--border)",
                color:
                  "var(--foreground)",
              }}
            />
          </div>

          {/* QUOTES */}

          {loading ? (
            <div
              className="rounded-xl border p-10 text-center"
              style={{
                backgroundColor:
                  "var(--surface)",
                borderColor:
                  "var(--border)",
                color:
                  "var(--muted)",
              }}
            >
              Loading customer quote requests...
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div
              className="rounded-xl border p-10 text-center"
              style={{
                backgroundColor:
                  "var(--surface)",
                borderColor:
                  "var(--border)",
                color:
                  "var(--muted)",
              }}
            >
              {quotes.length === 0
                ? "No customer quote requests yet."
                : "No quote requests match your search."}
            </div>
          ) : (
            <div className="space-y-4">

              {filteredQuotes.map(
                (quote) => {
                  const models =
                    quote.modelFiles ||
                    [];

                  const images =
                    quote.referenceImages ||
                    [];

                  return (
                    <button
                      key={quote.id}
                      type="button"
                      onClick={() =>
                        openQuote(
                          quote
                        )
                      }
                      className="w-full rounded-xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:opacity-80"
                      style={{
                        backgroundColor:
                          "var(--surface)",
                        borderColor:
                          "var(--border)",
                      }}
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-lg font-bold">
                              Quote #
                              {
                                quote.id
                              }
                            </span>

                            <span
                              className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                              style={getStatusStyle(
                                quote.status
                              )}
                            >
                              {formatStatus(
                                quote.status
                              )}
                            </span>
                          </div>

                          <h2 className="mt-2 text-base font-semibold">
                            {
                              quote.customerName
                            }
                          </h2>

                          <p
                            className="mt-1 text-sm"
                            style={{
                              color:
                                "var(--muted)",
                            }}
                          >
                            {
                              quote.email
                            }
                          </p>

                          {quote.phone && (
                            <p
                              className="mt-1 text-sm"
                              style={{
                                color:
                                  "var(--muted)",
                              }}
                            >
                              {
                                quote.phone
                              }
                            </p>
                          )}

                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                          <div>
                            <p
                              className="text-xs"
                              style={{
                                color:
                                  "var(--muted)",
                              }}
                            >
                              Models
                            </p>

                            <p className="mt-1 font-semibold">
                              {
                                models.length
                              }
                            </p>
                          </div>

                          <div>
                            <p
                              className="text-xs"
                              style={{
                                color:
                                  "var(--muted)",
                              }}
                            >
                              Images
                            </p>

                            <p className="mt-1 font-semibold">
                              {
                                images.length
                              }
                            </p>
                          </div>

                          <div>
                            <p
                              className="text-xs"
                              style={{
                                color:
                                  "var(--muted)",
                              }}
                            >
                              Quantity
                            </p>

                            <p className="mt-1 font-semibold">
                              {
                                quote.quantity
                              }
                            </p>
                          </div>

                          <div>
                            <p
                              className="text-xs"
                              style={{
                                color:
                                  "var(--muted)",
                              }}
                            >
                              Date
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                              {new Date(
                                quote.createdAt
                              ).toLocaleDateString(
                                "en-GB"
                              )}
                            </p>
                          </div>

                        </div>

                      </div>

                      <div
                        className="mt-5 grid gap-3 border-t pt-4 sm:grid-cols-4"
                        style={{
                          borderColor:
                            "var(--border)",
                        }}
                      >
                        <div>
                          <p
                            className="text-xs"
                            style={{
                              color:
                                "var(--muted)",
                            }}
                          >
                            Material
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {
                              quote.material
                            }
                          </p>
                        </div>

                        <div>
                          <p
                            className="text-xs"
                            style={{
                              color:
                                "var(--muted)",
                            }}
                          >
                            Color
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {
                              quote.color
                            }
                          </p>
                        </div>

                        <div>
                          <p
                            className="text-xs"
                            style={{
                              color:
                                "var(--muted)",
                            }}
                          >
                            Quality
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {
                              quote.printQuality
                            }
                          </p>
                        </div>

                        <div>
                          <p
                            className="text-xs"
                            style={{
                              color:
                                "var(--muted)",
                            }}
                          >
                            Quoted Price
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {formatPrice(
                              quote.quotedPrice
                            )}
                          </p>
                        </div>
                      </div>

                    </button>
                  );
                }
              )}

            </div>
          )}

        </div>
      </main>

      {/* QUOTE MODAL */}

      {selectedQuote && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeQuote();
            }
          }}
        >
          <div className="mx-auto my-8 max-w-4xl rounded-2xl border p-6 shadow-2xl"
            style={{
              backgroundColor:
                "var(--surface)",
              borderColor:
                "var(--border)",
              color:
                "var(--foreground)",
            }}
          >

            {/* MODAL HEADER */}

            <div className="mb-6 flex items-start justify-between gap-4">

              <div>
                <p
                  className="text-sm"
                  style={{
                    color:
                      "var(--muted)",
                  }}
                >
                  Customer Quote Request
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Quote #
                  {
                    selectedQuote.id
                  }
                </h2>

                <p
                  className="mt-1 text-sm"
                  style={{
                    color:
                      "var(--muted)",
                  }}
                >
                  Submitted{" "}
                  {formatDate(
                    selectedQuote.createdAt
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={closeQuote}
                className="rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor:
                    "var(--border)",
                }}
              >
                ✕ Close
              </button>

            </div>

            {/* CUSTOMER */}

            <section className="mb-6">
              <h3 className="mb-3 text-lg font-bold">
                Customer
              </h3>

              <div className="grid gap-4 rounded-xl border p-4 sm:grid-cols-3"
                style={{
                  borderColor:
                    "var(--border)",
                  backgroundColor:
                    "var(--surface-secondary)",
                }}
              >
                <div>
                  <p
                    className="text-xs"
                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    Name
                  </p>

                  <p className="mt-1 font-medium">
                    {
                      selectedQuote.customerName
                    }
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs"
                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    Email
                  </p>

                  <p className="mt-1 break-all font-medium">
                    {
                      selectedQuote.email
                    }
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs"
                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    Phone
                  </p>

                  <p className="mt-1 font-medium">
                    {
                      selectedQuote.phone ||
                      "Not provided"
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* PRINT REQUIREMENTS */}

            <section className="mb-6">
              <h3 className="mb-3 text-lg font-bold">
                Printing Requirements
              </h3>

              <div className="grid gap-4 rounded-xl border p-4 sm:grid-cols-4"
                style={{
                  borderColor:
                    "var(--border)",
                }}
              >
                <div>
                  <p
                    className="text-xs"
                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    Material
                  </p>

                  <p className="mt-1 font-medium">
                    {
                      selectedQuote.material
                    }
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs"
                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    Color
                  </p>

                  <p className="mt-1 font-medium">
                    {
                      selectedQuote.color
                    }
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs"
                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    Quantity
                  </p>

                  <p className="mt-1 font-medium">
                    {
                      selectedQuote.quantity
                    }
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs"
                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    Print Quality
                  </p>

                  <p className="mt-1 font-medium">
                    {
                      selectedQuote.printQuality
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* MODEL FILES */}

            <section className="mb-6">
              <h3 className="mb-3 text-lg font-bold">
                3D Model Files
              </h3>

              {(
                selectedQuote.modelFiles ||
                []
              ).length === 0 ? (
                <div
                  className="rounded-xl border p-4 text-sm"
                  style={{
                    borderColor:
                      "var(--border)",
                    color:
                      "var(--muted)",
                  }}
                >
                  No model files found.
                </div>
              ) : (
                <div className="space-y-3">

                  {(
                    selectedQuote.modelFiles ||
                    []
                  ).map(
                    (file, index) => (
                      <div
                        key={`${file.fileName}-${index}`}
                        className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                        style={{
                          borderColor:
                            "var(--border)",
                        }}
                      >
                        <div className="min-w-0">
                          <p className="break-all font-medium">
                            {
                              file.fileName
                            }
                          </p>

                          <p
                            className="mt-1 text-xs"
                            style={{
                              color:
                                "var(--muted)",
                            }}
                          >
                            {file.fileType.toUpperCase()}{" "}
                            •{" "}
                            {formatFileSize(
                              file.fileSize
                            )}
                          </p>
                        </div>

                        <a
                          href={`${API_URL}${file.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-lg border px-4 py-2 text-sm font-medium"
                          style={{
                            borderColor:
                              "var(--border)",
                          }}
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                        >
                          Download / Open
                        </a>
                      </div>
                    )
                  )}

                </div>
              )}
            </section>

            {/* REFERENCE IMAGES */}

            <section className="mb-6">
              <h3 className="mb-3 text-lg font-bold">
                Reference Images
              </h3>

              {(
                selectedQuote.referenceImages ||
                []
              ).length === 0 ? (
                <div
                  className="rounded-xl border p-4 text-sm"
                  style={{
                    borderColor:
                      "var(--border)",
                    color:
                      "var(--muted)",
                  }}
                >
                  No reference images provided.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  {(
                    selectedQuote.referenceImages ||
                    []
                  ).map(
                    (image, index) => (
                      <a
                        key={`${image.fileName}-${index}`}
                        href={`${API_URL}${image.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="overflow-hidden rounded-xl border"
                        style={{
                          borderColor:
                            "var(--border)",
                        }}
                      >
                        <img
                          src={`${API_URL}${image.fileUrl}`}
                          alt={
                            image.fileName
                          }
                          className="h-48 w-full object-cover"
                        />

                        <div className="p-3">
                          <p className="break-all text-sm font-medium">
                            {
                              image.fileName
                            }
                          </p>

                          <p
                            className="mt-1 text-xs"
                            style={{
                              color:
                                "var(--muted)",
                            }}
                          >
                            {formatFileSize(
                              image.fileSize
                            )}
                          </p>
                        </div>
                      </a>
                    )
                  )}

                </div>
              )}
            </section>

            {/* CUSTOMER NOTES */}

            <section className="mb-6">
              <h3 className="mb-3 text-lg font-bold">
                Customer Notes
              </h3>

              <div
                className="rounded-xl border p-4 text-sm whitespace-pre-wrap"
                style={{
                  borderColor:
                    "var(--border)",
                  color:
                    selectedQuote
                      .additionalNotes
                      ? "var(--foreground)"
                      : "var(--muted)",
                }}
              >
                {
                  selectedQuote.additionalNotes ||
                  "No additional notes."
                }
              </div>
            </section>

            {/* ADMIN UPDATE */}

            <section className="border-t pt-6"
              style={{
                borderColor:
                  "var(--border)",
              }}
            >
              <h3 className="mb-4 text-lg font-bold">
                Manage Quote
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* STATUS */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Status
                  </label>

                  <select
                    value={editStatus}
                    onChange={(event) =>
                      setEditStatus(
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border px-3 py-2.5 text-sm"
                    style={{
                      backgroundColor:
                        "var(--surface)",
                      borderColor:
                        "var(--border)",
                      color:
                        "var(--foreground)",
                    }}
                  >
                    {STATUS_OPTIONS.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {formatStatus(
                            status
                          )}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* PRICE */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Quoted Price (kr)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      editQuotedPrice
                    }
                    onChange={(event) =>
                      setEditQuotedPrice(
                        event.target.value
                      )
                    }
                    placeholder="Example: 499"
                    className="w-full rounded-lg border px-3 py-2.5 text-sm"
                    style={{
                      backgroundColor:
                        "var(--surface)",
                      borderColor:
                        "var(--border)",
                      color:
                        "var(--foreground)",
                    }}
                  />
                </div>

                {/* DELIVERY */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Estimated Delivery
                  </label>

                  <input
                    type="text"
                    value={
                      editEstimatedDelivery
                    }
                    onChange={(event) =>
                      setEditEstimatedDelivery(
                        event.target.value
                      )
                    }
                    placeholder="Example: 5-7 business days"
                    className="w-full rounded-lg border px-3 py-2.5 text-sm"
                    style={{
                      backgroundColor:
                        "var(--surface)",
                      borderColor:
                        "var(--border)",
                      color:
                        "var(--foreground)",
                    }}
                  />
                </div>

                {/* ADMIN NOTES */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Admin Notes
                  </label>

                  <textarea
                    value={
                      editAdminNotes
                    }
                    onChange={(event) =>
                      setEditAdminNotes(
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Internal notes about this quote..."
                    className="w-full rounded-lg border px-3 py-2.5 text-sm"
                    style={{
                      backgroundColor:
                        "var(--surface)",
                      borderColor:
                        "var(--border)",
                      color:
                        "var(--foreground)",
                    }}
                  />
                </div>

              </div>

              {/* ACTIONS */}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between">

                <button
                  type="button"
                  onClick={deleteQuote}
                  disabled={
                    deleting ||
                    saving
                  }
                  className="rounded-lg border px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
                  style={{
                    borderColor:
                      "#ef4444",
                    color:
                      "#dc2626",
                  }}
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete Quote"}
                </button>

                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={
                      closeQuote
                    }
                    disabled={
                      saving ||
                      deleting
                    }
                    className="rounded-lg border px-4 py-2.5 text-sm font-medium disabled:opacity-50"
                    style={{
                      borderColor:
                        "var(--border)",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      saveQuote
                    }
                    disabled={
                      saving ||
                      deleting
                    }
                    className="rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
                    style={{
                      backgroundColor:
                        "var(--foreground)",
                      color:
                        "var(--background)",
                    }}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Quote"}
                  </button>

                </div>

              </div>
            </section>

          </div>
        </div>
      )}
    </>
  );
}

