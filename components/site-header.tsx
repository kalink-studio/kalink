"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Container } from "@/components/container";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { siteNavigation } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import { ContactDialog } from "./contact-dialog";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <Container className="flex h-18 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link className="text-sm font-semibold tracking-[0.24em] uppercase" href="/">
            Kalink Studio
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {siteNavigation.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
                    href={item.href}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex md:items-center md:gap-3">
          <a className={cn(buttonVariants({ variant: "outline" }), "h-9 px-3")} href="/api/health">
            Health
          </a>
          <ContactDialog trigger="Review build" triggerClassName="h-9 px-4" />
        </div>

        <Sheet>
          <SheetTrigger render={<Button className="md:hidden" size="icon" variant="outline" />}>
            <MenuIcon className="size-4" />
            <span className="sr-only">Open navigation</span>
          </SheetTrigger>
          <SheetContent className="gap-8 p-6" side="right">
            <SheetHeader>
              <SheetTitle className="text-left text-sm font-semibold tracking-[0.2em] uppercase">
                Kalink Studio
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3">
              {siteNavigation.map((item) => (
                <Link
                  key={item.href}
                  className="rounded-xl border border-border/70 px-4 py-3 text-sm font-medium"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
              <a
                className={cn(buttonVariants({ variant: "outline" }), "justify-start")}
                href="/admin"
              >
                Payload admin
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
