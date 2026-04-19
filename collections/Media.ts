import type { CollectionConfig } from "payload";
import path from "path";
import { fileURLToPath } from "url";

import { adminsOnly, anyone } from "../lib/payload/access.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: anyone,
    update: adminsOnly,
  },
  admin: {
    defaultColumns: ["filename", "alt", "updatedAt"],
    useAsTitle: "filename",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "caption",
      type: "richText",
    },
  ],
  upload: {
    adminThumbnail: "card",
    focalPoint: true,
    imageSizes: [
      {
        name: "card",
        width: 640,
        height: 640,
      },
      {
        name: "feature",
        width: 1600,
      },
      {
        name: "og",
        width: 1200,
        height: 630,
      },
    ],
    mimeTypes: ["image/*", "application/pdf", "image/svg+xml"],
    staticDir: path.resolve(dirname, "../public/media"),
  },
};
