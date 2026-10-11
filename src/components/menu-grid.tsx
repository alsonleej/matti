"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import { formatPrice, type MenuItem, type MenuTag } from "@/data/menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderDialog } from "@/components/order-dialog";
import { cn } from "@/lib/utils";

const FILTERS: { id: "all" | MenuTag; label: string }[] = [
  { id: "all", label: "All" },
  { id: "value", label: "Under $5" },
  { id: "veg", label: "Vegetarian" },
  { id: "spicy", label: "Spicy" },
];

function tagLabel(tag: MenuTag) {
  if (tag === "veg") return "Veg";
  if (tag === "spicy") return "Spicy";
  return "Under $5";
}

export function MenuGrid({ items }: { items: MenuItem[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [selected, setSelected] = useState<MenuItem | null>(null);

  const visible = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.tags.includes(filter));
  }, [filter, items]);

  return (
    <section id="menu" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Today’s microwave menu</p>
          <h2 className="font-heading mt-1 text-3xl tracking-tight sm:text-4xl">
            Pick a meal, pick a time
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((option) => (
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
      </div>

      {visible.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
          <p className="font-heading text-lg">Nothing in that filter</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try All, or another tag.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <Card key={item.id} className="pt-0">
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-background/90 backdrop-blur-sm"
                    >
                      {tagLabel(tag)}
                    </Badge>
                  ))}
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>{item.name}</CardTitle>
                  <p className="font-heading text-lg">{formatPrice(item.priceCents)}</p>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  {item.heatMinutes} min in the microwave
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setSelected(item)}>
                  Order for a time
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <OrderDialog item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
