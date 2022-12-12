import { Stack, StackProps, aws_apigateway } from "aws-cdk-lib";
import { Construct } from "constructs";
import { getAPIFunctions } from "../cdk/lambda";
import { apiRoutes } from "../cdk/apiRoutes";
import { getTable } from "../cdk/dynamodb";
import { getS3Bucket } from "../cdk/s3";

export class QuizAppCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaFunctions = getAPIFunctions(this, `${id}-Lambda`);

    const api = new aws_apigateway.RestApi(this, `${id}-API`, {
      restApiName: "Quiz Service",
      description: "This service serves quiz.",
      defaultCorsPreflightOptions: {
        allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
        allowMethods: aws_apigateway.Cors.ALL_METHODS,
        allowCredentials: true,
      },
    });

    const helloIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.helloFunction
    );
    const getClientsIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.getClientsFunction
    );
    const editClientIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.editClientFunction
    );
    const deleteClientIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.deleteClientFunction
    );
    const createClientIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.createClientFunction
    );
    const getDriversIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.getDriversFunction
    );
    const editDriverIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.editDriverFunction
    );
    const deleteDriverIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.deleteDriverFunction
    );
    const createDriverIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.createDriverFunction
    );
    const getAssessmentsIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.getAssessmentsFunction
    );
    const editAssessmentIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.editAssessmentFunction
    );
    const deleteAssessmentIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.deleteAssessmentFunction
    );
    const createAssessmentIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.createAssessmentFunction
    );

    const getAllAssessmentQuestionIntegration =
      new aws_apigateway.LambdaIntegration(
        lambdaFunctions.getAllAssessmentQuestionFunction
      );

    const getClientResultsIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.getClientResultsFunction
    );
    const getDriverResultsIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.getDriverResultsFunction
    );
    const getDriverResultIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.getDriverResultFunction
    );

    const createResultIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.createResultFunction
    );

    const createPreSignedUrlIntegration = new aws_apigateway.LambdaIntegration(
      lambdaFunctions.createPreSignedUrlFunction
    );

    const helloResource = api.root.addResource(apiRoutes.helloFunction.urlPath);
    helloResource.addMethod(apiRoutes.helloFunction.method, helloIntegration);

    ///////// Clients
    const clientResource = api.root.addResource(
      apiRoutes.getClientsFunction.urlPath
    );
    clientResource.addMethod(
      apiRoutes.getClientsFunction.method,
      getClientsIntegration
    );
    clientResource.addMethod(
      apiRoutes.createClientFunction.method,
      createClientIntegration
    );

    const singleClientResource = clientResource.addResource(
      apiRoutes.editClientFunction.urlPath
    );
    singleClientResource.addMethod(
      apiRoutes.editClientFunction.method,
      editClientIntegration
    );
    singleClientResource.addMethod(
      apiRoutes.deleteClientFunction.method,
      deleteClientIntegration
    );

    ///////// Drivers
    const driverResource = api.root.addResource(
      apiRoutes.getDriversFunction.urlPath
    );
    driverResource.addMethod(
      apiRoutes.getDriversFunction.method,
      getDriversIntegration
    );
    driverResource.addMethod(
      apiRoutes.createDriverFunction.method,
      createDriverIntegration
    );

    const singleDriverResource = driverResource.addResource(
      apiRoutes.editDriverFunction.urlPath
    );
    singleDriverResource.addMethod(
      apiRoutes.editDriverFunction.method,
      editDriverIntegration
    );
    singleDriverResource.addMethod(
      apiRoutes.deleteDriverFunction.method,
      deleteDriverIntegration
    );

    ///////// Assessments
    const assessmentResource = api.root.addResource(
      apiRoutes.getAssessmentsFunction.urlPath
    );
    assessmentResource.addMethod(
      apiRoutes.getAssessmentsFunction.method,
      getAssessmentsIntegration
    );
    assessmentResource.addMethod(
      apiRoutes.createAssessmentFunction.method,
      createAssessmentIntegration
    );

    const singleAssessmentResource = assessmentResource.addResource(
      apiRoutes.editAssessmentFunction.urlPath
    );
    singleAssessmentResource.addMethod(
      apiRoutes.editAssessmentFunction.method,
      editAssessmentIntegration
    );
    singleAssessmentResource.addMethod(
      apiRoutes.deleteAssessmentFunction.method,
      deleteAssessmentIntegration
    );

    const assessmentQuestionResource = singleAssessmentResource.addResource(
      apiRoutes.getAllAssessmentQuestionFunction.urlPath
    );
    assessmentQuestionResource.addMethod(
      apiRoutes.getAllAssessmentQuestionFunction.method,
      getAllAssessmentQuestionIntegration
    );

    ///////// Results
    const resultResource = api.root.addResource(
      apiRoutes.getClientResultsFunction.urlPath
    );
    resultResource.addMethod(
      apiRoutes.getClientResultsFunction.method,
      getClientResultsIntegration
    );
    resultResource.addMethod(
      apiRoutes.createResultFunction.method,
      createResultIntegration
    );

    const driverResultResource = resultResource.addResource(
      apiRoutes.getDriverResultsFunction.urlPath
    );
    driverResultResource.addMethod(
      apiRoutes.getDriverResultsFunction.method,
      getDriverResultsIntegration
    );
    const driverAssessmentResultResource = driverResultResource.addResource(
      apiRoutes.getDriverResultFunction.urlPath
    );
    driverAssessmentResultResource.addMethod(
      apiRoutes.getDriverResultFunction.method,
      getDriverResultIntegration
    );

    ///////// Files
    const fileResource = api.root.addResource(
      apiRoutes.createPreSignedUrlFunction.urlPath
    );

    fileResource.addMethod(
      apiRoutes.createPreSignedUrlFunction.method,
      createPreSignedUrlIntegration
    );

    getTable(this, lambdaFunctions);
    getS3Bucket(this, lambdaFunctions);

    ///////// Add Environment Vars...
    lambdaFunctions.createResultFunction.addEnvironment(
      "DEFAULT_PASSING_PERCENTAGE",
      "0.6"
    );
  }
}
