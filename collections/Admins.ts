import type { CollectionConfig } from "payload";

import { adminsOnly, adminsOnlyAdmin } from "../lib/payload/access.ts";

export const Admins: CollectionConfig = {
  slug: "admins",
  access: {
    admin: adminsOnlyAdmin,
    create: adminsOnly,
    delete: adminsOnly,
    read: adminsOnly,
    update: adminsOnly,
  },
  admin: {
    defaultColumns: ["name", "email", "role"],
    useAsTitle: "name",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      defaultValue: "editor",
      options: [
        {
          label: "Super admin",
          value: "super-admin",
        },
        {
          label: "Editor",
          value: "editor",
        },
      ],
      required: true,
    },
  ],
};
