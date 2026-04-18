# Kalink Studio Bootstrap Plan

## Goal

Bootstrap a new standalone repository for the Kalink Studio creative agency website with the following stack:

- Framework: `Next.js 16`
- Language: `TypeScript 6`
- CMS: `Payload CMS 3`
- Database: `Postgres` on `Neon`
- UI: `shadcn` via CLI using the Next.js installation flow and Base UI flavor
- Styling: `Tailwind CSS`
- Object storage: `Infomaniak S3-compatible storage`
- Transactional email: `Resend`
- Hosting: self-hosted Kubernetes on the `Naima` cluster

This repository should be bootstrapped as a standalone app repo and then registered in `~/dev/k8s/naima` for ArgoCD-based deployment.

## Locked Decisions

- App slug: `kalink-studio`
- Production canonical host: `www.kalink.ch`
- Production redirect host: `kalink.ch`
- Staging host: `staging.kalink.ch`
- Package manager: `pnpm`
- App architecture: `Next.js App Router`
- Admin auth collection: `admins`
- Migration strategy: `Kubernetes Job`
- Runtime database URL: Neon pooled connection
- Migration database URL: Neon direct connection
- Linting: `oxlint`
- Formatting: `oxfmt`
- Type checking: `tsc --noEmit`

## Version Baseline

Use the latest compatible versions at bootstrap time, currently:

- `next@16.2.4`
- `payload@3.83.0`
- `@payloadcms/next@3.83.0`
- `typescript@6.0.3`

Payload currently supports Next.js `>=16.2.2 <17.0.0`, so this baseline is compatible.

## Repository Strategy

Use a standard standalone Next.js repository instead of starting from `create-payload-app`.

Why this approach:

- It aligns better with the Naima standalone deployment template.
- It keeps the repository structure predictable for Docker, GitHub Actions, and ArgoCD.
- It avoids having to reshape a generator-specific scaffold to fit the cluster deployment conventions.
- It keeps the shadcn CLI setup straightforward.

## External References

- Cluster repo: `~/dev/k8s/naima`
- Next.js app template: `~/dev/k8s/naima/templates/nextjs-app`
- GitHub Actions templates: `~/dev/k8s/naima/templates/github-actions/standalone`
- ArgoCD application template: `~/dev/k8s/naima/templates/argocd-app/application.yaml`

## Target Architecture

### Application Layout

Use a clean route-group split between the public site and Payload-managed routes:

```text
app/
  (site)/
    page.tsx
    ...public website routes
  (payload)/
    admin/
    api/
    graphql/
    graphql-playground/
```

This keeps the marketing site isolated from the CMS/admin runtime while still sharing a single Next.js application.

### Next.js Configuration

Use `next.config.mjs` and configure both:

- `output: 'standalone'` for the Naima Docker image
- `withPayload(...)` for Payload compatibility

Payload also currently recommends using `next dev --no-server-fast-refresh` with supported Next.js 16 versions.

### Health Endpoint

The Naima deployment template expects a health endpoint at `/api/health`.

Add an App Router route:

```ts
export async function GET() {
  return Response.json({ status: 'ok' })
}
```

## Environment Model

### Local Development

Use a local `.env` file with placeholders for all required secrets and service configuration.

### Staging and Production

Use Kubernetes secrets managed through Sealed Secrets.

Maintain separate secret values for:

- database URLs
- Payload secret
- site URLs
- S3 bucket name
- S3 credentials
- Resend API key

## Environment Variables

The bootstrap should standardize on the following variables:

```dotenv
DATABASE_URL=
DATABASE_URL_DIRECT=
PAYLOAD_SECRET=
NEXT_PUBLIC_SITE_URL=
PAYLOAD_PUBLIC_SERVER_URL=

S3_ENDPOINT=https://s3.pub2.infomaniak.cloud
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=

RESEND_API_KEY=
```

### Environment-Specific Bucket Mapping

- Local dev: `kalink-studio-dev`
- Staging: `kalink-studio-staging`
- Production: `kalink-studio`

## Phase Plan

## Phase 1: Repository Scaffold

Create a new standalone Next.js app with:

- `TypeScript`
- `Tailwind CSS`
- `oxlint`
- `oxfmt`
- `App Router`
- import alias `@/*`
- `pnpm`

Recommended characteristics:

- no `src/` directory for the initial bootstrap
- keep config files at the repository root
- prefer ESM config files where required by Payload

Add or normalize scripts for:

- `dev`
- `build`
- `start`
- `lint`
- `lint:fix`
- `format`
- `format:check`
- `typecheck`
- `test`
- `payload`
- `ci`

