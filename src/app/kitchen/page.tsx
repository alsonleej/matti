import type { Metadata } from "next";
import { KitchenBoard } from "@/components/kitchen-board";
import { SiteHeader } from "@/components/site-header";
import { listOrders } from "@/lib/orders-store";

export const metadata: Metadata = {
  title: "Kitchen · Mätti",
  description: "Incoming microwave orders grouped by ready-by time.",
};

export default async function KitchenPage() {
  const orders = await listOrders();

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader kitchen />
      <main className="flex flex-1 flex-col">
        <KitchenBoard initialOrders={orders} />
      </main>
    </div>
  );
}
