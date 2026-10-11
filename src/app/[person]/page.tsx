import { notFound } from "next/navigation";
import {
  getAvailableToday,
  getPerson,
  getRequestToStock,
  PERSON_IDS,
} from "@/data/people";
import { MenuGrid } from "@/components/menu-grid";
import { SiteHeader } from "@/components/site-header";

export function generateStaticParams() {
  return PERSON_IDS.map((person) => ({ person }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ person: string }>;
}) {
  const { person: id } = await params;
  const person = getPerson(id);
  if (!person) return { title: "Mätti" };
  return {
    title: `${person.name} · Mätti`,
    description: `Order today’s ICA / Convini trays, or request what ${person.name} wants stocked.`,
  };
}

export default async function PersonMenuPage({
  params,
}: {
  params: Promise<{ person: string }>;
}) {
  const { person: id } = await params;
  const person = getPerson(id);
  if (!person) notFound();

  const available = getAvailableToday(person);
  const request = getRequestToStock(person);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader personId={person.id} />
      <main className="flex-1">
        <section className="border-b bg-[linear-gradient(180deg,oklch(0.96_0.03_75),transparent)]">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
            <p className="text-sm font-medium text-primary">{person.name}’s menu</p>
            <h1 className="font-heading mt-2 max-w-2xl text-4xl leading-tight tracking-tight sm:text-5xl">
              What’s in today, and what we should stock.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Frozen ICA / Convini meals, 45–60 kr. Order from the cabinet
              above and we’ll microwave it for your time. Request anything
              below if you want it in next.
            </p>
          </div>
        </section>
        <MenuGrid person={person} available={available} request={request} />
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Mätti · {person.name} · /{person.id}
      </footer>
    </div>
  );
}
