import { Table } from "dynamodb-toolbox";
import { Entity } from "dynamodb-toolbox";
import { IBaseEntity, QAPPTable } from "./BaseEntity";

export interface IClient extends IBaseEntity {
  clientName: string;
  imageUrl?: string;
}

export const Client = new Entity<IClient, undefined, Table<string, "PK", "SK">>(
  {
    name: "Client",
    table: QAPPTable,
    attributes: {
      PK: {
        partitionKey: true,
        default: (data: IClient) => generateClientPK(),
      },
      SK: {
        sortKey: true,
        default: (data: IClient) => generateClientSK(data.clientName),
      },
      clientName: { type: "string", required: true },
      imageUrl: { type: "string", required: false },
    },
  }
);

export const generateClientPK = () => {
  return `CLIENT`;
};

export const generateClientSK = (clientName: string) => {
  return `CLIENT#${clientName}`;
};
