import { ArrowRightIcon, DatabaseIcon, Layers3Icon, MailIcon, ShieldCheckIcon } from "lucide-react";

import { ContactDialog } from "@/components/contact-dialog";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const platformHighlights = [
  {
    description: "Next.js 16 App Router with standalone output tuned for self-hosted deployment.",
    icon: Layers3Icon,
    title: "Public site + CMS split",
  },
  {
    description:
      "Payload CMS 3 with Postgres on Neon, admin auth, pages, projects, and site settings.",
    icon: DatabaseIcon,
    title: "Operational content model",
  },
  {
    description:
      "S3-compatible uploads, Resend email utilities, and Naima deployment assets for ArgoCD.",
    icon: ShieldCheckIcon,
    title: "Deployment-ready foundation",
  },
];

export default function HomePage() {
  return (
    <>
      <Section className="overflow-hidden pt-8 sm:pt-12">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.9fr)] lg:items-end">
          <div className="space-y-8">
            <Badge
              className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em]"
              variant="outline"
            >
              Bootstrap in progress
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Kalink Studio now has a standalone agency stack instead of a placeholder repo.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                The project is wired for a marketing site, a Payload-powered admin, Neon Postgres,
                Infomaniak object storage, Resend mail, and Naima cluster deployment.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ContactDialog
                trigger={
                  <>
                    Review the foundation
                    <ArrowRightIcon className="size-4" />
                  </>
                }
                triggerClassName="h-11 gap-2 px-5 text-sm"
              />
              <a
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-11 px-5")}
                href="/admin"
              >
                Open Payload admin
              </a>
            </div>
          </div>

          <Card className="surface-grid border-border/70 bg-card/80 shadow-sm backdrop-blur">
            <CardHeader className="space-y-4">
              <CardTitle className="text-base uppercase tracking-[0.2em] text-muted-foreground">
                Implementation snapshot
              </CardTitle>
              <CardDescription className="text-sm leading-7 text-foreground">
                The repo includes a route-group split, initial collections and globals,
                object-storage wiring, and cluster manifests for staging and production.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl sm:col-span-2" />
              </div>
              <Separator />
              <p className="text-sm leading-7 text-muted-foreground">
                This first pass leaves the repository in a bootable state with the site shell,
                Payload admin routes, CMS schema, storage hooks, email utilities, and Kubernetes
                scaffolding in place.
              </p>
            </CardContent>
          </Card>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-4 md:grid-cols-3">
          {platformHighlights.map(({ description, icon: Icon, title }) => (
            <Card key={title} className="border-border/70 bg-card/70 shadow-none backdrop-blur-sm">
              <CardHeader className="gap-4">
                <div className="flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-background shadow-sm">
                  <Icon className="size-5" />
                </div>
                <div className="space-y-2">
                  <CardTitle>{title}</CardTitle>
                  <CardDescription className="text-sm leading-7">{description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </Container>
      </Section>

      <Section className="pt-0">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="space-y-4">
            <Badge variant="secondary">CMS model</Badge>
            <h2 className="text-3xl font-semibold tracking-tight">
              The first schema is agency-oriented and intentionally small.
            </h2>
            <p className="text-base leading-8 text-muted-foreground">
              Editors can manage pages, projects, media, and global site settings now, while leaving
              room for future client auth, richer blocks, preview flows, and operational
              notifications.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["admins", "Admin auth collection with a role field for future RBAC."],
              ["media", "Upload collection prepared for local storage or Infomaniak S3."],
              ["pages", "Marketing pages with hero content, flexible blocks, SEO, and drafts."],
              ["projects", "Case studies with gallery media, services, featured flag, and SEO."],
              [
                "site-settings",
                "Brand, contact, CTA, legal, and social values shared across the site.",
              ],
              [
                "resend",
                "Server-side mail utility ready for operational and future form notifications.",
              ],
            ].map(([name, description]) => (
              <Card key={name} className="border-border/70 bg-background/75 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription className="leading-7">{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container className="rounded-[2rem] border border-border/70 bg-card/70 px-6 py-8 shadow-sm backdrop-blur sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Badge variant="outline">Operational contact path</Badge>
              <h2 className="text-2xl font-semibold tracking-tight">
                A simple internal notification path is wired behind the mail utility.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                The utility is server-only and expects an explicit sender address, so production can
                switch to the verified Resend domain without rewriting application code.
              </p>
            </div>
            <Button variant="outline" className="gap-2" disabled>
              <MailIcon className="size-4" />
              Email flow pending sender config
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
