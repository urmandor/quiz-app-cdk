import { aws_apigateway, aws_s3, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { HttpMethods } from "aws-cdk-lib/aws-s3";

export const BUCKET_NAME = "qapp-bucket";

export const getS3Bucket = (
  stack: Stack,
  lambdaFunctions: { [key: string]: NodejsFunction }
) => {
  const bucket = new aws_s3.Bucket(stack, BUCKET_NAME, {
    blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
    objectOwnership: aws_s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
    encryption: aws_s3.BucketEncryption.S3_MANAGED,
    cors: [
      {
        allowedHeaders: ["*"],
        allowedOrigins: ["*"],
        allowedMethods: [
          HttpMethods.HEAD,
          HttpMethods.GET,
          HttpMethods.POST,
          HttpMethods.PUT,
          HttpMethods.DELETE,
        ],
      },
    ],
  });

  bucket.grantPut(lambdaFunctions.createPreSignedUrlFunction);
  bucket.grantRead(lambdaFunctions.getClientsFunction);
  bucket.grantDelete(lambdaFunctions.editClientFunction);
  bucket.grantDelete(lambdaFunctions.deleteClientFunction);
  bucket.grantRead(lambdaFunctions.getAssessmentsFunction);
  bucket.grantDelete(lambdaFunctions.editAssessmentFunction);
  bucket.grantDelete(lambdaFunctions.deleteAssessmentFunction);
  bucket.grantRead(lambdaFunctions.getAllAssessmentQuestionFunction)
  lambdaFunctions.createPreSignedUrlFunction.addEnvironment(
    "BUCKET_NAME",
    bucket.bucketName
  );

  return bucket;
};
