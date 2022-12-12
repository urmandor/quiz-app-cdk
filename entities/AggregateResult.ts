import { Table } from "dynamodb-toolbox";
import { Entity } from "dynamodb-toolbox";
import { IBaseEntity, QAPPTable } from "./BaseEntity";

export interface IAssessmentGroup {
  totalAttempts: number;
  passAttempts: number;
}

export interface IAggregateResult extends IBaseEntity {
  clientName: string;
  drivers: number;
  assessments: {
    [name: string]: IAssessmentGroup;
  };
}

export const AggregateResult = new Entity<
  IAggregateResult,
  undefined,
  Table<string, "PK", "SK">
>({
  name: "AggregateResult",
  table: QAPPTable,
  attributes: {
    PK: {
      partitionKey: true,
      default: (data: IAggregateResult) => generateAggregateResultPK(data.clientName),
    },
    SK: {
      sortKey: true,
      default: (data: IAggregateResult) => generateAggregateResultPK(data.clientName),
    },
    clientName: { type: "string", required: true },
    drivers: { type: "number", required: true },
    assessments: { type: "map", required: true },
  },
});

export const generateAggregateResultPK = (clientName: string) => {
  return `AGGREGATERESULT#CLIENT#${clientName}`;
};
