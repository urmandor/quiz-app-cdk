import { Stack, StackProps, aws_apigateway } from "aws-cdk-lib";
import { Construct } from "constructs";
import { getAPIFunctions } from "../cdk/lambda";
import { Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { apiRoutes } from "../cdk/apiRoutes";
import { getTable } from "../cdk/dynamodb";

export class QuizAppCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaFunctions = getAPIFunctions(this, `${id}-Lambda`);

    const api = new aws_apigateway.RestApi(this, `${id}-API`, {
      restApiName: "Quiz Service",
      description: "This service serves quiz.",
    });

    const endpoints: { [key: string]: aws_apigateway.Resource } = {};

    const routes: {
      path: string;
      method: "GET" | "POST" | "PUT" | "DELETE";
      lambda: LambdaFunction;
    }[] = apiRoutes.map((route) => {
      return { ...route, lambda: lambdaFunctions[route.lambda] };
    });

    routes.forEach(({ path, method, lambda }) => {
      const lambdaIntegration = new aws_apigateway.LambdaIntegration(lambda);

      if (!endpoints[path]) {
        endpoints[path] = api.root.addResource(path);
      }
      endpoints[path].addMethod(method, lambdaIntegration);
    });

    getTable(this, lambdaFunctions);
  }
}
