import type { Field } from "payload";

export function linkFields(overrides: Partial<Field> = {}): Field {
  return {
    name: "link",
    type: "group",
    fields: [
      {
        name: "label",
        type: "text",
        required: true,
      },
      {
        name: "url",
        type: "text",
        required: true,
      },
    ],
    ...overrides,
  } as Field;
}
