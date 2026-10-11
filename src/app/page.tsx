import type { ReactNode } from "react";
import Link from "next/link";
import { Clock, Microwave, Users } from "lucide-react";
import { MENU } from "@/data/menu";
import { MenuGrid } from "@/components/menu-grid";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-[linear-gradient(180deg,oklch(0.96_0.03_75),transparent)]">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Office interest check · not a real vending machine
              </p>
              <h1 className="font-heading mt-4 max-w-xl text-4xl leading-tight tracking-tight sm:text-5xl">
                Microwaveable lunch, ready at the time you pick.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                The original idea was a vending machine that heats food when you
                order. Before we sink money into that, we’re running it by hand:
                you order here, we microwave it, you pick it up hot.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" render={<Link href="#menu" />}>
                  See the menu
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<Link href="/kitchen" />}
                >
                  Kitchen board
                </Button>
              </div>
            </div>
            <ol className="grid gap-3">
              <Step
                icon={<Users className="size-4" />}
                title="Order from this page"
                body="Picture, price, your name, and a ready-by slot. That’s the whole form."
              />
              <Step
                icon={<Microwave className="size-4" />}
                title="We heat it"
                body="Whoever is on kitchen duty microwaves the tray before your time."
              />
              <Step
                icon={<Clock className="size-4" />}
                title="Grab it when it’s due"
                body="Pay at pickup. If people actually order, we’ll know the machine is worth buying."
              />
            </ol>
          </div>
        </section>
        <MenuGrid items={MENU} />
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Heat Check · a manual stand-in for a heat-up vending machine
      </footer>
    </div>
  );
}

function Step({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-3 rounded-2xl border bg-card p-4">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}
