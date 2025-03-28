/**
 * Create a new API Gateway REST API with CloudWatch logging enabled
 * and a default CORS configuration.
 * Includes a build-number Lambda function route
 */
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Get build number from environment variable or use default
const buildNumber = process.env.BUILD_NUMBER ?? '1.0.0';

export class StateMachineLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // Add a tag to the stack with the build number
    cdk.Tags.of(this).add('BuildNumber', buildNumber);

    // Create a Lambda Layer to include npm packages
    const layers = [];
    const layerPath = path.join(__dirname, '..', '..', 'layers');
    if (layerPath) {
      const layer = new lambda.LayerVersion(this, 'StateMachineLambdaStackLayer', {
        compatibleRuntimes: [
          lambda.Runtime.NODEJS_20_X
        ],
        code: lambda.Code.fromAsset(layerPath),
        description: 'Lambda layer',
        layerVersionName: 'LambdaLayer',
      });
      layers.push(layer);
    }    

    // Create a Lambda function to handle the version request
    const apiVersion = process.env.API_VERSION ?? 'v1';
    const lambdaPath = path.join(__dirname, '..', '..', 'app');
    const lambdaHandler = new lambda.Function(this, 'ProxyLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'statemachine.handler',
      code: lambda.Code.fromAsset(lambdaPath), // This assumes the file is in a 'lambda' directory
      environment: {
        API_BASE: 'coupons',
        API_VERSION: apiVersion,
        API_LOG_LEVEL: process.env.API_LOG_LEVEL ?? 'debug',
        BUILD_NUMBER: process.env.BUILD_NUMBER ?? '0',
      },
      description: 'Lambda managed by the Users Service Team',
      layers: layers,
    });
    
    // Output the build number endpoint URL
    new cdk.CfnOutput(this, 'StateMachineLambdaStackLambdaArn', {
      value: lambdaHandler.functionArn,
      description: 'Lambda arn',
      exportName: 'StateMachineLambdaStack:Arn',
    });    
  }
}
