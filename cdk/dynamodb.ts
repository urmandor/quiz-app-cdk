import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export const TABLE_NAME = "qapp-table";

export const getTable = (
  stack: Stack,
  lambdaFunctions: { [key: string]: NodejsFunction }
) => {
  const dynamoTable = new Table(stack, TABLE_NAME, {
    billingMode: BillingMode.PAY_PER_REQUEST,
    tableName: TABLE_NAME,
    timeToLiveAttribute: "TTL",
    partitionKey: { name: "PK", type: AttributeType.STRING },
    sortKey: { name: "SK", type: AttributeType.STRING },
    removalPolicy: RemovalPolicy.DESTROY,
  });

  dynamoTable.grantReadData(lambdaFunctions.helloFunction);
  return dynamoTable;
};
