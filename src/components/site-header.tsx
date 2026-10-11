import Link from "next/link";
import { Microwave } from "lucide-react";

export function SiteHeader({ kitchen = false }: { kitchen?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Microwave className="size-4" />
          </span>
          <span className="font-heading text-lg tracking-tight">Heat Check</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Menu
          </Link>
          <Link
            href="/kitchen"
            className={`rounded-lg px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground ${
              kitchen ? "bg-muted text-foreground" : "text-muted-foreground"
            }`}
          >
            Kitchen
          </Link>
        </nav>
      </div>
    </header>
  );
}