Recommended behavior:

- `dev` should run `next dev --no-server-fast-refresh`
- `lint` should run `oxlint`
- `lint:fix` should run `oxlint --fix`
- `format` should run `oxfmt`
- `format:check` should run `oxfmt --check`
- `typecheck` should run `tsc --noEmit`
- `ci` should run format check, lint, typecheck, tests, and build in a predictable order

### Code Quality Tooling

Use Oxc tooling in place of ESLint and Prettier.

Recommended setup:

- `oxlint` as the primary linter
- `oxfmt` as the primary formatter
- `tsc --noEmit` as the source of truth for type checking

Why this is the right fit here:

- Oxc supports `Next.js`, `React`, `TypeScript`, `JSX`, and `TSX`
- `oxfmt` supports Tailwind-oriented formatting workflows and built-in class sorting
- this keeps the toolchain fast without relying on Oxlint's type-aware mode

Important caveat:

- do not rely on Oxlint type-aware linting for this bootstrap because that path currently expects TypeScript 7-era tooling, while this repository is intentionally staying on `TypeScript 6`

## Phase 2: UI Foundation

Install shadcn using the official Next.js installation flow and configure it with the Base UI flavor.

Add an initial baseline of primitives for the marketing site:

- `button`
- `card`
- `input`
- `textarea`
- `dialog`
- `sheet`
- `navigation-menu`
- `separator`
- `badge`
- `skeleton`

Establish a small internal design system layer:

- layout container
- site header
- site footer
- section wrapper
- rich text renderer
- typography helpers only where useful

The goal is not to overbuild a component system, only to create enough structure to support the first website implementation cleanly.

## Phase 3: Payload Integration

Add Payload manually to the Next.js app.

Install:

- `payload`
- `@payloadcms/next`
- `@payloadcms/db-postgres`
- `@payloadcms/richtext-lexical`
- `sharp`
- `graphql`

Create:

- `payload.config.ts`
- the generated Payload route group under `app/(payload)`
- an admin-auth collection

Configure Payload to:

- use Postgres via `postgresAdapter`
- use `PAYLOAD_SECRET`
- mount the admin at `/admin`
- support rich text via Lexical

### Admin Authentication Strategy

Use `admins` as the auth-enabled collection for Payload admin access.

Why `admins` is preferred:

- it separates editor/CMS access from future customer-facing authentication
- it leaves room to add a separate `clients` collection later
- it avoids overloading a generic `users` model too early

## Phase 4: Initial CMS Model

Define an agency-oriented content model that is useful immediately but still minimal enough to evolve safely.

### Collections

#### `admins`

Purpose:

- CMS/editor access
- future role-based access control

Suggested fields:

- name
- email
- role

#### `media`

Purpose:

- image and asset uploads backed by S3-compatible object storage

Suggested behavior:

- support alt text
- support focal metadata if the selected Payload upload strategy allows it cleanly
- reserve room for image-heavy case studies and branding assets

#### `pages`

Purpose:

- editable marketing pages

Suggested fields:

- title
- slug
- hero block
- flexible content blocks
- SEO fields
- publish status

#### `projects`

Purpose:

- portfolio / case study content

Suggested fields:

- title
- slug
- client name
- year
- services
- excerpt
- cover image
- gallery
- case study body
- featured flag
- SEO fields

### Globals

#### `site-settings`

Purpose:

- site-wide brand and operational settings

Suggested fields:

- brand name
- primary CTA labels and links
- default SEO values
- footer content
- legal links
- contact information
- social profiles

## Phase 5: Storage Integration

Configure Payload uploads against Infomaniak S3-compatible storage.

Locked storage configuration:

- endpoint: `https://s3.pub2.infomaniak.cloud`
- region: `us-east-1`
- `forcePathStyle: true`

The implementation should rely on environment variables rather than hardcoded bucket names, so the same codebase works across dev, staging, and production.

The bootstrap should create placeholders for:

- `S3_BUCKET`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

## Phase 6: Transactional Email

Add `resend` during the initial bootstrap.

Use cases to support early:

- contact form notifications
- internal operational notifications
- future account-related transactional emails

Implementation guidelines:

- server-side only
- use `RESEND_API_KEY`
- do not hardcode sender addresses
- use a verified sending domain in production
- wrap Resend in a small internal mail utility to keep provider coupling low

## Phase 7: Database and Migrations

### Runtime Connections

Use the pooled Neon URL in the web app runtime:

- `DATABASE_URL`

### Migration Connections

Use the direct Neon URL for migrations:

- `DATABASE_URL_DIRECT`

