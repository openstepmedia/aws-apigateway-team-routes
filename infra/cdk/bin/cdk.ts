#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { TeamCommerceApiGatewayStack } from '../lib/cdk-stack';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = new cdk.App();
try {
  new TeamCommerceApiGatewayStack(app, 'TeamCommerceApiGatewayStack', {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
    },

    // Apply custom S3 asset options to the stack
    // @see https://docs.aws.amazon.com/cdk/v2/guide/customize-synth.html
    /*
    synthesizer: new cdk.DefaultStackSynthesizer({
      fileAssetsBucketName: process.env.CDK_ASSETS_BUCKET_NAME,
      bucketPrefix: process.env.CDK_ASSETS_BUCKET_PREFIX,
      generateBootstrapVersionRule: false,
    }),
    */
  });

} catch (err) {
  console.error(err);
}
