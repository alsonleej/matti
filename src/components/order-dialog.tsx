"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Minus, Plus } from "lucide-react";
import { formatPrice, type MenuItem } from "@/data/menu";
import type { PersonMenu } from "@/data/people";
import { defaultReadyAt, formatReadyLabel } from "@/lib/time";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimeField } from "@/components/time-field";

type OrderDialogProps = {
  item: MenuItem | null;
  kind: "heat" | "stock";
  person: PersonMenu;
  onClose: () => void;
};

export function OrderDialog({ item, kind, person, onClose }: OrderDialogProps) {
  return (
    <Dialog open={Boolean(item)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        showCloseButton
      >
        {item ? (
          <OrderForm key={`${kind}-${item.id}`} item={item} kind={kind} person={person} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function OrderForm({
  item,
  kind,
  person,
}: {
  item: MenuItem;
  kind: "heat" | "stock";
  person: PersonMenu;
}) {
  const router = useRouter();
  const [name, setName] = useState(person.name);
  const [desk, setDesk] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [readyAt, setReadyAt] = useState(() => defaultReadyAt());
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalKr = item.priceKr * quantity;
  const isHeat = kind === "heat";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          personId: person.id,
          itemId: item.id,
          quantity,
          name,
          desk,
          readyBy: isHeat ? readyAt.toISOString() : undefined,
          readyByLabel: isHeat ? formatReadyLabel(readyAt) : undefined,
        }),
      });
      const payload = (await response.json()) as {
        order?: { id: string };
        error?: string;
      };

      if (!response.ok || !payload.order) {
        throw new Error(payload.error ?? "Could not send that.");
      }

      router.push(`/order/${payload.order.id}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not send that.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>
          {isHeat ? `Order ${item.name}` : `Request ${item.name}`}
        </DialogTitle>
        <DialogDescription>
          {isHeat
            ? `We’ll microwave this by hand and have it ready at your time. Pay ${formatPrice(totalKr)} at pickup.`
            : `Not in today’s cabinet. Requesting it tells us to stock this ICA / Convini tray next.`}
        </DialogDescription>
      </DialogHeader>

      <div className="flex gap-3 rounded-xl bg-muted/60 p-2">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0 py-1">
          <p className="font-heading text-base">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            {item.heatMinutes} min heat · {formatPrice(item.priceKr)}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="order-name">Your name</Label>
          <Input
            id="order-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="order-desk">Desk, floor, or Slack</Label>
          <Input
            id="order-desk"
            name="desk"
            placeholder="3rd floor / @alex"
            value={desk}
            onChange={(event) => setDesk(event.target.value)}
            required
          />
        </div>
      </div>

      {isHeat ? (
        <div className="grid gap-1.5">
          <Label htmlFor="order-time">Ready by</Label>
          <TimeField value={readyAt} onChange={setReadyAt} />
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <Label>Quantity</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus />
          </Button>
          <span className="w-6 text-center text-sm font-medium">{quantity}</span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setQuantity((value) => Math.min(3, value + 1))}
            disabled={quantity >= 3}
            aria-label="Increase quantity"
          >
            <Plus />
          </Button>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <DialogFooter className="sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {formatPrice(totalKr)}
          {isHeat ? " at pickup" : " if we stock it"}
        </p>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="animate-spin" />
              Sending
            </>
          ) : isHeat ? (
            "Submit order"
          ) : (
            "Request to stock"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
