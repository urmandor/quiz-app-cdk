import { Table } from "dynamodb-toolbox";
import { Entity } from "dynamodb-toolbox";
import { IBaseEntity, QAPPTable } from "./BaseEntity";

export interface IDriver extends IBaseEntity {
  clientName: string;
  cnic: string;
  driverName: string;
}

export const Driver = new Entity<IDriver, undefined, Table<string, "PK", "SK">>(
  {
    name: "Driver",
    table: QAPPTable,
    attributes: {
      PK: {
        partitionKey: true,
        default: (data: IDriver) => generateDriverPK(data.clientName),
      },
      SK: {
        sortKey: true,
        default: (data: IDriver) => generateDriverSK(data.cnic),
      },
      clientName: { type: "string", required: true },
      cnic: { type: "string", required: true },
      driverName: { type: "string", required: true },
    },
  }
);

export const generateDriverPK = (clientName: string) => {
  return `DRIVER#CLIENT#${clientName}`;
};

export const generateDriverSK = (cnic: string) => {
  return `DRIVER#${cnic}`;
};
