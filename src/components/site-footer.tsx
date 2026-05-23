import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="mt-16 w-full border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 text-sm sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="font-heading text-base font-semibold tracking-tight text-foreground">
            Field Notes
          </div>
          <p className="text-muted-foreground">
            © 2026 {SITE_CONFIG.author.name} / Drew Digital
          </p>
          <p className="text-muted-foreground">
            Field Notes is built in public — repo:{" "}
            <Link
              href="https://github.com/kartparash-cmd/fieldnotes"
              className="underline-offset-4 hover:text-foreground hover:underline"
            >
              github.com/kartparash-cmd/fieldnotes
            </Link>
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm md:items-end">
          <span className="text-xs uppercase tracking-wide text-muted-foreground/70">
            Elsewhere
          </span>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <Link
              href={SITE_CONFIG.author.github || "#"}
              className="hover:text-foreground"
            >
              GitHub
            </Link>
            <Link
              href={SITE_CONFIG.author.linkedin || "#"}
              className="hover:text-foreground"
            >
              LinkedIn
            </Link>
            <Link
              href={`mailto:${SITE_CONFIG.author.email}`}
              className="hover:text-foreground"
            >
              Email
            </Link>
          </div>
        </nav>
      </div>
    </footer>
  );
}
