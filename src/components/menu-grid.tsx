"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import { type MenuItem, type MenuTag } from "@/data/menu";
import type { PersonMenu } from "@/data/people";
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
import { asset } from "@/lib/asset";

function tagLabel(tag: MenuTag) {
  if (tag === "veg") return "Veg";
  return "Spicy";
}

type MenuGridProps = {
  person: PersonMenu;
  available: MenuItem[];
  request: MenuItem[];
};

export function MenuGrid({ person, available, request }: MenuGridProps) {
  const [selected, setSelected] = useState<{
    item: MenuItem;
    kind: "heat" | "stock";
  } | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-10 sm:px-6 sm:py-14">
      <MenuSection
        id="available"
        kicker="Available today"
        title="In the cabinet — we’ll heat it"
        empty="Nothing on today’s shelf for this menu."
        items={available}
        action="Order"
        onSelect={(item) => setSelected({ item, kind: "heat" })}
      />
      <MenuSection
        id="request"
        kicker="Request to stock"
        title="Not in today. Want it next?"
        empty="No extra trays on the request list."
        items={request}
        action="Request to stock"
        onSelect={(item) => setSelected({ item, kind: "stock" })}
      />
      <OrderDialog
        item={selected?.item ?? null}
        kind={selected?.kind ?? "heat"}
        person={person}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function MenuSection({
  id,
  kicker,
  title,
  empty,
  items = [],
  action,
  onSelect,
}: {
  id: string;
  kicker: string;
  title: string;
  empty: string;
  items?: MenuItem[];
  action: string;
  onSelect: (item: MenuItem) => void;
}) {
  return (
    <section id={id}>
      <p className="text-sm font-medium text-primary">{kicker}</p>
      <h2 className="font-heading mt-1 text-3xl tracking-tight sm:text-4xl">
        {title}
      </h2>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
          <p className="font-heading text-lg">{empty}</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="pt-0">
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={asset(item.image)}
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
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  {item.heatMinutes} min in the microwave
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => onSelect(item)}>
                  {action}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
