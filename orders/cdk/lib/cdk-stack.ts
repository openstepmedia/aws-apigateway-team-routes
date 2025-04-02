import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export interface OrdersApiProps extends cdk.StackProps {
  existingApiStackName: string;
}

export class OrdersResourceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: OrdersApiProps) {
    super(scope, id, props);

    // Create a Lambda function to handle the version request
    const codePath = path.join(__dirname, '..', '..', 'api');
    const lambdaHandler = new lambda.Function(this, 'OrdersLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(codePath), // This assumes the file is in a 'lambda' directory
      environment: {
        ENVIRONMENT: 'production',
        API_BASE: '/orders/v1',
        API_VERSION: '1.0.0',
        API_LOG_LEVEL: 'debug',
      },
      description: 'Lambda managed by the Orders Service Team',
    });    

    const apiId = cdk.Fn.importValue(`${props.existingApiStackName}:ApiId`);
    const apiRootResource = cdk.Fn.importValue(`${props.existingApiStackName}:RootResourceId`);

    // Import the existing API Gateway using fromRestApiAttributes
    const existingApi = apigateway.RestApi.fromRestApiAttributes(this,'ImportedApi', {
        restApiId: apiId,
        rootResourceId: apiRootResource
    });

    // Create the /orders path
    const ordersResource = existingApi.root.addResource('orders');

    // Create the /orders/{proxy+} path
    // @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway.ProxyResourceOptions.html
    ordersResource.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(lambdaHandler),

      // "false" will require explicitly adding methods on the `proxy` resource
      anyMethod: true, // "true" is the default  
    });

    // Method 1: Add documentation using ApiGatewayDocumentationPart
    new apigateway.CfnDocumentationPart(this, 'GetOrdersDoc', {
      restApiId: apiId,
      location: {
        path: '/orders/v1/status',
        method: 'GET',
        type: 'METHOD'
      },
      properties: JSON.stringify({
        summary: 'Get order api status',
        description: 'Retrieves a list of all registered users'
      })
    });    

  }
}