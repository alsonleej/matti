import type { Metadata } from "next";
import { KitchenBoard } from "@/components/kitchen-board";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Kitchen · Mätti",
  description: "Incoming microwave orders grouped by ready-by time.",
};

export default function KitchenPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader kitchen />
      <main className="flex flex-1 flex-col">
        <KitchenBoard />
      </main>
    </div>
  );
}
