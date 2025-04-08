/**
 * Usage:
 * npm run test -- ddb.test.mjs --resetModules
 */
import { createDb } from "../app/ddb/index.mjs";
import { randomUUID } from "crypto";

describe('Example test', () => {
    test('should match object', async () => {

        const db = createDb();
        const result = await db.events.incrementEvent(randomUUID(), '2023-10-01', 'userId123', 1);
        expect(result).toBeDefined();

    });
});

/**
 * 
# 1. Define variables (optional, but makes it easier to customize)
TABLE_NAME="JobQueueTable"
REGION="us-east-1" # <-- CHANGE TO YOUR DESIRED AWS REGION (matches config.js)

docker run -p 8000:8000 -v /path/on/host:/home/dynamodblocal/data amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb -dbPath /home/dynamodblocal/data

# 2. AWS CLI command to create the table

aws dynamodb create-table \
    --table-name JobQueue \
    --attribute-definitions \
        AttributeName=pk,AttributeType=S \
        AttributeName=sk,AttributeType=S \
    --key-schema \
        AttributeName=pk,KeyType=HASH \
        AttributeName=sk,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url http://localhost:8000

aws dynamodb create-table \
    --table-name ${TABLE_NAME} \
    --attribute-definitions \
        AttributeName=pk,AttributeType=S \
        AttributeName=sk,AttributeType=S \
    --key-schema \
        AttributeName=pk,KeyType=HASH \
        AttributeName=sk,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --tags Key=Project,Value=JobQueueApp Key=Environment,Value=Development \
    --region ${REGION}

# 3. Check table status (optional, creation takes a moment)
# aws dynamodb describe-table --table-name ${TABLE_NAME} --region ${REGION} --query "Table.TableStatus"

# 4. OPTIONAL: Enable Time To Live (TTL) after the table is ACTIVE
#    Use the attribute name 'ttl' which was defined in the entity schemas.
#    Make sure the table status is ACTIVE before running this.
# aws dynamodb update-time-to-live \
#     --table-name ${TABLE_NAME} \
#     --time-to-live-specification Enabled=true,AttributeName=ttl \
#     --region ${REGION}

aws dynamodb create-table \
    --table-name MyTable \
    --attribute-definitions AttributeName=pk,AttributeType=S AttributeName=sk,AttributeType=S \
    --key-schema AttributeName=pk,KeyType=HASH AttributeName=sortKey,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url http://localhost:8000

5. OPTIONAL: List tables to verify creation
aws dynamodb list-tables --endpoint-url http://localhost:8000
 */