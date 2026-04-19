import type { Block } from "payload";

export const RichTextContentBlock: Block = {
  slug: "richTextContent",
  fields: [
    {
      name: "content",
      type: "richText",
      required: true,
    },
  ],
};
