"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { formatPrice } from "@/data/menu";
import { formatReadyBy } from "@/lib/slots";
import type { Order, OrderStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { id: "all" | OrderStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "queued", label: "Queued" },
  { id: "heating", label: "Heating" },
  { id: "ready", label: "Ready" },
  { id: "picked_up", label: "Picked up" },
];

const STATUS_LABEL: Record<OrderStatus, string> = {
  queued: "Queued",
  heating: "Heating",
  ready: "Ready",
  picked_up: "Picked up",
};

function nextStatus(status: OrderStatus): OrderStatus | null {
  if (status === "queued") return "heating";
  if (status === "heating") return "ready";
  if (status === "ready") return "picked_up";
  return null;
}

function nextLabel(status: OrderStatus) {
  if (status === "queued") return "Start heating";
  if (status === "heating") return "Mark ready";
  if (status === "ready") return "Picked up";
  return null;
}

export function KitchenBoard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]["id"]>(
    "all",
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/orders", { cache: "no-store" });
      const payload = (await response.json()) as {
        orders?: Order[];
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not load orders.");
      }
      setOrders(payload.orders ?? []);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Could not load orders.",
      );
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void load();
    }, 8000);
    return () => window.clearInterval(timer);
  }, [load]);

  const visible = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((order) => order.status === filter);
  }, [filter, orders]);

  const grouped = useMemo(() => {
    const groups = new Map<string, Order[]>();
    for (const order of visible) {
      const key = order.readyByLabel || formatReadyBy(order.readyBy);
      const list = groups.get(key) ?? [];
      list.push(order);
      groups.set(key, list);
    }
    return [...groups.entries()];
  }, [visible]);

  const stats = useMemo(() => {
    const list = orders;
    const active = list.filter((order) => order.status !== "picked_up");
    const people = new Set(list.map((order) => order.name.toLowerCase()));
    const counts = new Map<string, number>();
    for (const order of list) {
      counts.set(order.itemName, (counts.get(order.itemName) ?? 0) + order.quantity);
    }
    const popular = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return {
      total: list.length,
      active: active.length,
      people: people.size,
      popular: popular ? `${popular[0]} (${popular[1]})` : "—",
    };
  }, [orders]);

  async function updateStatus(order: Order) {
    const status = nextStatus(order.status);
    if (!status) return;

    setUpdatingId(order.id);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = (await response.json()) as {
        order?: Order;
        error?: string;
      };
      if (!response.ok || !payload.order) {
        throw new Error(payload.error ?? "Could not update that order.");
      }
      setOrders((current) =>
        current.map((entry) => (entry.id === order.id ? payload.order! : entry)),
      );
      toast.success(`${order.itemName} → ${STATUS_LABEL[status]}`);
    } catch (updateError) {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : "Could not update that order.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <div>
        <p className="text-sm font-medium text-primary">Operator board</p>
        <h1 className="font-heading mt-1 text-3xl tracking-tight sm:text-4xl">
          Heat what’s coming
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          When someone orders, microwave it and have it ready at their time.
          This board is how we run the trial without a vending machine.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Orders in" value={String(stats.total)} />
        <Stat label="Still to handle" value={String(stats.active)} />
        <Stat label="Colleagues" value={String(stats.people)} />
        <Stat label="Most ordered" value={stats.popular} />
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              filter === option.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-6 py-10 text-center">
          <p className="font-heading text-lg">Couldn’t load orders</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={() => void load()}>
            Try again
          </Button>
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
          <p className="font-heading text-lg">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Share the menu with the office. Incoming orders show up here grouped
            by ready-by time.
          </p>
        </div>
      ) : (
        <div className="grid gap-8">
          {grouped.map(([label, group]) => (
            <section key={label} className="grid gap-3">
              <h2 className="font-heading text-xl">{label}</h2>
              <div className="grid gap-3">
                {group.map((order) => {
                  const action = nextLabel(order.status);
                  return (
                    <Card key={order.id} className="sm:flex-row sm:items-center">
                      <CardHeader className="sm:flex-row sm:items-center sm:gap-4">
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={order.itemImage}
                            alt={order.itemName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <CardTitle>{order.itemName}</CardTitle>
                            <Badge variant="secondary">
                              {STATUS_LABEL[order.status]}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {order.quantity} × for {order.name} · {order.desk} ·{" "}
                            {formatPrice(order.priceCents)} · {order.id}
                          </p>
                          {order.notes ? (
                            <p className="mt-1 text-sm">Note: {order.notes}</p>
                          ) : null}
                        </div>
                      </CardHeader>
                      <CardContent className="sm:ml-auto sm:w-auto">
                        {action ? (
                          <Button
                            className="w-full sm:w-auto"
                            disabled={updatingId === order.id}
                            onClick={() => void updateStatus(order)}
                          >
                            {action}
                          </Button>
                        ) : (
                          <p className="text-sm text-muted-foreground">Done</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card px-4 py-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="font-heading mt-1 truncate text-2xl">{value}</p>
    </div>
  );
}
