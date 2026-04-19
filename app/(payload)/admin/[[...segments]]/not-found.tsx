/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from "next";

import config from "@payload-config";
import { NotFoundPage, generatePageMetadata } from "@payloadcms/next/views";

import { importMap } from "../importMap";

type PayloadAdminNotFoundArgs = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = ({
  params,
  searchParams,
}: PayloadAdminNotFoundArgs): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

export default function PayloadAdminNotFound({ params, searchParams }: PayloadAdminNotFoundArgs) {
  return NotFoundPage({ config, params, searchParams, importMap });
}
