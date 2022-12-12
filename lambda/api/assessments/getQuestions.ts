import { APIGatewayEvent, Context } from "aws-lambda";
import { AssessmentRepository } from "../../../repository/assessment";
import { ClientRepository } from "../../../repository/client";
import { apiResponse } from "../../../utils";

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  const clientName = event.queryStringParameters?.client;
  const assessmentType = event.pathParameters?.assessmentType;
  if (!clientName) {
    return apiResponse(400, "Please provide a client");
  }
  if (!assessmentType) {
    return apiResponse(400, "Please provide an assessment type");
  }
  const client = await ClientRepository.getClientByName(decodeURI(clientName));
  if (!client) {
    return apiResponse(404, "Client not found");
  }
  console.log('Assessmnet', assessmentType, client.clientName)
  const assessment = await AssessmentRepository.getAssessment(
    client.clientName,
    decodeURI(assessmentType)
  );
  if (!assessment) {
    return apiResponse(404, "Assessment not found");
  }
  return apiResponse(200, assessment);
};
