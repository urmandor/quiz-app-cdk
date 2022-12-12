import { Table } from "dynamodb-toolbox";
import { Entity } from "dynamodb-toolbox";
import { IBaseEntity, QAPPTable } from "./BaseEntity";

export interface IScore {
  assessmentName: string;
  score: number;
}

export interface IResult extends IBaseEntity {
  clientName: string;
  driverName?: string;
  driverCnic: string;
  assessmentName: string;
  assessmentCorrectAnswers?: number;
  assessmentTotalAnswers?: number;
  passingScore?: number;
  isPassed: boolean;
}

export interface IAssessmentGroup {
  totalAttempts: number;
  passAttempts: number;
}

export interface IClientResult extends IBaseEntity {
  clientName: string;
  assessments: {
    [name: string]: IAssessmentGroup;
  };
}

export const Result = new Entity<IResult, undefined, Table<string, "PK", "SK">>(
  {
    name: "Result",
    table: QAPPTable,
    attributes: {
      PK: {
        partitionKey: true,
        default: (data: IResult) =>
          generateResultPK(data.clientName, data.driverCnic),
      },
      SK: {
        sortKey: true,
        default: (data: IResult) => generateResultSK(data.assessmentName),
      },
      GSI1PK: {
        type: "string",
        default: (data: IResult) =>
          generateResultGSI1PK(
            data.clientName,
            data.driverCnic,
            data.assessmentName
          ),
      },
      GSI1SK: {
        type: "string",
        default: (data: IResult) =>
          generateResultGSI1PK(
            data.clientName,
            data.driverCnic,
            data.assessmentName
          ),
      },
      clientName: { type: "string", required: true },
      driverName: { type: "string", required: false },
      driverCnic: { type: "string", required: true },
      assessmentName: { type: "string", required: true },
      assessmentCorrectAnswers: { type: "number", required: false },
      assessmentTotalAnswers: { type: "number", required: false },
      passingScore: { type: "number", required: false },
      isPassed: { type: "boolean", required: true },
    },
  }
);

export const generateResultPK = (clientName: string, driverCnic: string) => {
  return `RESULT#CLIENT#${clientName}#DRIVER#${driverCnic}`;
};

export const generateResultSK = (assessmentName: string) => {
  return `RESULT#ASSESSMENT#${assessmentName}`;
};

export const generateResultGSI1PK = (
  clientName: string,
  driverCnic: string,
  assessmentName: string
) =>
  `RESULT#CLIENT#${clientName}#DRIVER#${driverCnic}#ASSESSMENT#${assessmentName}`;
