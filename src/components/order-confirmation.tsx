"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, MapPin, Microwave } from "lucide-react";
import { formatPrice } from "@/data/menu";
import { asset } from "@/lib/asset";
import { getLocalOrder, hasRemoteOrders, listOrders } from "@/lib/orders-client";
import type { Order } from "@/lib/types";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type LookupState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "found"; order: Order };

export function OrderConfirmation() {
  const id = useSearchParams().get("id") ?? "";
  const [state, setState] = useState<LookupState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      let order = getLocalOrder(id);
      if (!order && hasRemoteOrders) {
        try {
          order = (await listOrders()).find((entry) => entry.id === id) ?? null;
        } catch {
          order = null;
        }
      }
      if (!cancelled) {
        setState(order ? { status: "found", order } : { status: "missing" });
      }
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [id]);

  if (state.status === "loading") {
    return (
      <div className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-lg flex-1 items-center justify-center px-4 text-muted-foreground">
          Loading order…
        </main>
      </div>
    );
  }

  if (state.status === "missing") {
    return (
      <div className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-4 py-12 text-center">
          <h1 className="font-heading text-3xl tracking-tight">
            We can’t find that order
          </h1>
          <p className="text-muted-foreground">
            It may have been placed on another device. Ask whoever runs the
            microwave, or order again.
          </p>
          <Button nativeButton={false} render={<Link href="/" />}>
            Back to Mätti
          </Button>
        </main>
      </div>
    );
  }

  const { order } = state;
  const isHeat = order.kind === "heat";

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader personId={order.personId} />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center gap-2 text-primary">
          <CheckCircle2 className="size-5" />
          <p className="text-sm font-medium">
            {isHeat ? "Order received" : "Stock request received"}
          </p>
        </div>
        <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
          {isHeat
            ? `We’ll have it hot by ${order.readyByLabel}.`
            : "We’ll count this toward the next cabinet."}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {isHeat
            ? `${order.name}, this is a Mätti trial order. Someone will microwave the tray by hand.`
            : `${order.name}, this tray isn’t in today. If enough people request it, we’ll stock it.`}
        </p>

        <Card className="mt-8 pt-0">
          <div className="relative aspect-[16/9] bg-muted">
            <Image
              src={asset(order.itemImage)}
              alt={order.itemName}
              fill
              className="object-cover"
              priority
            />
          </div>
          <CardContent className="grid gap-4 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-xl">{order.itemName}</p>
                <p className="text-sm text-muted-foreground">
                  Qty {order.quantity} · {order.id}
                </p>
              </div>
              <p className="font-heading text-xl">
                {formatPrice(order.priceKr)}
              </p>
            </div>
            <ul className="grid gap-2 text-sm">
              {isHeat ? (
                <li className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  Ready by {order.readyByLabel}
                </li>
              ) : null}
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                {order.desk}
              </li>
              <li className="flex items-center gap-2">
                <Microwave className="size-4 text-primary" />
                {isHeat
                  ? "Pay with Swish at pickup"
                  : "No charge until we stock it"}
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            className="flex-1"
            nativeButton={false}
            render={<Link href={`/${order.personId}`} />}
          >
            Back to the menu
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            nativeButton={false}
            render={<Link href="/kitchen" />}
          >
            View kitchen board
          </Button>
        </div>
      </main>
    </div>
  );
}
