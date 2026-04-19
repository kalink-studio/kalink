import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  reactCompiler: true,
};

export default withPayload(nextConfig);
