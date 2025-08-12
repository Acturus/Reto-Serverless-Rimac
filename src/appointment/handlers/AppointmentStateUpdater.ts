import { SQSHandler } from "aws-lambda";
import { UpdateAppointmentUseCase } from "../application/useCases/UpdateAppointmentUseCase";
import { AppointmentRepositoryDynamoDB } from "../infrastructure/repositories/AppointmentRepositoryDynamoDB";

export const handler: SQSHandler = async (event) => {

  if (!process.env.APPOINTMENTS_TABLE) {
    throw new Error("APPOINTMENTS_TABLE environment variable is not set");
  }

  const repo = new AppointmentRepositoryDynamoDB();
  const delay = Number(process.env.STATE_UPDATE_DELAY_SECONDS) || 0;
  const lambda_timeout = Number(process.env.STATE_UPDATE_LAMBDA_TIMEOUT) || 0;

  const updateUseCase = new UpdateAppointmentUseCase(repo);

  for (const record of event.Records) {

    try{
      const { detail } = JSON.parse(record.body);

      if (delay > 0 && lambda_timeout - delay >= 2) {
        console.log(`Waiting ${delay} seconds before update state...`);
        await new Promise(res => setTimeout(res, delay*1000));
      }

      await updateUseCase.execute(detail);
      
    } catch (err) {
      console.error("Error processing record:", err);
    }
  }
};
