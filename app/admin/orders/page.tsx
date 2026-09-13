
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Product = {
  id: number;
  name: string;
  imageUrl?: string | null;
};

type OrderItem = {
  id: number;
  quantity: number;
  price: string | number;
  productName: string;
  productId: number;
  product?: Product | null;
  imageUrl?: string | null;
};

type Order = {
  id: number;
  customerName: string;
  email: string;
  phone?: string | null;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  total: string | number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

const statusOptions = [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
];

function formatPrice(value: string | number) {
  return `${Number(value).toFixed(2)} kr`;
}

function getProductImage(item: OrderItem) {
  /*
   * Support both possible API structures:
   *
   * item.product.imageUrl
   * OR
   * item.imageUrl
   */

  const imageUrl =
    item.product?.imageUrl ??
    item.imageUrl ??
    null;

  if (!imageUrl) {
    return null;
  }

  /*
   * If backend already returned a complete URL,
   * use it directly.
   */
  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  /*
   * Stored database value:
   *
   * /uploads/products/example.jpeg
   *
   * becomes:
   *
   * http://localhost:3001/uploads/products/example.jpeg
   */
  if (imageUrl.startsWith("/")) {
    return `${API_URL}${imageUrl}`;
  }

  /*
   * Fallback if database value doesn't start with /
   */
  return `${API_URL}/${imageUrl}`;
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

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchOrders(token);
  }, [router]);

  async function fetchOrders(token: string) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load orders");
      }

      const data = await response.json();

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    orderId: number,
    status: string
  ) {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      setUpdatingId(orderId);

      const response = await fetch(
        `${API_URL}/orders/${orderId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "Status update failed:",
          response.status,
          errorText
        );

        throw new Error("Failed to update order");
      }

      const updatedOrder = await response.json();

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? updatedOrder
            : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteOrder(orderId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/orders/${orderId}`,
        {
          method: "DELETE",

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
        throw new Error("Failed to delete order");
      }

      setOrders((currentOrders) =>
        currentOrders.filter(
          (order) => order.id !== orderId
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    }
  }

  const stats = useMemo(() => {
    const total = orders.length;

    const pending = orders.filter(
      (order) => order.status === "PENDING"
    ).length;

    const processing = orders.filter(
      (order) => order.status === "PROCESSING"
    ).length;

    const completed = orders.filter(
      (order) => order.status === "COMPLETED"
    ).length;

    /*
     * Revenue only includes COMPLETED orders.
     */
    const revenue = orders
      .filter(
        (order) => order.status === "COMPLETED"
      )
      .reduce(
        (sum, order) =>
          sum + Number(order.total || 0),
        0
      );

    return {
      total,
      pending,
      processing,
      completed,
      revenue,
    };
  }, [orders]);

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

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Orders
            </h1>

            <p
              className="mt-2 text-sm"
              style={{
                color: "var(--muted)",
              }}
            >
              Manage customer orders and order status.
            </p>
          </div>

          {/* STATS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {/* TOTAL ORDERS */}
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
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

              <p className="mt-2 text-2xl font-bold">
                {stats.total}
              </p>
            </div>

            {/* PENDING */}
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <p
                className="text-sm"
                style={{
                  color: "var(--muted)",
                }}
              >
                Pending
              </p>

              <p className="mt-2 text-2xl font-bold">
                {stats.pending}
              </p>
            </div>

            {/* PROCESSING */}
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
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

              <p className="mt-2 text-2xl font-bold">
                {stats.processing}
              </p>
            </div>

            {/* COMPLETED */}
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
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

              <p className="mt-2 text-2xl font-bold">
                {stats.completed}
              </p>
            </div>

            {/* REVENUE */}
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <p
                className="text-sm"
                style={{
                  color: "var(--muted)",
                }}
              >
                Revenue
              </p>

              <p className="mt-2 text-2xl font-bold">
                {formatPrice(stats.revenue)}
              </p>
            </div>

          </div>

          {/* ERROR */}
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

          {/* LOADING */}
          {loading ? (
            <div
              className="rounded-xl border p-10 text-center"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--muted)",
              }}
            >
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div
              className="rounded-xl border p-10 text-center"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <p className="text-lg font-semibold">
                No orders yet
              </p>

              <p
                className="mt-2 text-sm"
                style={{
                  color: "var(--muted)",
                }}
              >
                Customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">

              {orders.map((order) => (
                <section
                  key={order.id}
                  className="overflow-hidden rounded-xl border"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >

                  {/* ORDER HEADER */}
                  <div
                    className="flex flex-col gap-4 border-b p-6 lg:flex-row lg:items-center lg:justify-between"
                    style={{
                      borderColor: "var(--border)",
                    }}
                  >

                    <div>
                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-lg font-bold">
                          Order #{order.id}
                        </h2>

                        <span
                          className="rounded-full border px-3 py-1 text-xs font-medium"
                          style={{
                            borderColor:
                              "var(--border)",
                            color:
                              "var(--foreground)",
                            backgroundColor:
                              "var(--surface-secondary)",
                          }}
                        >
                          {getStatusLabel(
                            order.status
                          )}
                        </span>

                      </div>

                      <p
                        className="mt-2 text-sm"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        {new Date(
                          order.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                      {/* STATUS */}
                      <select
                        value={order.status}
                        disabled={
                          updatingId === order.id
                        }
                        onChange={(event) =>
                          updateStatus(
                            order.id,
                            event.target.value
                          )
                        }
                        className="rounded-lg border px-3 py-2 text-sm outline-none"
                        style={{
                          backgroundColor:
                            "var(--surface)",
                          color:
                            "var(--foreground)",
                          borderColor:
                            "var(--border)",
                        }}
                      >
                        {statusOptions.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {getStatusLabel(
                                status
                              )}
                            </option>
                          )
                        )}
                      </select>

                      {/* DELETE */}
                      <button
                        type="button"
                        onClick={() =>
                          deleteOrder(order.id)
                        }
                        className="rounded-lg border px-3 py-2 text-sm font-medium transition-opacity hover:opacity-70"
                        style={{
                          borderColor:
                            "var(--border)",
                          color:
                            "var(--foreground)",
                          backgroundColor:
                            "var(--surface)",
                        }}
                      >
                        Delete
                      </button>

                    </div>
                  </div>

                  {/* CUSTOMER */}
                  <div
                    className="grid gap-6 border-b p-6 md:grid-cols-2 lg:grid-cols-4"
                    style={{
                      borderColor: "var(--border)",
                    }}
                  >

                    {/* CUSTOMER NAME */}
                    <div>
                      <p
                        className="text-xs font-medium uppercase tracking-wide"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        Customer
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        {order.customerName}
                      </p>
                    </div>

                    {/* EMAIL */}
                    <div>
                      <p
                        className="text-xs font-medium uppercase tracking-wide"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        Email
                      </p>

                      <p className="mt-2 break-all text-sm">
                        {order.email}
                      </p>
                    </div>

                    {/* PHONE */}
                    <div>
                      <p
                        className="text-xs font-medium uppercase tracking-wide"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        Phone
                      </p>

                      <p className="mt-2 text-sm">
                        {order.phone || "—"}
                      </p>
                    </div>

                    {/* ADDRESS */}
                    <div>
                      <p
                        className="text-xs font-medium uppercase tracking-wide"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        Address
                      </p>

                      <p className="mt-2 text-sm">
                        {order.address},{" "}
                        {order.city},{" "}
                        {order.postalCode},{" "}
                        {order.country}
                      </p>
                    </div>

                  </div>

                  {/* PRODUCTS */}
                  <div className="p-6">

                    <div className="mb-4 flex items-center justify-between">

                      <h3 className="text-sm font-semibold">
                        Products
                      </h3>

                      <p
                        className="text-sm"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        {order.items.length}{" "}
                        {order.items.length === 1
                          ? "item"
                          : "items"}
                      </p>

                    </div>

                    <div className="space-y-3">

                      {order.items.map((item) => {
                        const imageUrl =
                          getProductImage(item);

                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 rounded-xl border p-3"
                            style={{
                              borderColor:
                                "var(--border)",
                              backgroundColor:
                                "var(--surface-secondary)",
                            }}
                          >

                            {/* PRODUCT IMAGE */}
                            <div
                              className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
                              style={{
                                backgroundColor:
                                  "var(--surface)",
                                borderColor:
                                  "var(--border)",
                              }}
                            >

                              {imageUrl ? (
                                <>
                                  <img
                                    src={imageUrl}
                                    alt={item.productName}
                                    className="h-full w-full object-cover"
                                    onError={(event) => {
                                      event.currentTarget.style.display =
                                        "none";

                                      const fallback =
                                        event.currentTarget
                                          .parentElement
                                          ?.querySelector(
                                            ".image-fallback"
                                          );

                                      if (
                                        fallback
                                      ) {
                                        fallback.classList.remove(
                                          "hidden"
                                        );
                                      }
                                    }}
                                  />

                                  <span
                                    className="image-fallback hidden px-2 text-center text-xs"
                                    style={{
                                      color:
                                        "var(--muted)",
                                    }}
                                  >
                                    Image unavailable
                                  </span>
                                </>
                              ) : (
                                <span
                                  className="image-fallback px-2 text-center text-xs"
                                  style={{
                                    color:
                                      "var(--muted)",
                                  }}
                                >
                                  No image
                                </span>
                              )}

                            </div>

                            {/* PRODUCT INFO */}
                            <div className="min-w-0 flex-1">

                              <p className="truncate text-sm font-semibold">
                                {item.productName}
                              </p>

                              <p
                                className="mt-1 text-sm"
                                style={{
                                  color:
                                    "var(--muted)",
                                }}
                              >
                                Quantity:{" "}
                                {item.quantity}
                              </p>

                            </div>

                            {/* PRICE */}
                            <div className="shrink-0 text-right">

                              <p className="text-sm font-semibold">
                                {formatPrice(
                                  Number(item.price) *
                                    item.quantity
                                )}
                              </p>

                              <p
                                className="mt-1 text-xs"
                                style={{
                                  color:
                                    "var(--muted)",
                                }}
                              >
                                {formatPrice(
                                  item.price
                                )}{" "}
                                each
                              </p>

                            </div>

                          </div>
                        );
                      })}

                    </div>

                    {/* TOTAL */}
                    <div
                      className="mt-6 flex items-center justify-between border-t pt-5"
                      style={{
                        borderColor:
                          "var(--border)",
                      }}
                    >

                      <span
                        className="text-sm font-medium"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        Order total
                      </span>

                      <span className="text-xl font-bold">
                        {formatPrice(order.total)}
                      </span>

                    </div>

                  </div>

                </section>
              ))}

            </div>
          )}

        </div>
      </main>
    </>
  );
}


