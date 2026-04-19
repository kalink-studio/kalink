# Kalink Studio Implementation Checklist

## Project Inputs

- [x] App slug: `kalink-studio`
- [x] Production canonical host: `www.kalink.ch`
- [x] Production redirect host: `kalink.ch`
- [x] Staging host: `staging.kalink.ch`
- [x] Migration strategy: Kubernetes job
- [x] Admin auth collection: `admins`
- [x] Package manager: `pnpm`
- [x] TypeScript target: latest `6.x`
- [x] S3 endpoint: `https://s3.pub2.infomaniak.cloud`
- [x] S3 region: `us-east-1`
- [x] S3 `forcePathStyle`: `true`
- [x] Dev bucket: `kalink-studio-dev`
- [x] Staging bucket: `kalink-studio-staging`
- [x] Production bucket: `kalink-studio`
- [x] Email provider: Resend
- [x] Resend env var: `RESEND_API_KEY`
- [x] Linter: `oxlint`
- [x] Formatter: `oxfmt`
- [x] Type checking: `tsc --noEmit`

## Phase 1: Repository Bootstrap

- [ ] Create the app with `pnpm create next-app@latest`
- [ ] Use `Next.js 16`, `TypeScript`, `Tailwind CSS`, and App Router
- [ ] Keep the initial scaffold without a `src/` directory
- [ ] Verify import alias `@/*`
- [ ] Remove ESLint-specific setup if the scaffold adds it
- [ ] Install `oxlint`
- [ ] Install `oxfmt`
- [ ] Add or normalize `package.json` scripts:
- [ ] `dev`
- [ ] `build`
- [ ] `start`
- [ ] `lint`
- [ ] `lint:fix`
- [ ] `format`
- [ ] `format:check`
- [ ] `typecheck`
- [ ] `test`
- [ ] `payload`
- [ ] `ci`
- [ ] Configure `dev` to use `next dev --no-server-fast-refresh`
- [ ] Configure `lint` to run `oxlint`
- [ ] Configure `lint:fix` to run `oxlint --fix`
- [ ] Configure `format` to run `oxfmt`
- [ ] Configure `format:check` to run `oxfmt --check`
- [ ] Configure `typecheck` to run `tsc --noEmit`
- [ ] Rename or create `next.config.mjs`
- [ ] Add `output: 'standalone'`
- [ ] Add `/api/health`

## Phase 2: shadcn / UI Setup

- [ ] Run shadcn CLI using the Next.js installation flow
- [ ] Choose Base UI flavor
- [ ] Confirm `components.json` is generated correctly
- [ ] Add initial UI primitives:
- [ ] `button`
- [ ] `card`
- [ ] `input`
- [ ] `textarea`
- [ ] `dialog`
- [ ] `sheet`
- [ ] `navigation-menu`
- [ ] `separator`
- [ ] `badge`
- [ ] `skeleton`
- [ ] Establish a minimal site shell:
- [ ] layout container
- [ ] header
- [ ] footer
- [ ] section wrapper

## Phase 3: Payload Core Integration

- [ ] Install `payload`
- [ ] Install `@payloadcms/next`
- [ ] Install `@payloadcms/db-postgres`
- [ ] Install `@payloadcms/richtext-lexical`
- [ ] Install `sharp`
- [ ] Install `graphql`
- [ ] Wrap Next config with `withPayload(...)`
- [ ] Create `payload.config.ts`
- [ ] Add Postgres adapter configuration
- [ ] Add `PAYLOAD_SECRET` support
- [ ] Generate Payload route files under `app/(payload)`
- [ ] Verify `/admin` loads locally

## Phase 4: CMS Schema

