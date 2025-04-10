# Coupons Endpoint

This project is managed by the Coupons team

The coupons team needs their lambdas available for both 

AWS API Gateway

=- AND -=

AWS Step functions.

This is a proof of concept to show how lambda-api can be used 
as a front-controller for both methods.

https://github.com/jeremydaly/lambda-api

## lambda-api entry point

There are 2 lambda handler files for the lambda-api entry point:

`app/statemachine.mjs`

Note how the handler sets httpMethod in the handler, this is to declutter 
the statemachine.asl and get the benefits of the lambda-api routing and body 
parsing / serialization.


`app/apigateway.mjs`



## Controllers

For now there are 2 controllers:

`CouponsStatemachineController.mjs`

`CouponsApiGatewayController.mjs`

Theoretically, there could be a single controller for both, but the nature of the routes might have different contexts.




This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
