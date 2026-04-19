import type { Field } from "payload";

export const seoFields: Field[] = [
  {
    name: "metaTitle",
    type: "text",
  },
  {
    name: "metaDescription",
    type: "textarea",
  },
  {
    name: "metaImage",
    type: "relationship",
    relationTo: "media",
  },
];