- [ ] Create `admins` collection with auth enabled
- [ ] Add `role` field or equivalent permission seed field to `admins`
- [ ] Create `media` collection
- [ ] Back `media` uploads with S3-compatible storage
- [ ] Create `pages` collection
- [ ] Create `projects` collection
- [ ] Create `site-settings` global
- [ ] Add shared SEO field pattern
- [ ] Add Lexical rich text where appropriate
- [ ] Keep room for future `clients` collection without implementing it now

## Phase 5: Environment Files and Placeholders

- [ ] Create `.env.example`
- [ ] Add placeholder for `DATABASE_URL`
- [ ] Add placeholder for `DATABASE_URL_DIRECT`
- [ ] Add placeholder for `PAYLOAD_SECRET`
- [ ] Add placeholder for `NEXT_PUBLIC_SITE_URL`
- [ ] Add placeholder for `PAYLOAD_PUBLIC_SERVER_URL`
- [ ] Add placeholder for `S3_ENDPOINT`
- [ ] Add placeholder for `S3_REGION`
- [ ] Add placeholder for `S3_FORCE_PATH_STYLE`
- [ ] Add placeholder for `S3_BUCKET`
- [ ] Add placeholder for `S3_ACCESS_KEY_ID`
- [ ] Add placeholder for `S3_SECRET_ACCESS_KEY`
- [ ] Add placeholder for `RESEND_API_KEY`

## Phase 6: Storage Integration

- [ ] Choose the Payload upload adapter strategy that supports S3-compatible storage cleanly
- [ ] Configure endpoint `https://s3.pub2.infomaniak.cloud`
- [ ] Configure region `us-east-1`
- [ ] Configure `forcePathStyle: true`
- [ ] Use env-driven bucket name configuration
- [ ] Verify local development uses `kalink-studio-dev`
- [ ] Verify staging config uses `kalink-studio-staging`
- [ ] Verify production config uses `kalink-studio`
- [ ] Test upload from the Payload admin
- [ ] Test delivery URLs for uploaded media

## Phase 7: Email Integration

- [ ] Install `resend`
- [ ] Create a small server-side mail utility
- [ ] Use `RESEND_API_KEY`
- [ ] Keep sender/from address configurable
- [ ] Add support for a basic HTML email payload
- [ ] Add support for future React Email templates if needed
- [ ] Document verified sending domain requirement
- [ ] Identify first email use case:
- [ ] contact form notification
- [ ] admin operational alert

## Phase 8: Database and Migration Workflow

- [ ] Configure `DATABASE_URL` for runtime with a pooled Neon URL
- [ ] Configure `DATABASE_URL_DIRECT` for migrations with a direct Neon URL
- [ ] Verify local Payload development works against Neon
- [ ] Use local push mode during development
- [ ] Generate the first checked-in migration when schema stabilizes
- [ ] Verify `pnpm payload migrate` works locally against a direct URL

## Phase 9: Docker and Kubernetes Base

- [ ] Copy `Dockerfile` from `~/dev/k8s/naima/templates/nextjs-app`
- [ ] Copy `.dockerignore`
- [ ] Copy `k8s/base`
- [ ] Copy `k8s/overlays/staging`
- [ ] Copy `k8s/overlays/production`
- [ ] Replace `APP_NAME` references with `kalink-studio`
- [ ] Replace `YOUR_ORG` references with `kalink-studio`
- [ ] Keep probes pointed to `/api/health`
- [ ] Add required env vars to the deployment
- [ ] Add secret refs for database, Payload, S3, and Resend

## Phase 10: Ingress and Domain Adaptation

- [ ] Adapt staging ingress host to `staging.kalink.ch`
- [ ] Adapt production ingress canonical host to `www.kalink.ch`
- [ ] Ensure bare domain `kalink.ch` redirects to `www.kalink.ch`
- [ ] Confirm TLS secret names are correct
- [ ] Confirm staging issuer is `letsencrypt-staging`
- [ ] Confirm production issuer is `letsencrypt-prod`

## Phase 11: Kubernetes Migration Job

