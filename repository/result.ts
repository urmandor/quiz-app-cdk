import {
  IResult,
  Result,
  generateResultPK,
  generateResultSK,
  generateResultGSI1PK,
} from "../entities/Result";

export class ResultRepository {
  static async getDriverResults(
    clientName: string,
    driverCnic: string,
    limit?: number,
    offset?: { [x: string]: any }
  ): Promise<{
    data: IResult[];
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
    let results: any;
    try {
      results = await Result.query(generateResultPK(clientName, driverCnic), {
        ...options,
      });
    } catch (error) {
      console.log("Error", error);
    }

    return {
      data: results.Items || [],
      offset: results.LastEvaluatedKey,
      count: results.Count,
    };
  }

  // static async getDriverResult(
  //   clientName: string,
  //   driverCnic: string,
  //   assessmentName: string
  // ): Promise<IResult | null> {
  //   const result = await Result.query(
  //     generateResultGSI1PK(clientName, driverCnic, assessmentName),
  //     { index: "GSI1" }
  //   );
  //   if (!result.Items || !result.Items[0]) {
  //     return null;
  //   }
  //   return <IResult>result.Items[0];
  // }

  static async getDriverResult2(
    clientName: string,
    driverCnic: string,
    assessmentName: string
  ): Promise<IResult | null> {
    const result = await Result.query(generateResultPK(clientName, driverCnic), {
      
    });
    if (!result.Items || !result.Items[0]) {
      return null;
    }
    return <IResult>result.Items[0];
  }

  static async getDriverResult3(
    clientName: string,
    driverCnic: string,
    assessmentName: string
  ): Promise<IResult | null> {
    const result = await Result.query(generateResultPK(clientName, driverCnic), {
      filters: [{ attr: "assessmentName", eq: assessmentName }],
    });
    if (!result.Items || !result.Items[0]) {
      return null;
    }
    return <IResult>result.Items[0];
  }

  static async getDriverResult(
    clientName: string,
    driverCnic: string,
    assessmentName: string
  ): Promise<IResult | null> {
    const result = await Result.query(generateResultPK(clientName, driverCnic), {
      filters: [
        { attr: "assessmentName", eq: assessmentName },
      ],
    });
    if (!result.Items || !result.Items[0]) {
      return null;
    }
    return <IResult>result.Items[0];
  }

  static async saveResult(result: IResult): Promise<void> {
    console.log("saving result", result);
    await Result.put(result);
  }
}
