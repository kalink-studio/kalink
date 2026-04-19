/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { ServerFunctionClient } from "payload";
import React from "react";

import config from "@payload-config";
import "@payloadcms/next/css";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";

import { importMap } from "./admin/importMap.js";
import "./custom.scss";

type PayloadLayoutProps = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";

  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

export default function Layout({ children }: PayloadLayoutProps) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
