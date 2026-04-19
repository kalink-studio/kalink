import type { Block } from "payload";

import { linkFields } from "../lib/payload/fields/link.ts";

export const CallToActionBlock: Block = {
  slug: "callToAction",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "body",
      type: "textarea",
    },
    linkFields({ name: "primaryAction" }),
  ],
};
