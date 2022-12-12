import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import {
  AggregateResult,
  IAssessmentGroup,
} from "../../../entities/AggregateResult";
import { IResult } from "../../../entities/Result";
import { AggregateResultRepository } from "../../../repository/aggregateResult";
import { DriverRepository } from "../../../repository/driver";
import { ResultRepository } from "../../../repository/result";
import { apiResponse } from "../../../utils";

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const body: IResult = event.body && JSON.parse(event.body);
  console.log("BODY", event.body);
  if (!body?.clientName) {
    return apiResponse(400, "Please provide the client name");
  }
  if (!body?.driverCnic) {
    return apiResponse(400, "Please provide the driver's CNIC number");
  }
  if (!body?.assessmentName) {
    return apiResponse(400, "Please provide the assessment name");
  }
  if (!body?.assessmentCorrectAnswers && body?.assessmentCorrectAnswers !== 0) {
    return apiResponse(400, "Please provide the number of correct answers");
  }
  if (!body?.assessmentTotalAnswers && body?.assessmentTotalAnswers !== 0) {
    return apiResponse(400, "Please provide the total number of answers");
  }
  if (body.assessmentCorrectAnswers > body.assessmentCorrectAnswers) {
    return apiResponse(
      400,
      "Number of correct answers cannot be greater that the total number of answers in the assessment"
    );
  }
  try {
    const driver = await DriverRepository.getDriver(
      body.clientName,
      body.driverCnic
    );
    if (!driver) {
      return apiResponse(404, "Driver not found");
    }

    const drivers = await DriverRepository.getAllDrivers(body.clientName);
    if (!drivers) {
      return apiResponse(
        400,
        `Cannot find any driver related to ${body.clientName}`
      );
    }

    const previousResult = await ResultRepository.getDriverResult(
      body.clientName,
      body.driverCnic,
      body.assessmentName
    );

    console.log("previous result: ", previousResult);
    const isPassed = body.assessmentCorrectAnswers >= getPassingScore(body)

    const result: IResult = { ...body, driverName: driver.driverName, isPassed };

    await ResultRepository.saveResult(result);

    let { data: aggregatedResult } =
      await AggregateResultRepository.getAggregateResult(body.clientName);

    if (!aggregatedResult) {
      aggregatedResult = {
        assessments: {},
        clientName: body.clientName,
        drivers: drivers.data.length,
      };
    }

    if (!aggregatedResult.assessments) {
      aggregatedResult.assessments = {};
    }

    if (!aggregatedResult.assessments[result.assessmentName]) {
      aggregatedResult.assessments[result.assessmentName] =
        {} as IAssessmentGroup;
      aggregatedResult.assessments[result.assessmentName].passAttempts = 0;
      aggregatedResult.assessments[result.assessmentName].totalAttempts = 0;
    }

    if (!previousResult) {
      aggregatedResult.assessments[result.assessmentName].totalAttempts += 1;
    }


    console.log(`aggregated result: ${JSON.stringify(aggregatedResult.assessments[result.assessmentName])}`)

    if (isPassed) {
      console.log(`Passed!!!`)
      if (
        !previousResult ||
        (previousResult.assessmentCorrectAnswers as Number) <
          getPassingScore(previousResult)
      ) {
        console.log('Previously failed');
        aggregatedResult.assessments[result.assessmentName].passAttempts += 1;
      }
    } else if (
      previousResult &&
      (previousResult.assessmentCorrectAnswers as Number) >=
        getPassingScore(previousResult)
    ) {
      console.log('Previously passed');
      aggregatedResult.assessments[result.assessmentName].passAttempts -= 1;
    }

    console.log(`new aggregated result: ${JSON.stringify(aggregatedResult.assessments[result.assessmentName])}`)
    await AggregateResultRepository.saveAggregateResult(aggregatedResult);

    return apiResponse(200, "Assessment submitted successfully");
  } catch (error) {
    console.log(error);
    return apiResponse(400, (error as Error).message);
  }
};

const getPassingScore = (result: IResult): number =>
  result.passingScore ||
  (result.assessmentTotalAnswers || 0) *
    Number(process.env.DEFAULT_PASSING_PERCENTAGE);
