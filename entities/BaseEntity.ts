import { Table } from "dynamodb-toolbox";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TABLE_NAME } from "../cdk/dynamodb";

export const db = new DocumentClient();

export const QAPPTable = new Table({
  name: TABLE_NAME,
  partitionKey: "PK",
  sortKey: "SK",
  entityField: "ET",
  DocumentClient: db,
  // indexes: {
  //   GSI1: { partitionKey: 'GSI1PK', sortKey: 'GSI1SK' },
  // },
});

export interface IBaseEntity {
  created?: string;
  createdBy?: string;
  modified?: string;
  entity?: string;
}

export const BaseEntityObject = {
  timestamps: true,
  created: "CT",
  modified: "MD",
};

