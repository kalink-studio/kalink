# Infomaniak S3 and Sealed Secrets Runbook

## Goal

Create environment-specific Infomaniak S3 credentials, fill the local env files, and generate the Kubernetes Sealed Secrets used by this repository.

This runbook assumes the current bootstrap decisions:

- one Infomaniak Public Cloud project for now
- one bucket per environment
- one S3 credential pair per environment
- one Sealed Secret per Kubernetes namespace

## Environment Mapping

| Environment | Namespace    | Host                        | Bucket                  |
| ----------- | ------------ | --------------------------- | ----------------------- |
| staging     | `staging`    | `https://staging.kalink.ch` | `kalink-studio-staging` |
| production  | `production` | `https://www.kalink.ch`     | `kalink-studio`         |

## Fixed S3 Settings

Use these values for both environments:

```dotenv
S3_ENDPOINT=https://s3.pub2.infomaniak.cloud
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true
```

Infomaniak documents `us-east-1` as the compatibility region and recommends `forcePathStyle=true` for SDK compatibility.

## Prerequisites

Install the required CLIs:

```bash
pip install python-openstackclient
brew install awscli jq kubeseal
```

You also need:

- matching OpenStack profiles in `~/.config/openstack/clouds.yaml` and `~/.config/openstack/secure.yaml`
- optional: an Infomaniak `openrc.sh` file if you prefer shell-based auth instead of `--os-cloud`
- `kubectl` configured against the Naima cluster
- access to the Sealed Secrets controller public certificate via `kubeseal`

## Important Notes

- Use `openstack ec2 credentials create` for the S3 `access` and `secret` pair.
- Do not use OpenStack Application Credentials as the app's `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY`.
- Do not reuse staging credentials in production.
- Keep `.env.local.s3`, `.env.staging.local`, and `.env.production.local` local-only.

## Local S3 Dev Mode

Normal local development should continue to use local filesystem uploads through `pnpm dev`.

When you want to test the real S3-backed upload path locally, use `pnpm dev:s3`. That command loads `.env.local.s3`, which mirrors the non-S3 values from `.env.local` and adds the dedicated local development bucket settings:

```dotenv
S3_ENDPOINT=https://s3.pub2.infomaniak.cloud
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true
S3_BUCKET=kalink-studio-dev
S3_ACCESS_KEY_ID=<local dev access key>
S3_SECRET_ACCESS_KEY=<local dev secret key>
```

Run it with:

```bash
pnpm dev:s3
```

If `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` are empty, Payload will fall back to local filesystem uploads even in this mode.

## One-Time Validation

Confirm the configured cloud profiles resolve correctly before creating credentials:

```bash
openstack --os-cloud kalink-stg token issue
openstack --os-cloud kalink-prd token issue
```

## Staging

### 1. Create staging S3 credentials

```bash
STAGING_CREDS_JSON="$(openstack --os-cloud kalink-stg ec2 credentials create -f json)"
echo "$STAGING_CREDS_JSON" | jq
```

### 2. Extract the staging access and secret

```bash
export STAGING_S3_ACCESS_KEY_ID="$(echo "$STAGING_CREDS_JSON" | jq -r '.access')"
export STAGING_S3_SECRET_ACCESS_KEY="$(echo "$STAGING_CREDS_JSON" | jq -r '.secret')"
```

### 3. Create the staging bucket

```bash
AWS_ACCESS_KEY_ID="$STAGING_S3_ACCESS_KEY_ID" \
AWS_SECRET_ACCESS_KEY="$STAGING_S3_SECRET_ACCESS_KEY" \
AWS_DEFAULT_REGION="us-east-1" \
aws --endpoint-url=https://s3.pub2.infomaniak.cloud s3api create-bucket --bucket kalink-studio-staging
```

### 4. Fill `.env.staging.local`

```dotenv
DATABASE_URL=postgresql://...
DATABASE_URL_DIRECT=postgresql://...
PAYLOAD_SECRET=replace-with-staging-payload-secret
NEXT_PUBLIC_SITE_URL=https://staging.kalink.ch
PAYLOAD_PUBLIC_SERVER_URL=https://staging.kalink.ch

S3_ENDPOINT=https://s3.pub2.infomaniak.cloud
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true
S3_BUCKET=kalink-studio-staging
S3_ACCESS_KEY_ID=<value from STAGING_S3_ACCESS_KEY_ID>
S3_SECRET_ACCESS_KEY=<value from STAGING_S3_SECRET_ACCESS_KEY>

RESEND_API_KEY=replace-with-staging-resend-api-key
```

### 5. Generate the staging Sealed Secret

```bash
kubectl create secret generic kalink-studio-secrets \
  --namespace staging \
  --from-env-file=.env.staging.local \
  --dry-run=client -o yaml | \
kubeseal --format yaml --namespace staging > k8s/overlays/staging/sealedsecret.yaml
```

## Production

### 1. Create production S3 credentials

```bash
PRODUCTION_CREDS_JSON="$(openstack --os-cloud kalink-prd ec2 credentials create -f json)"
echo "$PRODUCTION_CREDS_JSON" | jq
```

### 2. Extract the production access and secret

```bash
export PRODUCTION_S3_ACCESS_KEY_ID="$(echo "$PRODUCTION_CREDS_JSON" | jq -r '.access')"
export PRODUCTION_S3_SECRET_ACCESS_KEY="$(echo "$PRODUCTION_CREDS_JSON" | jq -r '.secret')"
```

