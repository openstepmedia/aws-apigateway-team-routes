import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables from users/.env file
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// Import OpenAPI specification if it exists
const openapiJsonPath = path.join(__dirname, '..', '..', 'api', 'openapi.json');
const openapiJson = fs.existsSync(openapiJsonPath) 
  ? JSON.parse(fs.readFileSync(openapiJsonPath, 'utf8'))
  : undefined;

export interface ApiProps extends cdk.StackProps {
  existingApiStackName: string;
}

export class UsersResourceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id, props);
    let layers = [];

    // Create a Lambda Layer to include npm packages
    const layerPath = path.join(__dirname, '..', '..', 'layers');
    if (layerPath) {
      const layer = new lambda.LayerVersion(this, 'UsersLayer', {
        compatibleRuntimes: [
          lambda.Runtime.NODEJS_20_X
        ],
        code: lambda.Code.fromAsset(layerPath), // Layer directory with Flydrive
        description: 'User Lambda layer',
        layerVersionName: 'UserLambdaLayer',
      });
      layers.push(layer);
    }

    // Create a Lambda function to handle the version request
    const apiVersion = process.env.API_VERSION ?? 'v1';
    const lambdaPath = path.join(__dirname, '..', '..', 'api');
    const lambdaHandler = new lambda.Function(this, 'ProxyLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(lambdaPath), // This assumes the file is in a 'lambda' directory
      environment: {
        ENVIRONMENT: 'production',
        API_BASE: `/users/${apiVersion}`,
        API_VERSION: apiVersion,
        API_LOG_LEVEL: process.env.API_LOG_LEVEL ?? 'debug',
        BUILD_NUMBER: process.env.BUILD_NUMBER ?? '0',
      },
      description: 'Lambda managed by the Users Service Team',
      layers: layers,
    });    

    const apiId = cdk.Fn.importValue(`${props.existingApiStackName}:ApiId`);
    const apiRootResource = cdk.Fn.importValue(`${props.existingApiStackName}:RootResourceId`);

    // Import the existing API Gateway using fromRestApiAttributes
    const existingApi = apigateway.RestApi.fromRestApiAttributes(this, 'ImportedApi', {
        restApiId: apiId,
        rootResourceId: apiRootResource
    });

    // Create the /users/v1 path
    const routeResource = existingApi.root.addResource('users');
    const versionResource = routeResource.addResource(process.env.API_VERSION ?? 'v1');

    // Create the /users/{proxy+} path
    // @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.ProxyResourceOptions.html
    versionResource.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(lambdaHandler),

      // "false" will require explicitly adding methods on the `proxy` resource
      anyMethod: true, // "true" is the default  
    });

    // Add documentation using ApiGatewayDocumentationPart
    new apigateway.CfnDocumentationPart(this, 'UsersDocumentationPart', {
      restApiId: apiId,
      location: {
        path: `/users/${apiVersion}/{proxy+}`,
        type: 'RESOURCE'
      },
      properties: JSON.stringify(
        openapiJson || { summary: 'Users API', description: 'Proxy resource that handles all requests under /users/v1/' }
      )
    });    
  }
}
