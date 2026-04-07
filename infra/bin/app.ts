#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ShopStack } from '../lib/shop-stack';

const app = new cdk.App();

new ShopStack(app, 'ShopStack', {
  env: {
    region: process.env.AWS_REGION ?? 'eu-west-1',
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
  description: 'React shop application - S3 + CloudFront infrastructure',
});
