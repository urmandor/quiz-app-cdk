import {
  AggregateResult,
  generateAggregateResultPK,
  IAggregateResult,
} from "../entities/AggregateResult";
import { IResult } from "../entities/Result";

export class AggregateResultRepository {
  static async getAggregateResult(clientName: string): Promise<{
    data: IAggregateResult;
  }> {
    const results = await AggregateResult.query(
      generateAggregateResultPK(clientName)
    );

    const response: { data: IAggregateResult } = {
      data: {} as IAggregateResult,
    };
    if (results.Items) {
      response.data = results.Items[0];
    }
    if (response.data?.clientName) {
      response.data.clientName = clientName;
    }

    console.log("Aggregate Result: ", response);
    return response;
  }

  static async saveAggregateResult(result: IAggregateResult): Promise<void> {
    console.log("saving aggregate result", result);
    await AggregateResult.put(result);
  }
}
