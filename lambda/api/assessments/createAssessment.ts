import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { AssessmentRepository } from "../../../repository/assessment";
import { IAssessment } from "../../../entities/Assessment";
import { apiResponse } from "../../../utils";

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const body: IAssessment = event.body && JSON.parse(event.body);
  if (!body?.clientName) {
    return apiResponse(400, "Please provide the client name");
  }
  if (!body?.assessmentType) {
    return apiResponse(400, "Please provide an assessment type");
  }
  if (!body?.questions || body?.questions.length === 0) {
    return apiResponse(400, "Please provide the list of questions and answers");
  }

  try {
    const assessment = await AssessmentRepository.getAssessment(
      body.clientName,
      body.assessmentType
    );
    if (assessment) {
      return apiResponse(
        400,
        `Assessment ${body.assessmentType} already exists`
      );
    }
    await AssessmentRepository.saveAssessment(body);
    return apiResponse(200, "Assessment created successfully");
  } catch (error) {
    return apiResponse(400, (error as Error).message);
  }
};
