import { APIGatewayEvent, Context } from "aws-lambda";
import { AssessmentRepository } from "../../../repository/assessment";
import { apiResponse } from "../../../utils";

export const handler = async (event: APIGatewayEvent, _context: Context) => {
  const client = event.queryStringParameters?.client;
  if (!client) {
    return apiResponse(400, "Please provide a client");
  }
  const limit =
    (event.queryStringParameters?.limit &&
      Number(event.queryStringParameters?.limit)) ||
    undefined;
  const offset =
    event.queryStringParameters?.offset &&
    JSON.parse(
      Buffer.from(event.queryStringParameters?.offset, "base64").toString()
    );
  const assessments = await AssessmentRepository.getAllAssessments(
    decodeURI(client),
    limit,
    offset
  );
  return apiResponse(200, assessments);
};