### 3. Create the production bucket

```bash
AWS_ACCESS_KEY_ID="$PRODUCTION_S3_ACCESS_KEY_ID" \
AWS_SECRET_ACCESS_KEY="$PRODUCTION_S3_SECRET_ACCESS_KEY" \
AWS_DEFAULT_REGION="us-east-1" \
aws --endpoint-url=https://s3.pub2.infomaniak.cloud s3api create-bucket --bucket kalink-studio
```

### 4. Fill `.env.production.local`

```dotenv
DATABASE_URL=postgresql://...
DATABASE_URL_DIRECT=postgresql://...
PAYLOAD_SECRET=replace-with-production-payload-secret
NEXT_PUBLIC_SITE_URL=https://www.kalink.ch
PAYLOAD_PUBLIC_SERVER_URL=https://www.kalink.ch

S3_ENDPOINT=https://s3.pub2.infomaniak.cloud
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true
S3_BUCKET=kalink-studio
S3_ACCESS_KEY_ID=<value from PRODUCTION_S3_ACCESS_KEY_ID>
S3_SECRET_ACCESS_KEY=<value from PRODUCTION_S3_SECRET_ACCESS_KEY>

RESEND_API_KEY=replace-with-production-resend-api-key
```

### 5. Generate the production Sealed Secret

```bash
kubectl create secret generic kalink-studio-secrets \
  --namespace production \
  --from-env-file=.env.production.local \
  --dry-run=client -o yaml | \
kubeseal --format yaml --namespace production > k8s/overlays/production/sealedsecret.yaml
```

## Verification

List buckets with the environment-specific credentials.

Staging:

```bash
AWS_ACCESS_KEY_ID="$STAGING_S3_ACCESS_KEY_ID" \
AWS_SECRET_ACCESS_KEY="$STAGING_S3_SECRET_ACCESS_KEY" \
AWS_DEFAULT_REGION="us-east-1" \
aws --endpoint-url=https://s3.pub2.infomaniak.cloud s3api list-buckets
```

Production:

```bash
AWS_ACCESS_KEY_ID="$PRODUCTION_S3_ACCESS_KEY_ID" \
AWS_SECRET_ACCESS_KEY="$PRODUCTION_S3_SECRET_ACCESS_KEY" \
AWS_DEFAULT_REGION="us-east-1" \
aws --endpoint-url=https://s3.pub2.infomaniak.cloud s3api list-buckets
```

After deployment, also verify:

- `https://staging.kalink.ch/api/health`
- `https://staging.kalink.ch/admin`
- production uploads target `kalink-studio`
- staging uploads target `kalink-studio-staging`

## Rotation

Rotate credentials per environment with this sequence:

1. Create a new S3 credential pair with the matching cloud profile, for example `openstack --os-cloud kalink-stg ec2 credentials create` or `openstack --os-cloud kalink-prd ec2 credentials create`.
2. Update the matching `.env.*.local` file.
3. Regenerate the matching Sealed Secret.
4. Deploy the updated secret.
5. Verify uploads still work.
6. Delete the old credential from Infomaniak.

## Compact Command Summary

```bash
openstack --os-cloud kalink-stg token issue
openstack --os-cloud kalink-prd token issue

STAGING_CREDS_JSON="$(openstack --os-cloud kalink-stg ec2 credentials create -f json)"
export STAGING_S3_ACCESS_KEY_ID="$(echo "$STAGING_CREDS_JSON" | jq -r '.access')"
export STAGING_S3_SECRET_ACCESS_KEY="$(echo "$STAGING_CREDS_JSON" | jq -r '.secret')"
AWS_ACCESS_KEY_ID="$STAGING_S3_ACCESS_KEY_ID" AWS_SECRET_ACCESS_KEY="$STAGING_S3_SECRET_ACCESS_KEY" AWS_DEFAULT_REGION="us-east-1" aws --endpoint-url=https://s3.pub2.infomaniak.cloud s3api create-bucket --bucket kalink-studio-staging
kubectl create secret generic kalink-studio-secrets --namespace staging --from-env-file=.env.staging.local --dry-run=client -o yaml | kubeseal --format yaml --namespace staging > k8s/overlays/staging/sealedsecret.yaml

PRODUCTION_CREDS_JSON="$(openstack --os-cloud kalink-prd ec2 credentials create -f json)"
export PRODUCTION_S3_ACCESS_KEY_ID="$(echo "$PRODUCTION_CREDS_JSON" | jq -r '.access')"
export PRODUCTION_S3_SECRET_ACCESS_KEY="$(echo "$PRODUCTION_CREDS_JSON" | jq -r '.secret')"
AWS_ACCESS_KEY_ID="$PRODUCTION_S3_ACCESS_KEY_ID" AWS_SECRET_ACCESS_KEY="$PRODUCTION_S3_SECRET_ACCESS_KEY" AWS_DEFAULT_REGION="us-east-1" aws --endpoint-url=https://s3.pub2.infomaniak.cloud s3api create-bucket --bucket kalink-studio
kubectl create secret generic kalink-studio-secrets --namespace production --from-env-file=.env.production.local --dry-run=client -o yaml | kubeseal --format yaml --namespace production > k8s/overlays/production/sealedsecret.yaml
```