- [ ] Add a job manifest for staging
- [ ] Add a job manifest for production
- [ ] Use the application image for the migration job
- [ ] Inject `DATABASE_URL_DIRECT`
- [ ] Inject `PAYLOAD_SECRET`
- [ ] Run `payload migrate`
- [ ] Ensure the app does not rely on startup migrations
- [ ] Document or encode rollout ordering expectations

## Phase 12: Secrets Management

- [ ] Create sealed secret manifest for staging
- [ ] Create sealed secret manifest for production
- [ ] Include `DATABASE_URL`
- [ ] Include `DATABASE_URL_DIRECT`
- [ ] Include `PAYLOAD_SECRET`
- [ ] Include `NEXT_PUBLIC_SITE_URL`
- [ ] Include `PAYLOAD_PUBLIC_SERVER_URL`
- [ ] Include `S3_BUCKET`
- [ ] Include `S3_ACCESS_KEY_ID`
- [ ] Include `S3_SECRET_ACCESS_KEY`
- [ ] Include `RESEND_API_KEY`
- [ ] Register sealed secret resources in the correct kustomization files

## Phase 13: GitHub Actions and Release Setup

- [ ] Copy `.github/workflows/ci.yaml`
- [ ] Copy `.github/workflows/release.yaml`
- [ ] Copy `.changeset/config.json`
- [ ] Update image name to `ghcr.io/kalink-studio/kalink`
- [ ] Verify workflow install steps use `pnpm`
- [ ] Verify workflow build steps match repository scripts
- [ ] Verify staging kustomization update path is correct
- [ ] Verify production kustomization update path is correct

## Phase 14: ArgoCD Registration in Naima

- [ ] Create `~/dev/k8s/naima/apps/kalink-studio-staging.yaml`
- [ ] Create `~/dev/k8s/naima/apps/kalink-studio-production.yaml`
- [ ] Point staging app to this repo and `k8s/overlays/staging`
- [ ] Point production app to this repo and `k8s/overlays/production`
- [ ] Commit and apply cluster repo changes when ready

## Phase 15: Local Verification

- [ ] Run `pnpm install`
- [ ] Run `pnpm format:check`
- [ ] Run `pnpm lint`
- [ ] Run `pnpm typecheck`
- [ ] Run `pnpm build`
- [ ] Open `http://localhost:3000`
- [ ] Open `http://localhost:3000/admin`
- [ ] Check `http://localhost:3000/api/health`
- [ ] Verify Payload login flow
- [ ] Verify upload flow against dev bucket
- [ ] Verify email utility can send in a controlled test path

## Phase 16: Staging Verification

- [ ] Confirm CI builds successfully
- [ ] Confirm image is pushed to GHCR
- [ ] Confirm staging kustomization is updated
- [ ] Confirm ArgoCD syncs staging
- [ ] Confirm staging pod is healthy
- [ ] Confirm migration job completed successfully
- [ ] Confirm `https://staging.kalink.ch/api/health` returns success
- [ ] Confirm `https://staging.kalink.ch/admin` loads
- [ ] Confirm uploads use `kalink-studio-staging`

## Phase 17: Production Verification

- [ ] Confirm production release flow updates the production image tag
- [ ] Confirm ArgoCD syncs production
- [ ] Confirm migration job completed successfully
- [ ] Confirm `https://www.kalink.ch` loads
- [ ] Confirm `https://kalink.ch` redirects to `https://www.kalink.ch`
- [ ] Confirm TLS certificates are valid
- [ ] Confirm uploads use `kalink-studio`
- [ ] Confirm transactional emails use the verified Resend sender domain

## Nice-to-Have Follow-Ups

- [ ] Add a future `clients` auth collection plan
- [ ] Add live preview if required by editorial workflow
- [ ] Add form handling strategy for contact and lead capture
- [ ] Add richer flexible content block library
- [ ] Add automated smoke tests for `/`, `/admin`, and `/api/health`
