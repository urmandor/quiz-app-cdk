import { Table } from "dynamodb-toolbox";
import { Entity } from "dynamodb-toolbox";
import { IBaseEntity, QAPPTable } from "./BaseEntity";

export interface IAnswerChoice {
  answerText: string;
  isCorrect?: boolean;
  imageUrl?: string;
  presignedUrl?: string;
}

export interface IQuestion {
  questionText: string;
  imageUrl?: string;
  presignedUrl?: string;
  answers: IAnswerChoice[];
  isCorrect?: boolean;
}

export interface IAssessment extends IBaseEntity {
  clientName: string;
  assessmentType: string;
  passingScore?: number;
  questions: IQuestion[];
}

export const Assessment = new Entity<
  IAssessment,
  undefined,
  Table<string, "PK", "SK">
>({
  name: "Assessment",
  table: QAPPTable,
  attributes: {
    PK: {
      partitionKey: true,
      default: (data: IAssessment) => generateAssessmentPK(data.clientName),
    },
    SK: {
      sortKey: true,
      default: (data: IAssessment) => generateAssessmentSK(data.assessmentType),
    },
    clientName: { type: "string", required: true },
    assessmentType: { type: "string", required: true },
    passingScore: { type: "number", required: false },
    questions: { type: "list", required: true },
  },
});

export const generateAssessmentPK = (clientName: string) => {
  return `ASSESSMENT#CLIENT#${clientName}`;
};

export const generateAssessmentSK = (assessmentType: string) => {
  return `ASSESSMENT#${assessmentType}`;
};
