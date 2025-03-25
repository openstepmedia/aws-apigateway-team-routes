import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';

export class LambdaLayerStack extends cdk.Stack {
  public readonly layer: lambda.LayerVersion;
  
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const codePath = path.join(__dirname, '..', '..', 'layer');

    this.layer = new lambda.LayerVersion(this, 'UsersLayer', {
      compatibleRuntimes: [
        lambda.Runtime.NODEJS_18_X,
        lambda.Runtime.NODEJS_20_X
      ],
      code: lambda.Code.fromAsset(codePath), // Layer directory with Flydrive
      description: 'User Lambda layer',
      layerVersionName: 'FlydriveLayer',
    });

    new cdk.CfnOutput(this, 'LayerArnOutput', {
      value: this.layer.layerVersionArn,
      description: 'The ARN of the User Lambda Layer',
    });
  }
}
