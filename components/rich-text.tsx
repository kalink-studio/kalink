import type { ComponentProps } from "react";

import { RichText as LexicalRichText } from "@payloadcms/richtext-lexical/react";

import { cn } from "@/lib/utils";

type RichTextProps = {
  className?: string;
  data: ComponentProps<typeof LexicalRichText>["data"] | null | undefined;
};

export function RichText({ className, data }: RichTextProps) {
  if (!data) {
    return null;
  }

  return (
    <LexicalRichText
      className={cn("prose prose-zinc max-w-none dark:prose-invert", className)}
      data={data}
    />
  );
}
