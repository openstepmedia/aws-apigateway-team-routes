import * as cdk from 'aws-cdk-lib';
import { LambdaLayerStack } from '../lib/cdk-layer-stack';
import { UsersResourceStack } from '../lib/cdk-stack';

const app = new cdk.App();

try {
  const lambdaLayer = new LambdaLayerStack(app, 'LambdaLayerStack');

  new UsersResourceStack(app, 'UsersResourceStack', {
    lambdaLayer: lambdaLayer,
    existingApiStackName: 'TeamCommerceApiGatewayStack',
  });

} catch (err) {
  console.error(err);
}
