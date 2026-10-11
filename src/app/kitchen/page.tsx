import { Suspense } from "react";
import type { Metadata } from "next";
import { KitchenBoard } from "@/components/kitchen-board";
import { SiteHeader } from "@/components/site-header";
import { listOrders } from "@/lib/orders-store";

export const metadata: Metadata = {
  title: "Kitchen · Mätti",
  description: "Incoming microwave orders grouped by ready-by time.",
};

export default function KitchenPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader kitchen />
      <main className="flex flex-1 flex-col">
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center text-muted-foreground sm:px-6">
              Loading the board…
            </div>
          }
        >
          <KitchenLoader />
        </Suspense>
      </main>
    </div>
  );
}

async function KitchenLoader() {
  const orders = await listOrders();
  return <KitchenBoard initialOrders={orders} />;
}
