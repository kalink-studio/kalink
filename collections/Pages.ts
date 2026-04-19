import type { CollectionConfig } from "payload";

import { CallToActionBlock } from "../blocks/CallToAction.ts";
import { MetricsBlock } from "../blocks/Metrics.ts";
import { RichTextContentBlock } from "../blocks/RichTextContent.ts";
import { adminsOnly, adminsOrPublished } from "../lib/payload/access.ts";
import { linkFields } from "../lib/payload/fields/link.ts";
import { seoFields } from "../lib/payload/fields/seo.ts";
import { slugField } from "../lib/payload/fields/slug.ts";

export const Pages: CollectionConfig = {
  slug: "pages",
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: adminsOrPublished,
    update: adminsOnly,
  },
  admin: {
    defaultColumns: ["title", "slug", "updatedAt"],
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    slugField(),
    {
      name: "hero",
      type: "group",
      fields: [
        {
          name: "eyebrow",
          type: "text",
        },
        {
          name: "headline",
          type: "text",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
        },
        linkFields({ name: "primaryAction" }),
        linkFields({ name: "secondaryAction" }),
        {
          name: "media",
          type: "relationship",
          relationTo: "media",
        },
      ],
    },
    {
      name: "layout",
      type: "blocks",
      admin: {
        initCollapsed: true,
      },
      blocks: [RichTextContentBlock, MetricsBlock, CallToActionBlock],
    },
    {
      name: "seo",
      type: "group",
      fields: seoFields,
    },
  ],
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
  },
};
