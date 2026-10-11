import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="font-heading text-3xl tracking-tight">
          That page isn’t on Mätti
        </h1>
        <p className="mt-3 text-muted-foreground">
          The order or page you asked for isn’t here. Head back to the board
          and pick something else.
        </p>
        <Button className="mt-6" nativeButton={false} render={<Link href="/" />}>
          Back to the menu
        </Button>
      </main>
    </div>
  );
}
