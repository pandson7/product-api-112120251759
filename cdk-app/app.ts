#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProductApiStack } from './product-api-stack';

const app = new cdk.App();
new ProductApiStack(app, 'ProductApiStack112120251759', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
});
