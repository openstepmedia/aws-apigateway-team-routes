// JobQueueTable.js
import { Table } from 'dynamodb-toolbox';
import { getDocumentClient } from '../ddb/getDocumentClient.mjs';
import { Entity } from 'dynamodb-toolbox/entity'
import { item } from 'dynamodb-toolbox/schema/item'
import { string } from 'dynamodb-toolbox/schema/string'

// Define the DynamoDB Table
const JobQueueTable = new Table({
    
    name: 'JobQueue',
    sortKey: { name: "sk", type: "string" },
    partitionKey: { name: "pk", type: "string" },,
    documentClient: getDocumentClient(),
});

export const JobQueueEntity = new Entity({
    name: 'Job',
    table: JobQueueTable,
    schema: item({
        id: string().key(),
        name: string(),
    })
});
