import * as cdk from 'aws-cdk-lib';
import { UsersResourceStack } from '../lib/cdk-stack';

const app = new cdk.App();

try {
  new UsersResourceStack(app, 'UsersResourceStack', {
    existingApiStackName: 'TeamCommerceApiGatewayStack',
  });

} catch (err) {
  console.error(err);
}
