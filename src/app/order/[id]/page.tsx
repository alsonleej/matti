import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, MapPin, Microwave } from "lucide-react";
import { formatPrice } from "@/data/menu";
import { getOrder } from "@/lib/orders-store";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center gap-2 text-primary">
          <CheckCircle2 className="size-5" />
          <p className="text-sm font-medium">Order received</p>
        </div>
        <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
          We’ll have it hot by {order.readyByLabel}.
        </h1>
        <p className="mt-3 text-muted-foreground">
          {order.name}, this is your interest-check order. Someone on kitchen
          duty will microwave it by hand — no vending machine, just the test.
        </p>

        <Card className="mt-8 pt-0">
          <div className="relative aspect-[16/9] bg-muted">
            <Image
              src={order.itemImage}
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
                {formatPrice(order.priceCents)}
              </p>
            </div>
            <ul className="grid gap-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                Ready by {order.readyByLabel}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                Pickup for {order.desk}
              </li>
              <li className="flex items-center gap-2">
                <Microwave className="size-4 text-primary" />
                Pay at pickup · cash or office Venmo
              </li>
            </ul>
            {order.notes ? (
              <p className="rounded-lg bg-muted px-3 py-2 text-sm">
                Kitchen note: {order.notes}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" render={<Link href="/" />}>
            Order something else
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            render={<Link href="/kitchen" />}
          >
            View kitchen board
          </Button>
        </div>
      </main>
    </div>
  );
}
