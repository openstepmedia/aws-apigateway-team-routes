#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { StateMachineLambdaStack } from '../lib/cdk-stack';
import { DynamoDBTableStack } from '../lib/ddb-stack';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = new cdk.App();
try {
  // Get build number from environment variable or use default
  new StateMachineLambdaStack(app, 'StateMachineLambdaStack');

  // Create a DynamoDB table stack
  new DynamoDBTableStack(app, 'DynamoDBTableStack', {
    tableName: 'Events'
  });
  
} catch (err) {
  console.error(err);
}
