import type { CollectionConfig } from "payload";

import { adminsOnly, adminsOrPublished } from "../lib/payload/access.ts";
import { seoFields } from "../lib/payload/fields/seo.ts";
import { slugField } from "../lib/payload/fields/slug.ts";

export const Projects: CollectionConfig = {
  slug: "projects",
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: adminsOrPublished,
    update: adminsOnly,
  },
  admin: {
    defaultColumns: ["title", "clientName", "year", "featured"],
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
      name: "clientName",
      type: "text",
    },
    {
      name: "year",
      type: "number",
      required: true,
    },
    {
      name: "services",
      type: "array",
      fields: [
        {
          name: "service",
          type: "text",
          required: true,
        },
      ],
      minRows: 1,
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
    },
    {
      name: "coverImage",
      type: "relationship",
      relationTo: "media",
      required: true,
    },
    {
      name: "gallery",
      type: "relationship",
      hasMany: true,
      relationTo: "media",
    },
    {
      name: "caseStudy",
      type: "richText",
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
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
