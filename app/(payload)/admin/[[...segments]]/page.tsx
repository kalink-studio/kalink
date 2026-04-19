/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from "next";

import config from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";

import { importMap } from "../importMap";

type PayloadAdminPageArgs = {
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
}: PayloadAdminPageArgs): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams });

export default function PayloadAdminPage({ params, searchParams }: PayloadAdminPageArgs) {
  return RootPage({ config, params, searchParams, importMap });
}
