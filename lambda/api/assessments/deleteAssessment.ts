import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import {
  DeleteAssessment,
  AssessmentRepository,
} from "../../../repository/assessment";
import { S3Repository } from "../../../repository/s3";
import { apiResponse } from "../../../utils";

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const body: DeleteAssessment = event.body && JSON.parse(event.body);
  const assessmentType = event.pathParameters?.assessmentType;
  if (!assessmentType) {
    return apiResponse(400, "Please provide the assessment type");
  }
  if (!body?.clientName) {
    return apiResponse(400, "Please provide the client name");
  }
  console.log("ASSESSMENT TYPE", assessmentType);
  console.log("ASSESSMENT TYPE DECODED", decodeURI(assessmentType));
  try {
    const decodedAssessmentType = decodeURI(assessmentType);
    const assessment = await AssessmentRepository.getAssessment(
      body.clientName,
      decodedAssessmentType
    );
    if (!assessment) {
      return apiResponse(404, "Assessment not found!");
    }

    const requests = [];

    requests.push(
      AssessmentRepository.deleteAssessment({
        ...body,
        assessmentType: decodedAssessmentType,
      })
    );

    assessment.questions.forEach((question) => {
      if (question.imageUrl) {
        requests.push(S3Repository.deleteObject(question.imageUrl));
      }
      question.answers.forEach((answer) => {
        if (answer.imageUrl) {
          requests.push(S3Repository.deleteObject(answer.imageUrl));
        }
      });
    });

    await Promise.all(requests);

    return apiResponse(200, "Assessment deleted successfully");
  } catch (error) {
    return apiResponse(400, (error as Error).message);
  }
};
