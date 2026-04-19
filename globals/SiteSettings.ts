import type { GlobalConfig } from "payload";

import { adminsOnly, anyone } from "../lib/payload/access.ts";
import { linkFields } from "../lib/payload/fields/link.ts";
import { seoFields } from "../lib/payload/fields/seo.ts";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: anyone,
    update: adminsOnly,
  },
  fields: [
    {
      name: "brandName",
      type: "text",
      defaultValue: "Kalink Studio",
      required: true,
    },
    {
      name: "primaryCta",
      type: "group",
      fields: [
        {
          name: "label",
          type: "text",
          defaultValue: "Start a project",
        },
        {
          name: "url",
          type: "text",
          defaultValue: "/",
        },
      ],
    },
    {
      name: "contact",
      type: "group",
      fields: [
        {
          name: "email",
          type: "email",
        },
        {
          name: "phone",
          type: "text",
        },
        {
          name: "location",
          type: "text",
        },
      ],
    },
    {
      name: "footerContent",
      type: "richText",
    },
    {
      name: "legalLinks",
      type: "array",
      fields: [linkFields({ name: "item" })],
    },
    {
      name: "socialProfiles",
      type: "array",
      fields: [
        {
          name: "platform",
          type: "text",
          required: true,
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "defaultSeo",
      type: "group",
      fields: seoFields,
    },
  ],
};
