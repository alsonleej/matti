"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Minus, Plus } from "lucide-react";
import { formatPrice, type MenuItem } from "@/data/menu";
import { getReadySlots } from "@/lib/slots";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type OrderDialogProps = {
  item: MenuItem | null;
  onClose: () => void;
};

export function OrderDialog({ item, onClose }: OrderDialogProps) {
  return (
    <Dialog open={Boolean(item)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        showCloseButton
      >
        {item ? <OrderForm key={item.id} item={item} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function OrderForm({ item }: { item: MenuItem }) {
  const router = useRouter();
  const [slots] = useState(() => getReadySlots());
  const [name, setName] = useState("");
  const [desk, setDesk] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [slotIso, setSlotIso] = useState(slots[0]?.iso ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedSlot = slots.find((slot) => slot.iso === slotIso);
  const totalCents = item.priceCents * quantity;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedSlot) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          quantity,
          name,
          desk,
          readyBy: selectedSlot.iso,
          readyByLabel: selectedSlot.label,
          notes,
        }),
      });
      const payload = (await response.json()) as {
        order?: { id: string };
        error?: string;
      };

      if (!response.ok || !payload.order) {
        throw new Error(payload.error ?? "Could not place that order.");
      }

      router.push(`/order/${payload.order.id}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not place that order.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Order {item.name}</DialogTitle>
        <DialogDescription>
          We microwave this by hand and have it ready at your time. Pay{" "}
          {formatPrice(totalCents)} when you pick it up.
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
            {item.heatMinutes} min heat · {formatPrice(item.priceCents)} each
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
            placeholder="Alex Chen"
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

      <div className="grid gap-1.5">
        <Label>Ready by</Label>
        {slots.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pickup windows are open right now. Try again in the morning.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {slots.map((slot) => {
              const selected = slot.iso === slotIso;
              return (
                <button
                  key={slot.iso}
                  type="button"
                  onClick={() => setSlotIso(slot.iso)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    selected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background hover:bg-muted",
                  )}
                >
                  <span className="block text-xs text-muted-foreground">
                    {slot.dayLabel}
                  </span>
                  <span className="font-medium">{slot.timeLabel}</span>
                </button>
              );
            })}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Order at least 15 minutes ahead so we have time to heat it.
        </p>
      </div>

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

      <div className="grid gap-1.5">
        <Label htmlFor="order-notes">Note for the kitchen</Label>
        <Textarea
          id="order-notes"
          placeholder="No chili oil, extra napkins…"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          maxLength={280}
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <DialogFooter className="sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Total{" "}
          <span className="font-medium text-foreground">
            {formatPrice(totalCents)}
          </span>{" "}
          at pickup
        </p>
        <Button type="submit" disabled={submitting || slots.length === 0}>
          {submitting ? (
            <>
              <Loader2 className="animate-spin" />
              Sending
            </>
          ) : (
            "Submit order"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
