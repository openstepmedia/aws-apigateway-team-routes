/**
 * Create a new API Gateway REST API with CloudWatch logging enabled
 * and a default CORS configuration.
 * Includes a build-number Lambda function route
 */
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Get build number from environment variable or use default
const buildNumber = process.env.BUILD_NUMBER ?? '1.0.0';

export class TeamCommerceApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // Add a tag to the stack with the build number
    cdk.Tags.of(this).add('BuildNumber', buildNumber);

    // Create a new API Gateway REST API
    const api = new apigateway.RestApi(this, 'TeamCommerceApi', {
      restApiName: 'TeamCommerce API Service',
      description: 'Infrastructure for the TeamCommerce API Service',

      deployOptions: {
        stageName: 'prod',
        // Enable CloudWatch logging for API Gateway
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },

      // Default CORS configuration
      /*
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
      */
    });

    // Create a Lambda function that returns a build number
    const buildNumberLambda = new lambda.Function(this, 'BuildNumberFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          const buildNumber = process.env.BUILD_NUMBER ?? '1.0.0';
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
              buildNumber: buildNumber,
              timestamp: new Date().toISOString()
            })
          };
        };
      `),
      environment: {
        BUILD_NUMBER: buildNumber, // Loaded from .env file
      },
      description: 'Lambda function that returns the current build number',
    });

    // Create an API Gateway resource and method for the build number endpoint
    const infraResource = api.root.addResource('infra');
    const versionResource = infraResource.addResource('v1');
    const buildNumberResource = versionResource.addResource('build');
    
    // Integrate the Lambda function with the API Gateway
    buildNumberResource.addMethod('GET', new apigateway.LambdaIntegration(buildNumberLambda, {
      proxy: true,
    }));

    // Create an API Gateway deployment to deploy the API
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      exportName: 'TeamCommerceApiGatewayStack:ApiEndpoint',
      description: 'The URL of the API Gateway endpoint',
    });
    
    // Output the build number endpoint URL
    new cdk.CfnOutput(this, 'BuildNumberEndpoint', {
      value: `${api.url}build/number`,
      description: 'The URL of the build number endpoint',
    });
    
    // Output the API ARN
    new cdk.CfnOutput(this, 'ApiArn', {
      value: api.arnForExecuteApi(),
      exportName: 'TeamCommerceApiGatewayStack:ApiArn',
      description: 'The ARN of the API Gateway',
    });
    
    // Output the API ID
    new cdk.CfnOutput(this, 'ApiId', {
      value: api.restApiId,
      exportName: 'TeamCommerceApiGatewayStack:ApiId',
      description: 'The ID of the API Gateway',
    });
    
    // Export RootResourceId
    new cdk.CfnOutput(this, 'RootResourceId', {
      value: api.root.resourceId,
      exportName: 'TeamCommerceApiGatewayStack:RootResourceId',
    });    
  }
}
