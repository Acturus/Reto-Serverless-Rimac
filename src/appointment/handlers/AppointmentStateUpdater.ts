import { SQSHandler } from "aws-lambda";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

export const handler: SQSHandler = async (event) => {

  if (!process.env.APPOINTMENTS_TABLE) {
    throw new Error("APPOINTMENTS_TABLE environment variable is not set");
  }

  const ddb = new DynamoDBClient({});

  const delay = Number(process.env.STATE_UPDATE_DELAY_SECONDS) || 0;
  const lambda_timeout = Number(process.env.STATE_UPDATE_LAMBDA_TIMEOUT) || 0;

  const APPOINTMENTS_TABLE = process.env.APPOINTMENTS_TABLE;

  for (const record of event.Records) {

    try{
      const { detail } = JSON.parse(record.body);

      if (delay > 0 && lambda_timeout - delay >= 2) {
        console.log(`Waiting ${delay} seconds before update state...`);
        await new Promise(res => setTimeout(res, delay*1000));
      }

      await ddb.send(new UpdateItemCommand({
        TableName: APPOINTMENTS_TABLE,
        Key: { PK: { S: `INSURED#${detail.insuredId}` }, SK: { S: `APPOINTMENT#${detail.appointmentId}` } },
        UpdateExpression: "SET #state = :newState",
        ExpressionAttributeNames: { "#state": "state" },
        ExpressionAttributeValues: { ":newState": { S: "completed" } }
      }));
    } catch (err) {
      console.error("Error processing record:", err);
    }
  }
};
