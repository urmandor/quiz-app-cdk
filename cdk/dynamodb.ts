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

  dynamoTable.addGlobalSecondaryIndex({
    indexName: 'GSI1',
    partitionKey: { name: 'GSI1PK', type: AttributeType.STRING },
    sortKey: { name: 'GSI1SK', type: AttributeType.STRING },
  });

  dynamoTable.grantReadWriteData(lambdaFunctions.helloFunction);
  dynamoTable.grantReadData(lambdaFunctions.getClientsFunction);
  dynamoTable.grantReadWriteData(lambdaFunctions.editClientFunction);
  dynamoTable.grantReadWriteData(lambdaFunctions.deleteClientFunction);
  dynamoTable.grantReadWriteData(lambdaFunctions.createClientFunction);
  dynamoTable.grantReadData(lambdaFunctions.getDriversFunction);
  dynamoTable.grantReadWriteData(lambdaFunctions.editDriverFunction);
  dynamoTable.grantReadWriteData(lambdaFunctions.deleteDriverFunction);
  dynamoTable.grantReadWriteData(lambdaFunctions.createDriverFunction);
  dynamoTable.grantReadData(lambdaFunctions.getAssessmentsFunction);
  dynamoTable.grantReadWriteData(lambdaFunctions.editAssessmentFunction);
  dynamoTable.grantReadWriteData(lambdaFunctions.deleteAssessmentFunction);
  dynamoTable.grantReadWriteData(lambdaFunctions.createAssessmentFunction);
  dynamoTable.grantReadData(lambdaFunctions.getAllAssessmentQuestionFunction);
  dynamoTable.grantReadData(lambdaFunctions.getClientResultsFunction);
  dynamoTable.grantReadData(lambdaFunctions.getDriverResultsFunction);
  dynamoTable.grantReadWriteData(lambdaFunctions.createResultFunction);
  dynamoTable.grantReadData(lambdaFunctions.getDriverResultFunction);
  return dynamoTable;
};
