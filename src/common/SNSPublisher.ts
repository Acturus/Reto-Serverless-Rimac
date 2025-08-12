import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { PublisherInterface } from "./interfaces/PublisherInterface";
import { AppointmentEntity } from "../appointment/domain/entities/AppointmentEntity";

export class SNSPublisher implements PublisherInterface {
  private snsClient: SNSClient;
  private topicArn: string;

  constructor(topicArn: string) {
    this.snsClient = new SNSClient({});
    this.topicArn = topicArn;
  }

  async publishAppointment(appointment: AppointmentEntity) {

    const { countryISO } = appointment;

    await this.snsClient.send(new PublishCommand({
      TopicArn: this.topicArn,
      Message: JSON.stringify(appointment),
      MessageAttributes: {
        countryISO: {
          DataType: "String",
          StringValue: countryISO
        }
      }
    }));
    
  }
}
