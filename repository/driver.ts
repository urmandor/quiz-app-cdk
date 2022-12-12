import { Driver, generateDriverPK, IDriver } from "../entities/Driver";

type PK = { clientName: string; cnic: string };
export type DeleteDriver = Partial<IDriver> & Required<PK>;
export type UpdateDriver = DeleteDriver & {
  newDriverName: string;
  newClientName?: string;
};

export class DriverRepository {
  static async getAllDrivers(
    clientName: string,
    limit?: number,
    offset?: { [x: string]: any }
  ): Promise<{
    data: IDriver[];
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
    const results = await Driver.query(generateDriverPK(clientName), options);
    console.log("All Drivers", results.Items);

    return {
      data: results.Items || [],
      offset: results.LastEvaluatedKey,
      count: results.Count,
    };
  }

  static async getDriver(
    clientName: string,
    cnic: string
  ): Promise<IDriver | null> {
    const result = await Driver.get({ cnic, clientName });
    if (!result.Item) {
      return null;
    }
    return <IDriver>result.Item;
  }

  static async saveDriver(driver: IDriver): Promise<void> {
    await Driver.put(driver);
  }

  static async updateDriver(driver: UpdateDriver): Promise<void> {
    if (driver.newClientName) {
      await Driver.delete({ clientName: driver.clientName, cnic: driver.cnic });
      await Driver.put({
        clientName: driver.newClientName,
        cnic: driver.cnic,
        driverName: driver.newDriverName,
      });
    } else {
      await Driver.update({
        clientName: driver.clientName,
        cnic: driver.cnic,
        driverName: driver.newDriverName,
      });
    }
  }

  static async deleteDriver(clientName: string, cnic: string): Promise<void> {
    await Driver.delete({ clientName, cnic });
  }

  static async deleteAllDrivers(clientName: string): Promise<void> {
    const { data: drivers } = await DriverRepository.getAllDrivers(clientName);
    await Promise.all(
      drivers.map((driver) =>
        DriverRepository.deleteDriver(driver.clientName, driver.cnic)
      )
    );
    return;
  }
}
