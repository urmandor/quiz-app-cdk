import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { IAssessment } from "../../../entities/Assessment";
import { AssessmentRepository } from "../../../repository/assessment";
import { S3Repository } from "../../../repository/s3";
import { apiResponse } from "../../../utils";

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const body: IAssessment = event.body && JSON.parse(event.body);
  if (!body?.clientName) {
    return apiResponse(400, "Please provide the client name");
  }
  const assessmentType = event.pathParameters?.assessmentType;
  if (!assessmentType) {
    return apiResponse(400, "Please provide the assessment type");
  }
  console.log("ASSESSMENT TYPE", assessmentType);
  console.log("ASSESSMENT TYPE DECODED", decodeURI(assessmentType));
  if (!body?.questions || body?.questions.length === 0) {
    return apiResponse(400, "Please provide the list of questions and answers");
  }
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

    assessment.questions.forEach((oldQuestion, questionIndex) => {
      if (oldQuestion?.imageUrl) {
        const imageExists = body.questions.some(
          (newQuestion) => oldQuestion.imageUrl === newQuestion.imageUrl
        );
        if (!imageExists) {
          console.log(
            `Removing image for quesiton[${questionIndex}], question = ${oldQuestion.questionText}`
          );
          console.log("image", oldQuestion.imageUrl);
          requests.push(S3Repository.deleteObject(oldQuestion.imageUrl));
        }
      }
      oldQuestion?.answers?.forEach((oldAnswer) => {
        if (oldAnswer?.imageUrl && body.questions[questionIndex]) {
          const imageExists = body.questions[questionIndex].answers.some(
            (newAnswer) => oldAnswer.imageUrl === newAnswer.imageUrl
          );
          if (!imageExists) {
            console.log(
              `Removing image for quesiton[${questionIndex}]'s answer = ${oldAnswer.answerText}`
            );
            console.log("image", oldAnswer.imageUrl);
            requests.push(S3Repository.deleteObject(oldAnswer.imageUrl));
          }
        }
      });
    });

    requests.push(
      AssessmentRepository.updateAssessment({
        ...body,
        assessmentType: decodedAssessmentType,
      })
    );

    await Promise.all(requests);

    return apiResponse(200, "Assessment updated successfully");
  } catch (error) {
    return apiResponse(400, (error as Error).message);
  }
};
