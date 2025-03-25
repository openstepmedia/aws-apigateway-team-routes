import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { LambdaLayerStack } from './cdk-layer-stack';

export interface ApiProps extends cdk.StackProps {
  existingApiStackName: string;
  lambdaLayer?: LambdaLayerStack;
}

export class UsersResourceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id, props);

    // Create a Lambda function to handle the version request
    const codePath = path.join(__dirname, '..', '..', 'api');
    const lambdaHandler = new lambda.Function(this, 'ProxyLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(codePath), // This assumes the file is in a 'lambda' directory
      environment: {
        ENVIRONMENT: 'production',
        API_BASE: '/users/v1',
        API_VERSION: '1.0.0',
        API_LOG_LEVEL: 'debug',
      },
      description: 'Lambda managed by the Users Service Team',
      layers: props.lambdaLayer ? [props.lambdaLayer.layer] : [],
    });    

    const apiId = cdk.Fn.importValue(`${props.existingApiStackName}:ApiId`);
    const apiRootResource = cdk.Fn.importValue(`${props.existingApiStackName}:RootResourceId`);

    // Import the existing API Gateway using fromRestApiAttributes
    const existingApi = apigateway.RestApi.fromRestApiAttributes(this,'ImportedApi', {
        restApiId: apiId,
        rootResourceId: apiRootResource
    });

    // Create the /users path
    const routeResource = existingApi.root.addResource('users');

    // Create the /users/{proxy+} path
    // @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.ProxyResourceOptions.html
    routeResource.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(lambdaHandler),

      // "false" will require explicitly adding methods on the `proxy` resource
      anyMethod: true, // "true" is the default  
    });

    // Method 1: Add documentation using ApiGatewayDocumentationPart
    new apigateway.CfnDocumentationPart(this, 'GetUsersDoc', {
      restApiId: apiId,
      location: {
        path: '/users/v1/status',
        method: 'GET',
        type: 'METHOD'
      },
      properties: JSON.stringify({
        summary: 'Get users api status',
        description: 'Retrieves a list of all registered users'
      })
    });    

  }
}
