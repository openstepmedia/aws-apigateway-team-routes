import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

// Define a stack to demonstrate importing the existing API Gateway
class TestApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lookup the existing stack outputs using Fn.importValue
    const apiId = cdk.Fn.importValue('TeamCommerceApiGatewayStack:ApiId');
    const apiArn = cdk.Fn.importValue('TeamCommerceApiGatewayStack:ApiArn');

    console.debug('Imported API Gateway ID:', apiId);
    console.debug('Imported API Gateway ARN:', apiArn);

    // Reference the existing API Gateway using the imported ApiId
    const existingApi = apigateway.RestApi.fromRestApiId(this, 'ImportedApiGateway', apiId);

    console.debug('existingApi:', existingApi);

    // Optionally, output the imported API Gateway ARN and ID for verification
    new cdk.CfnOutput(this, 'ImportedApiId', {
      value: existingApi.restApiId,
      description: 'The ID of the imported API Gateway',
    });

    new cdk.CfnOutput(this, 'ImportedApiArn', {
      value: apiArn,
      description: 'The ARN of the imported API Gateway',
    });

    // You can now use `existingApi` in your stack as needed
    // For example, adding new resources or methods:
    // const resource = existingApi.root.addResource('test');
    // resource.addMethod('GET');
  }
}

test('Gateway info', () => {
    // Create an app and instantiate the stack for testing
    const app = new cdk.App();
      new TestApiGatewayStack(app, 'TestApiGatewayStack', {
      env: {
          account: process.env.CDK_DEFAULT_ACCOUNT,
          region: process.env.CDK_DEFAULT_REGION,
      },
    });
});

// Export for testing purposes (optional)
// export { TestApiGatewayStack };