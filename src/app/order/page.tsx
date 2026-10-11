import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/order-confirmation";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Order · Mätti",
};

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full flex-col">
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-lg flex-1 items-center justify-center px-4 text-muted-foreground">
            Loading order…
          </main>
        </div>
      }
    >
      <OrderConfirmation />
    </Suspense>
  );
}
