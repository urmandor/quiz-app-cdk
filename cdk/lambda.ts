import { Stack, aws_lambda, Duration } from "aws-cdk-lib";
import {
  BundlingOptions,
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

interface LambdaProps {
  bundling: BundlingOptions;
  memorySize: number;
  runtime: aws_lambda.Runtime;
  tracing: aws_lambda.Tracing;
  timeout: Duration;
}

class LambdaConstruct extends Construct {
  functionName: string;
  lambda: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    name: string,
    props: NodejsFunctionProps
  ) {
    super(scope, id);
    this.functionName = name;
    console.log('name',name, id);
    this.lambda = new NodejsFunction(scope, name, {
      functionName: name,
      ...props,
    });
  }
}

const getNodejsFunction = (
  stack: Stack,
  id: string,
  subfolder: string,
  functionName: string,
  extraProps: NodejsFunctionProps
) => {
  const lambdaProps: LambdaProps = {
    bundling: { minify: true, sourceMap: true },
    memorySize: 512,
    runtime: aws_lambda.Runtime.NODEJS_16_X,
    tracing: aws_lambda.Tracing.ACTIVE,
    timeout: Duration.seconds(20),
  };

  return new LambdaConstruct(
    stack,
    id,
    `Ss-Func${functionName.charAt(0).toUpperCase()}${functionName.slice(1)}`,
    {
      ...lambdaProps,
      ...extraProps,
      entry: path.resolve(
        __dirname,
        `../lambda/${subfolder}/${functionName}.ts`
      ),
    }
  ).lambda;
};

export const getAPIFunctions = (
  stack: Stack,
  id: string
): { [key: string]: NodejsFunction } => {
  return {
    helloFunction: getNodejsFunction(stack, id, "api", "hello", {}),
  };
};
