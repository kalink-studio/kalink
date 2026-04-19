"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactDialogProps = {
  trigger: ReactNode;
  triggerClassName?: string;
};

export function ContactDialog({ trigger, triggerClassName }: ContactDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={<Button className={triggerClassName} />}>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xl gap-6 rounded-[1.5rem] p-6 sm:max-w-xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Bootstrap review
          </DialogTitle>
          <DialogDescription className="text-sm leading-7">
            This is a placeholder interface for the future contact or lead-capture flow. Submission
            wiring is intentionally deferred until the form strategy is finalized.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Input aria-label="Name" defaultValue="Kalink team" placeholder="Your name" />
          <Input
            aria-label="Email"
            defaultValue="hello@kalink.ch"
            placeholder="you@example.com"
            type="email"
          />
          <Textarea
            aria-label="Message"
            className="min-h-36"
            defaultValue="Please review the first implementation pass and confirm the next content priorities."
            placeholder="How can we help?"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
