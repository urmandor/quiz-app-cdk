import {
  IAssessment,
  Assessment,
  IQuestion,
  generateAssessmentPK,
} from "../entities/Assessment";
import { S3Repository } from "./s3";

type PK = { assessmentType: string; clientName: string };
export type DeleteAssessment = Partial<IAssessment> & Required<PK>;
export type UpdateAssessment = DeleteAssessment & {
  newClientName?: string;
};

export class AssessmentRepository {
  static async getAllAssessments(
    clientName: string,
    limit?: number,
    offset?: { [x: string]: any }
  ): Promise<{
    data: IAssessment[];
    offset?: {
      [x: string]: any;
    };
    count?: number;
  }> {
    const options: { [name: string]: any } = {};
    if (limit) {
      options.limit = limit;
    }
    if (offset) {
      options.startKey = offset;
    }

    const results = await Assessment.query(
      generateAssessmentPK(clientName),
      options
    );

    const items = await Promise.all(
      (results.Items as IAssessment[])?.map(this.getPresignedUrls)
    );

    return {
      data: items,
      offset: results.LastEvaluatedKey,
      count: results.Count,
    };
  }

  static async getAssessment(
    clientName: string,
    assessmentType: string
  ): Promise<IAssessment> {
    const results = await Assessment.get({ clientName, assessmentType });
    return this.getPresignedUrls(<IAssessment>results.Item);
  }

  static async saveAssessment(assessment: IAssessment): Promise<void> {
    console.log("saveing assessment", assessment);
    await Assessment.put(assessment);
  }

  static async updateAssessment(assessment: UpdateAssessment): Promise<void> {
    console.log("updating assessment", assessment);
    if (assessment.newClientName) {
      console.log("new clientName", assessment.newClientName);
      await Assessment.delete({
        clientName: assessment.clientName,
        assessmentType: assessment.assessmentType,
      });
      await Assessment.put({
        clientName: assessment.newClientName,
        assessmentType: assessment.assessmentType,
        questions: assessment.questions as IQuestion[],
      });
    } else {
      await Assessment.update({
        clientName: assessment.clientName,
        assessmentType: assessment.assessmentType,
        questions: assessment.questions as IQuestion[],
      });
    }
  }

  static async deleteAssessment(assessment: DeleteAssessment): Promise<void> {
    await Assessment.delete(assessment);
  }

  static async deleteAllAssessments(clientName: string): Promise<void> {
    const { data: assessments } = await AssessmentRepository.getAllAssessments(
      clientName
    );

    const requests: Promise<void>[] = [];

    assessments.forEach((assessment) =>
      assessment.questions.forEach((question) => {
        if (question.imageUrl) {
          requests.push(S3Repository.deleteObject(question.imageUrl));
        }
        question.answers.forEach((answer) => {
          if (answer.imageUrl) {
            requests.push(S3Repository.deleteObject(answer.imageUrl));
          }
        });
      })
    );

    assessments.map((assessment) =>
      requests.push(AssessmentRepository.deleteAssessment(assessment))
    );

    await Promise.all(requests);

    return;
  }

  static async getPresignedUrls(item: IAssessment): Promise<IAssessment> {
    console.log("reading assessment", item.assessmentType);
    item.questions = await Promise.all(
      item.questions.map(async (question) => {
        console.log("reading question", question.questionText);
        if (question.imageUrl) {
          console.log("image found in question", question.imageUrl);
          const presignedUrl = await S3Repository.createPresignedUrl(
            question.imageUrl
          );
          console.log("presigned URL for question", presignedUrl);
          question.presignedUrl = presignedUrl;
        }
        console.log("reading answers");
        question.answers = await Promise.all(
          question.answers.map(async (answer) => {
            console.log("reading answer", answer.answerText);
            if (answer.imageUrl) {
              console.log("image found", answer.imageUrl);
              const presignedUrl = await S3Repository.createPresignedUrl(
                answer.imageUrl
              );
              console.log("presigned URL", presignedUrl);
              return { ...answer, presignedUrl };
            }
            return answer;
          })
        );
        return question;
      })
    );
    return item;
  }
}
