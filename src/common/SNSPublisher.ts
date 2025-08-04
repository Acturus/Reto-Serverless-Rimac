import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export class SNSPublisher {
  private snsClient: SNSClient;
  private topicArn: string;

  constructor(topicArn: string) {
    this.snsClient = new SNSClient({});
    this.topicArn = topicArn;
  }

  async publishAppointment(appointment: any) {
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