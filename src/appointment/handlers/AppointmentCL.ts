import { SQSHandler } from "aws-lambda";
import { AppointmentRepositoryMySQL } from "../infrastructure/repositories/AppointmentRepositoryMySQL";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

export const handler: SQSHandler = async (event) => {

  if (!process.env.MYSQL_HOST ||
    !process.env.MYSQL_USER ||
    !process.env.MYSQL_PASS ||
    !process.env.MYSQL_DB ||
    !process.env.EVENT_BUS_NAME
  ) {
    throw new Error("Missing environment variables for MySQL_CL or EventBridge configuration.");
  }

  const repository = new AppointmentRepositoryMySQL({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
  });

  const eventBridge = new EventBridgeClient({});

  for (const record of event.Records) {
  
    const snsEvent = JSON.parse(record.body);
    const appointment = JSON.parse(snsEvent.Message);
  
    try {
      await repository.save(appointment);
    } catch (error) {
      console.error("Error saving appointment:", error);
      throw error;
    }

    try {
      await eventBridge.send(new PutEventsCommand({
        Entries: [{
          Source: "medical-appointment-cl",
          DetailType: "AppointmentCompleted",
          Detail: JSON.stringify({
            appointmentId: appointment.appointmentId,
            insuredId: appointment.insuredId,
            countryISO: appointment.countryISO,
            state: "completed"
          }),
          EventBusName: process.env.EVENT_BUS_NAME,
        }]
      }));
    } catch (error) {
      console.error("Error sending event to EventBridge:", error);
      throw error;
    }
  }
};
