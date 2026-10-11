"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { formatPrice } from "@/data/menu";
import { PEOPLE } from "@/data/people";
import { asset } from "@/lib/asset";
import {
  hasRemoteOrders,
  listOrders,
  updateOrderStatus,
} from "@/lib/orders-client";
import { formatReadyBy } from "@/lib/time";
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

function nextStatus(status: Order["status"]): OrderStatus | null {
  if (status === "queued") return "heating";
  if (status === "heating") return "ready";
  if (status === "ready") return "picked_up";
  return null;
}

function nextLabel(status: Order["status"]) {
  if (status === "queued") return "Start heating";
  if (status === "heating") return "Mark ready";
  if (status === "ready") return "Picked up";
  return null;
}

export function KitchenBoard() {
  const [loaded, setLoaded] = useState<Order[] | null>(null);
  const orders = useMemo(() => loaded ?? [], [loaded]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]["id"]>(
    "all",
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoaded(await listOrders());
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Could not load orders.",
      );
    }
  }, []);

  useEffect(() => {
    const first = window.setTimeout(() => void load(), 0);
    const timer = window.setInterval(() => void load(), 8000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [load]);

  const heatOrders = useMemo(
    () => orders.filter((order) => order.kind === "heat"),
    [orders],
  );
  const stockRequests = useMemo(
    () => orders.filter((order) => order.kind === "stock"),
    [orders],
  );

  const visible = useMemo(() => {
    if (filter === "all") return heatOrders;
    return heatOrders.filter((order) => order.status === filter);
  }, [filter, heatOrders]);

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
    const active = heatOrders.filter((order) => order.status !== "picked_up");
    const people = new Set(orders.map((order) => order.name.toLowerCase()));
    const counts = new Map<string, number>();
    for (const order of orders) {
      counts.set(order.itemName, (counts.get(order.itemName) ?? 0) + order.quantity);
    }
    const popular = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return {
      total: heatOrders.length,
      active: active.length,
      requests: stockRequests.length,
      people: people.size,
      popular: popular ? `${popular[0]} (${popular[1]})` : "—",
    };
  }, [heatOrders, orders, stockRequests.length]);

  async function updateStatus(order: Order) {
    const status = nextStatus(order.status);
    if (!status) return;

    setUpdatingId(order.id);
    try {
      const updated = await updateOrderStatus(order, status);
      setLoaded((current) =>
        (current ?? []).map((entry) => (entry.id === order.id ? updated : entry)),
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
          Microwave today’s orders for the ready-by time. Stock requests below
          are demand for trays we don’t have in yet.
        </p>
        {!hasRemoteOrders ? (
          <p className="mt-3 max-w-2xl rounded-xl border border-dashed bg-card px-4 py-3 text-sm text-muted-foreground">
            Orders are saved in this browser only. Connect a shared Google
            Sheet (see README) to collect orders from everyone.
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Orders in" value={String(stats.total)} />
        <Stat label="Still to heat" value={String(stats.active)} />
        <Stat label="Stock requests" value={String(stats.requests)} />
        <Stat label="Colleagues" value={String(stats.people)} />
        <Stat label="Most wanted" value={stats.popular} />
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
      ) : loaded === null ? (
        <div className="rounded-2xl border bg-card px-6 py-16 text-center text-muted-foreground">
          Loading the board…
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
          <p className="font-heading text-lg">No heat orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Send /kisi, /standab, /bmb, or /chinsay. Incoming orders show up
            grouped by ready-by time.
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
                  const menuName = PEOPLE[order.personId]?.name ?? order.personId;
                  return (
                    <OrderRow
                      key={order.id}
                      order={order}
                      menuName={menuName}
                      action={action}
                      updating={updatingId === order.id}
                      onAction={() => void updateStatus(order)}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <section className="grid gap-3 border-t pt-8">
        <h2 className="font-heading text-2xl">Request to stock</h2>
        {stockRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No stock requests yet. These are trays people want us to buy next.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {stockRequests.map((order) => {
              const menuName = PEOPLE[order.personId]?.name ?? order.personId;
              return (
                <OrderRow
                  key={order.id}
                  order={order}
                  menuName={menuName}
                  action={null}
                  updating={false}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function OrderRow({
  order,
  menuName,
  action,
  updating,
  onAction,
}: {
  order: Order;
  menuName: string;
  action: string | null;
  updating: boolean;
  onAction?: () => void;
}) {
  const statusText =
    order.kind === "stock"
      ? "Requested"
      : STATUS_LABEL[order.status as OrderStatus];

  return (
    <Card className="sm:flex-row sm:items-center">
      <CardHeader className="sm:flex-row sm:items-center sm:gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image
            src={asset(order.itemImage)}
            alt={order.itemName}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{order.itemName}</CardTitle>
            <Badge variant="secondary">{statusText}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.quantity} × for {order.name} · {order.desk} · {menuName} ·{" "}
            {formatPrice(order.priceKr)} · {order.id}
          </p>
        </div>
      </CardHeader>
      <CardContent className="sm:ml-auto sm:w-auto">
        {action && onAction ? (
          <Button
            className="w-full sm:w-auto"
            disabled={updating}
            onClick={onAction}
          >
            {action}
          </Button>
        ) : order.kind === "stock" ? (
          <p className="text-sm text-muted-foreground">Interest</p>
        ) : (
          <p className="text-sm text-muted-foreground">Done</p>
        )}
      </CardContent>
    </Card>
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
