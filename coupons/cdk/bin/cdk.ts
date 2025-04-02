#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { StateMachineLambdaStack } from '../lib/cdk-stack';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = new cdk.App();
try {
  new StateMachineLambdaStack(app, 'StateMachineLambdaStack');
} catch (err) {
  console.error(err);
}
