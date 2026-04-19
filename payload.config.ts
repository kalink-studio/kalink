import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { randomBytes } from "crypto";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Admins } from "./collections/Admins.ts";
import { Media } from "./collections/Media.ts";
import { Pages } from "./collections/Pages.ts";
import { Projects } from "./collections/Projects.ts";
import { SiteSettings } from "./globals/SiteSettings.ts";
import { defaultLexical } from "./lib/payload/default-lexical.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const isMigrationCommand = process.argv.some((arg) => arg.startsWith("migrate"));
const isProduction = process.env.NODE_ENV === "production";
const databaseURL = isMigrationCommand
  ? process.env.DATABASE_URL_DIRECT || process.env.DATABASE_URL || ""
  : process.env.DATABASE_URL || "";

const requiredS3EnvVars = ["S3_BUCKET", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY"] as const;
const missingS3EnvVars = requiredS3EnvVars.filter((name) => !process.env[name]);
const hasS3Config = missingS3EnvVars.length === 0;

if (isProduction && missingS3EnvVars.length > 0) {
  throw new Error(`Missing required S3 environment variables: ${missingS3EnvVars.join(", ")}.`);
}

const payloadSecret = process.env.PAYLOAD_SECRET;

if (!payloadSecret && isProduction) {
  throw new Error("Missing required environment variable: PAYLOAD_SECRET.");
}

if (!payloadSecret) {
  console.warn("PAYLOAD_SECRET is not set; using an ephemeral development secret.");
}

const cors = [process.env.NEXT_PUBLIC_SITE_URL, process.env.PAYLOAD_PUBLIC_SERVER_URL].filter(
  (value): value is string => Boolean(value),
);

const plugins = hasS3Config
  ? [
      s3Storage({
        bucket: process.env.S3_BUCKET || "kalink-studio-dev",
        collections: {
          media: true,
        },
        config: {
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
          },
          endpoint: process.env.S3_ENDPOINT || "https://s3.pub2.infomaniak.cloud",
          forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
          region: process.env.S3_REGION || "us-east-1",
        },
        disableLocalStorage: true,
      }),
    ]
  : [];

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Admins.slug,
  },
  collections: [Admins, Media, Pages, Projects],
  cors,
  db: postgresAdapter({
    migrationDir: path.resolve(dirname, "migrations"),
    pool: {
      connectionString: databaseURL,
    },
    push: process.env.NODE_ENV !== "production" && !isMigrationCommand,
  }),
  editor: defaultLexical,
  graphQL: {
    disable: true,
  },
  globals: [SiteSettings],
  plugins,
  secret: payloadSecret || randomBytes(32).toString("hex"),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
