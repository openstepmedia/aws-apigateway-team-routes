// dynamo-table.ts
import { Construct } from 'constructs';
import { Stack, StackProps, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export interface DynamoDBTableStackProps extends StackProps {
  readonly tableName?: string;
}

export class DynamoDBTableStack extends Stack {
  public readonly tableArn: string;
  public readonly tableName: string;

  constructor(scope: Construct, id: string, props?: DynamoDBTableStackProps) {
    super(scope, id, props);

    // Create a DynamoDB table
    const table = new dynamodb.Table(this, 'SimpleTable', {
      partitionKey: { 
        name: 'id', 
        type: dynamodb.AttributeType.STRING 
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY, // Use RETAIN in production
      tableName: props?.tableName || 'SimpleTable',
    });

    // Add Global Secondary Index for accountId
    table.addGlobalSecondaryIndex({
      indexName: 'AccountIdIndex',
      partitionKey: { 
        name: 'accountId', 
        type: dynamodb.AttributeType.STRING 
      },
      projectionType: dynamodb.ProjectionType.ALL
    });

    // Set class properties
    this.tableArn = table.tableArn;
    this.tableName = table.tableName;

    // Output the table ARN and name
    new CfnOutput(this, 'TableArn', {
      value: table.tableArn,
      description: 'The ARN of the DynamoDB table',
    });

    new CfnOutput(this, 'TableName', {
      value: table.tableName,
      description: 'The name of the DynamoDB table',
    });
  }
}

/*
app.ts - Example usage
import { App } from 'aws-cdk-lib';
import { DynamoDBTableStack } from './dynamo-table';

const app = new App();
new DynamoDBTableStack(app, 'DynamoDBTableStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
  tableName: 'MySimpleTable'
});
*/