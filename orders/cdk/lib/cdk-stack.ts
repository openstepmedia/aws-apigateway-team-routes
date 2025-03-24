import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

export class OrderRoutesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Import the existing API Gateway
    // You need to know the API ID, which you can get from the AWS Console or previous deployment outputs
    const existingApi = apigateway.RestApi.fromRestApiId(
      this,
      'ImportedApi',
      cdk.Fn.importValue('TeamCommerceApiGatewayStack:ApiId') // This assumes you've exported the API ID
    );

    // Create a Lambda function to handle the version request
    const versionLambda = new lambda.Function(this, 'OrderVersionFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'transcode-version-lambda.handler',
      code: lambda.Code.fromAsset('lambda'), // This assumes the file is in a 'lambda' directory
      environment: {
        ENVIRONMENT: 'production'
      },
      description: 'Lambda function that returns the transcode service version',
    });

    // Create the main 'transcode' resource
    const transcodeResource = existingApi.root.addResource('order');
    
    // Add a default method to the transcode endpoint
    transcodeResource.addMethod('GET', new apigateway.LambdaIntegration(versionLambda));

    // Create the 'version' sub-resource
    const versionResource = transcodeResource.addResource('version');
    
    // Add a method to the version endpoint
    versionResource.addMethod('GET', new apigateway.LambdaIntegration(versionLambda));

    // Output the full URL for the version endpoint
    new cdk.CfnOutput(this, 'TranscodeVersionEndpoint', {
      value: `${existingApi.url}transcode/version`,
      description: 'URL for the transcode version endpoint',
    });
  }
}

// App and stack setup
const app = new cdk.App();
new TranscodeRoutesStack(app, 'TranscodeRoutesStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
});