import Link from "next/link";
import { PERSON_IDS, PEOPLE } from "@/data/people";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <p className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          Office interest check · not a real vending machine
        </p>
        <h1 className="font-heading mt-4 text-4xl leading-tight tracking-tight sm:text-5xl">
          Mätti
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          ICA and Convini frozen trays, heated by hand. Open your link, order
          what’s in today, or request what we should stock next. 45–60 kr, pay
          at pickup.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {PERSON_IDS.map((id) => {
            const person = PEOPLE[id];
            return (
              <li key={id}>
                <Button
                  className="h-auto w-full flex-col items-start gap-1 px-4 py-4 text-left"
                  variant="outline"
                  render={<Link href={`/${id}`} />}
                >
                  <span className="font-heading text-lg">{person.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    /{id}
                  </span>
                </Button>
              </li>
            );
          })}
        </ul>
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Mätti · a manual stand-in for a heat-up vending machine
      </footer>
    </div>
  );
}
