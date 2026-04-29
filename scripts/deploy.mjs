#!/usr/bin/env node
/**
 * Uploads the built app to S3 and invalidates the CloudFront cache.
 * Reads bucket name and distribution ID from cdk-outputs.json produced by
 * `npm run cdk:deploy`.
 *
 * Usage:
 *   node scripts/deploy.mjs           # upload + invalidate
 *   node scripts/deploy.mjs --upload-only
 *   node scripts/deploy.mjs --invalidate-only
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUTPUTS_FILE = resolve(ROOT, 'cdk-outputs.json');
const DIST_DIR = resolve(ROOT, 'dist');

const args = process.argv.slice(2);
const uploadOnly = args.includes('--upload-only');
const invalidateOnly = args.includes('--invalidate-only');

// ── Read CDK outputs ──────────────────────────────────────────────────────────
if (!existsSync(OUTPUTS_FILE)) {
  console.error(
    '❌  cdk-outputs.json not found.\n' +
    '   Run `npm run cdk:deploy` first to create the infrastructure.'
  );
  process.exit(1);
}

const outputs = JSON.parse(readFileSync(OUTPUTS_FILE, 'utf-8'));
const stackOutputs = outputs['ShopStack'];

if (!stackOutputs) {
  console.error('❌  ShopStack outputs not found in cdk-outputs.json');
  process.exit(1);
}

const bucketName = stackOutputs['BucketName'];
const distributionId = stackOutputs['DistributionId'];
const distributionDomain = stackOutputs['DistributionDomain'];

if (!bucketName || !distributionId) {
  console.error('❌  BucketName or DistributionId missing from cdk-outputs.json');
  process.exit(1);
}

// ── Upload to S3 ─────────────────────────────────────────────────────────────
if (!invalidateOnly) {
  if (!existsSync(DIST_DIR)) {
    console.error('❌  dist/ directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  console.log(`\n📦  Uploading dist/ → s3://${bucketName} …`);
  execSync(`aws s3 sync "${DIST_DIR}/" "s3://${bucketName}" --delete`, {
    stdio: 'inherit',
  });
  console.log('✅  Upload complete.');
}

// ── Invalidate CloudFront cache ───────────────────────────────────────────────
if (!uploadOnly) {
  console.log(`\n🔄  Invalidating CloudFront distribution ${distributionId} …`);
  execSync(
    `aws cloudfront create-invalidation --distribution-id "${distributionId}" --paths "/*"`,
    { stdio: 'inherit' }
  );
  console.log('✅  Invalidation created.');
}

if (distributionDomain) {
  console.log(`\n🌍  Live URL: https://${distributionDomain}`);
}