This split is important because Neon recommends pooled URLs for application runtime and direct URLs for administrative tasks and migrations.

### Local Workflow

During development:

- allow Payload Postgres push mode to keep the local dev database in sync while iterating
- treat the local database as disposable
- generate checked-in migrations once a feature or schema change is stable

### Shared Environment Workflow

For staging and production:

- do not rely on Payload push mode
- use checked-in migrations
- run migrations explicitly before or as part of deployment

## Phase 8: Kubernetes Migration Job

Use a dedicated Kubernetes Job as the migration strategy.

Why this is the preferred strategy here:

- it fits the Kubernetes deployment model better than app-startup migrations
- it avoids multi-replica race conditions
- it avoids storing database admin credentials in GitHub Actions
- it keeps production schema changes close to the deployed runtime environment

### Migration Job Design

Add a per-environment job manifest that:

- uses the application image
- receives `DATABASE_URL_DIRECT`
- runs `payload migrate`
- receives the other minimum env vars Payload needs to initialize cleanly

The deployment process should ensure migrations complete successfully before the app rollout is considered healthy.

## Phase 9: Naima Deployment Bootstrap

Copy the standalone Naima deployment assets into this repository:

- `Dockerfile`
- `.dockerignore`
- `k8s/base/*`
- `k8s/overlays/staging/*`
- `k8s/overlays/production/*`
- `.github/workflows/ci.yaml`
- `.github/workflows/release.yaml`
- `.changeset/config.json`

### Required Template Adaptations

Do not treat the ingress setup as a blind placeholder replacement.

The production ingress template assumes a base domain placeholder plus a generated `www.` host. For this project, the desired exact behavior is:

- canonical production host: `www.kalink.ch`
- redirect: `kalink.ch` -> `www.kalink.ch`
- staging host: `staging.kalink.ch`

Adapt the ingress manifests accordingly.

### Deployment Requirements

The application deployment should include env refs for:

- `DATABASE_URL`
- `PAYLOAD_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `PAYLOAD_PUBLIC_SERVER_URL`
- S3 credentials and bucket config
- `RESEND_API_KEY`

The migration job should at minimum include:

- `DATABASE_URL_DIRECT`
- `PAYLOAD_SECRET`
- any other config Payload initialization requires

### Health Probes

Keep Kubernetes liveness and readiness probes pointed at:

- `/api/health`

## Phase 10: Secret Management

Use Sealed Secrets for staging and production.

Expected secret coverage:

- database credentials
- Payload secret
- public/server URLs
- S3 credentials
- bucket name
- Resend API key

Use environment-specific sealed secrets in overlays when values differ by environment.

## Phase 11: GitHub Actions and Release Flow

Start from the Naima standalone CI and release workflow templates.

Expected flow:

1. Pull request to `main`: run validation only
2. Push to `main`: build image, push image, update staging image tag
3. Changesets release PR: prepare production deployment versioning
4. Release workflow: update production image tag

Adjust workflow commands as needed for the final package scripts and repository layout.

## Phase 12: ArgoCD Registration

In `~/dev/k8s/naima/apps`, create:

- `kalink-studio-staging.yaml`
- `kalink-studio-production.yaml`

Each should reference this repository and the proper overlay path:

- staging: `k8s/overlays/staging`
- production: `k8s/overlays/production`

## Verification Plan

### Local Verification

- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- open `/admin`
- hit `/api/health`
- verify the public homepage renders
- verify S3-backed uploads work in local development

### Deployment Verification

- CI builds and pushes the image successfully
- staging kustomization updates correctly
- ArgoCD syncs staging
- staging pod becomes ready
- `https://staging.kalink.ch/api/health` returns success
- staging admin login works
- staging uploads work against `kalink-studio-staging`

### Production Verification

- ArgoCD syncs production
- `www.kalink.ch` serves successfully
- `kalink.ch` redirects to `www.kalink.ch`
- TLS certificates are issued correctly
- media uploads target `kalink-studio`

## Risks and Follow-Up Decisions

These are not blockers for bootstrap but should be tracked:

- exact frontend information architecture and page inventory
- exact Payload flexible block set for the first version
- contact form flow and final sender/from addresses for Resend
- whether live preview is in scope for the first implementation
- whether client-facing auth should be introduced in phase two or later

## First Implementation Target

The first implementation pass should leave the repository with:

- a bootable Next.js app
- Payload admin available locally
- initial CMS schema in place
- object storage configured via env placeholders
- Resend wired behind a small server-side mail utility
- Naima deployment assets copied and adapted
- migration job manifests added
- docs and checklists in place for repeatable setup
