
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Product = {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: string | number;
  imageUrl?: string | null;
};

type Order = {
  id: number;
  customerName: string;
  email?: string;
  total: string | number;
  status: string;
  createdAt: string;
};

function formatPrice(value: string | number) {
  return `${Number(value || 0).toFixed(2)} kr`;
}

function getStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "PROCESSING":
      return "Processing";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status;
  }
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    loadDashboard(token);
  }, [router]);

  async function loadDashboard(token: string) {
    try {
      setLoading(true);
      setError("");

      const [productsResponse, ordersResponse] =
        await Promise.all([
          fetch(`${API_URL}/products`, {
            cache: "no-store",
          }),

          fetch(`${API_URL}/orders`, {
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      if (ordersResponse.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
        return;
      }

      if (!productsResponse.ok) {
        throw new Error("Failed to load products");
      }

      if (!ordersResponse.ok) {
        throw new Error("Failed to load orders");
      }

      const productsData = await productsResponse.json();
      const ordersData = await ordersResponse.json();

      setProducts(
        Array.isArray(productsData)
          ? productsData
          : []
      );

      setOrders(
        Array.isArray(ordersData)
          ? ordersData
          : []
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load dashboard data. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const statistics = useMemo(() => {
    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (order) => order.status === "PENDING"
    ).length;

    const processingOrders = orders.filter(
      (order) => order.status === "PROCESSING"
    ).length;

    const completedOrders = orders.filter(
      (order) => order.status === "COMPLETED"
    ).length;

    const cancelledOrders = orders.filter(
      (order) => order.status === "CANCELLED"
    ).length;

    const completedRevenue = orders
      .filter(
        (order) => order.status === "COMPLETED"
      )
      .reduce(
        (sum, order) =>
          sum + Number(order.total || 0),
        0
      );

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      completedRevenue,
    };
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [orders]);

  function getStatusStyle(status: string) {
    switch (status) {
      case "PENDING":
        return {
          backgroundColor: "#fef3c7",
          color: "#92400e",
        };

      case "PROCESSING":
        return {
          backgroundColor: "#dbeafe",
          color: "#1e40af",
        };

      case "COMPLETED":
        return {
          backgroundColor: "#dcfce7",
          color: "#166534",
        };

      case "CANCELLED":
        return {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
        };

      default:
        return {
          backgroundColor: "var(--surface-secondary)",
          color: "var(--foreground)",
        };
    }
  }

  return (
    <>
      <AdminNav />

      <main
        className="min-h-screen px-6 py-10"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <div className="mx-auto max-w-7xl">

          {/* =========================
              HEADER
          ========================== */}

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard
            </h1>

            <p
              className="mt-2 text-sm"
              style={{
                color: "var(--muted)",
              }}
            >
              Overview of your RD nordform AB store.
            </p>
          </div>

          {/* =========================
              ERROR
          ========================== */}

          {error && (
            <div
              className="mb-6 rounded-xl border p-4 text-sm"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              {error}
            </div>
          )}

          {/* =========================
              LOADING
          ========================== */}

          {loading ? (
            <div
              className="rounded-xl border p-10 text-center"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--muted)",
              }}
            >
              Loading dashboard...
            </div>
          ) : (
            <>
              {/* =========================
                  STATISTICS
              ========================== */}

              <section className="mb-10">
                <h2 className="mb-4 text-xl font-bold">
                  Store Overview
                </h2>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  {/* Products */}

                  <div
                    className="rounded-xl border p-6"
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
                        color: "var(--muted)",
                      }}
                    >
                      Total Products
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {products.length}
                    </p>

                    <p
                      className="mt-2 text-xs"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      Products currently in your store
                    </p>
                  </div>

                  {/* Orders */}

                  <div
                    className="rounded-xl border p-6"
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
                        color: "var(--muted)",
                      }}
                    >
                      Total Orders
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {statistics.totalOrders}
                    </p>

                    <p
                      className="mt-2 text-xs"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      All customer orders
                    </p>
                  </div>

                  {/* Pending */}

                  <div
                    className="rounded-xl border p-6"
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
                        color: "var(--muted)",
                      }}
                    >
                      Pending Orders
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {statistics.pendingOrders}
                    </p>

                    <p
                      className="mt-2 text-xs"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      Waiting to be processed
                    </p>
                  </div>

                  {/* Processing */}

                  <div
                    className="rounded-xl border p-6"
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
                        color: "var(--muted)",
                      }}
                    >
                      Processing
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {statistics.processingOrders}
                    </p>

                    <p
                      className="mt-2 text-xs"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      Orders currently being prepared
                    </p>
                  </div>

                  {/* Completed */}

                  <div
                    className="rounded-xl border p-6"
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
                        color: "var(--muted)",
                      }}
                    >
                      Completed
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {statistics.completedOrders}
                    </p>

                    <p
                      className="mt-2 text-xs"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      Successfully completed orders
                    </p>
                  </div>

                  {/* Revenue */}

                  <div
                    className="rounded-xl border p-6"
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
                        color: "var(--muted)",
                      }}
                    >
                      Completed Revenue
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {formatPrice(
                        statistics.completedRevenue
                      )}
                    </p>

                    <p
                      className="mt-2 text-xs"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      Revenue from completed orders
                    </p>
                  </div>
                </div>
              </section>

              {/* =========================
                  QUICK ACTIONS
              ========================== */}

              <section className="mb-10">
                <h2 className="mb-4 text-xl font-bold">
                  Quick Actions
                </h2>

                <div className="grid gap-4 md:grid-cols-3">

                  {/* Manage Products */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/admin/products")
                    }
                    className="rounded-xl border p-6 text-left transition-all hover:-translate-y-0.5 hover:opacity-80"
                    style={{
                      backgroundColor:
                        "var(--surface)",
                      borderColor:
                        "var(--border)",
                    }}
                  >
                    <div className="mb-3 text-2xl">
                      🛍️
                    </div>

                    <h3 className="text-lg font-bold">
                      Manage Products
                    </h3>

                    <p
                      className="mt-2 text-sm"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      Add, edit, delete and manage
                      product images.
                    </p>
                  </button>

                  {/* Manage Orders */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/admin/orders")
                    }
                    className="rounded-xl border p-6 text-left transition-all hover:-translate-y-0.5 hover:opacity-80"
                    style={{
                      backgroundColor:
                        "var(--surface)",
                      borderColor:
                        "var(--border)",
                    }}
                  >
                    <div className="mb-3 text-2xl">
                      📦
                    </div>

                    <h3 className="text-lg font-bold">
                      Manage Orders
                    </h3>

                    <p
                      className="mt-2 text-sm"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      View orders, update status and
                      manage customer purchases.
                    </p>
                  </button>

                  {/* Customer Print Quotes */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/admin/quotes")
                    }
                    className="rounded-xl border p-6 text-left transition-all hover:-translate-y-0.5 hover:opacity-80"
                    style={{
                      backgroundColor:
                        "var(--surface)",
                      borderColor:
                        "var(--border)",
                    }}
                  >
                    <div className="mb-3 text-2xl">
                      🖨️
                    </div>

                    <h3 className="text-lg font-bold">
                      Customer Print Quotes
                    </h3>

                    <p
                      className="mt-2 text-sm"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      View customer 3D print requests,
                      files and quote details.
                    </p>
                  </button>
                </div>
              </section>

              {/* =========================
                  RECENT ORDERS
              ========================== */}

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      Recent Orders
                    </h2>

                    <p
                      className="mt-1 text-sm"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      Your five most recent customer
                      orders.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      router.push("/admin/orders")
                    }
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition-opacity hover:opacity-70"
                    style={{
                      borderColor:
                        "var(--border)",
                      backgroundColor:
                        "var(--surface)",
                    }}
                  >
                    View All
                  </button>
                </div>

                {recentOrders.length === 0 ? (
                  <div
                    className="rounded-xl border p-8 text-center"
                    style={{
                      backgroundColor:
                        "var(--surface)",
                      borderColor:
                        "var(--border)",
                      color: "var(--muted)",
                    }}
                  >
                    No orders yet.
                  </div>
                ) : (
                  <div
                    className="overflow-hidden rounded-xl border"
                    style={{
                      backgroundColor:
                        "var(--surface)",
                      borderColor:
                        "var(--border)",
                    }}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px] text-left">
                        <thead>
                          <tr
                            className="border-b"
                            style={{
                              borderColor:
                                "var(--border)",
                            }}
                          >
                            <th className="px-5 py-4 text-sm font-semibold">
                              Order
                            </th>

                            <th className="px-5 py-4 text-sm font-semibold">
                              Customer
                            </th>

                            <th className="px-5 py-4 text-sm font-semibold">
                              Date
                            </th>

                            <th className="px-5 py-4 text-sm font-semibold">
                              Total
                            </th>

                            <th className="px-5 py-4 text-sm font-semibold">
                              Status
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {recentOrders.map(
                            (order) => (
                              <tr
                                key={order.id}
                                className="border-b last:border-b-0"
                                style={{
                                  borderColor:
                                    "var(--border)",
                                }}
                              >
                                <td className="px-5 py-4">
                                  <span className="font-semibold">
                                    #{order.id}
                                  </span>
                                </td>

                                <td className="px-5 py-4">
                                  <div>
                                    <p className="font-medium">
                                      {
                                        order.customerName
                                      }
                                    </p>

                                    {order.email && (
                                      <p
                                        className="mt-1 text-xs"
                                        style={{
                                          color:
                                            "var(--muted)",
                                        }}
                                      >
                                        {order.email}
                                      </p>
                                    )}
                                  </div>
                                </td>

                                <td
                                  className="px-5 py-4 text-sm"
                                  style={{
                                    color:
                                      "var(--muted)",
                                  }}
                                >
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                </td>

                                <td className="px-5 py-4 font-medium">
                                  {formatPrice(
                                    order.total
                                  )}
                                </td>

                                <td className="px-5 py-4">
                                  <span
                                    className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                                    style={getStatusStyle(
                                      order.status
                                    )}
                                  >
                                    {getStatusLabel(
                                      order.status
                                    )}
                                  </span>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}

