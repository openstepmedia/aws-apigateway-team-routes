import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { OrdersResourceStack } from '../lib/cdk-stack';

const app = new cdk.App();


try {

  new OrdersResourceStack(app, 'OrdersResourceStack', {
    existingApiStackName: 'TeamCommerceApiGatewayStack',
  }); 

} catch (err) {
  console.error(err);
}
