import type { Field } from "payload";

export function formatSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugField(sourceField = "title"): Field {
  return {
    name: "slug",
    type: "text",
    admin: {
      position: "sidebar",
    },
    hooks: {
      beforeValidate: [
        ({ value, siblingData }) => {
          const fallbackValue =
            typeof siblingData?.[sourceField] === "string" ? siblingData[sourceField] : "";
          return formatSlug(String(value || fallbackValue || "untitled"));
        },
      ],
    },
    index: true,
    required: true,
    unique: true,
  };
}
