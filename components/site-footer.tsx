import Link from "next/link";

import { Container } from "@/components/container";
import { Separator } from "@/components/ui/separator";
import { siteNavigation } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <Container className="py-8 sm:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase">Kalink Studio</p>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              Standalone Next.js and Payload bootstrap for the Kalink Studio creative agency
              website.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {siteNavigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>www.kalink.ch</p>
          <p>Staging host: staging.kalink.ch</p>
        </div>
      </Container>
    </footer>
  );
}
