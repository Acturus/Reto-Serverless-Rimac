import { SNSPublisher } from "../../src/common/SNSPublisher";

// --- Mock AWS SDK SNS ---
let lastPublishCommandInput: any = undefined;
const sendMock = jest.fn();

jest.mock("@aws-sdk/client-sns", () => ({
  SNSClient: jest.fn().mockImplementation(() => ({
    send: sendMock,
  })),
  PublishCommand: function(input: any) {
    lastPublishCommandInput = input;
    return { __type: "PublishCommand", input };
  }
}));

describe("SNSPublisher", () => {
  const topicArn = "arn:aws:sns:us-east-1:123456789012:TestTopic";
  let publisher: SNSPublisher;

  beforeEach(() => {
    sendMock.mockReset();
    lastPublishCommandInput = undefined;
    publisher = new SNSPublisher(topicArn);
  });

  it("publica una cita correctamente en SNS", async () => {
    sendMock.mockResolvedValue({});
    const appointment = {
      appointmentId: "A1",
      insuredId: "12345",
      doctorId: "M001",
      medicalCenterId: "C001",
      specialtyId: "S001",
      countryISO: "PE",
      date: "2024-09-10T12:00:00Z"
    };
    await publisher.publishAppointment(appointment);

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(lastPublishCommandInput.TopicArn).toBe(topicArn);
    expect(lastPublishCommandInput.Message).toBe(JSON.stringify(appointment));
    expect(lastPublishCommandInput.MessageAttributes).toEqual({
      countryISO: {
        DataType: "String",
        StringValue: "PE"
      }
    });
  });

  it("propaga error si SNS falla", async () => {
    sendMock.mockRejectedValueOnce(new Error("SNS Error"));
    await expect(
      publisher.publishAppointment({
        appointmentId: "A1",
        insuredId: "12345",
        doctorId: "M001",
        medicalCenterId: "C001",
        specialtyId: "S001",
        countryISO: "PE",
        date: "2024-09-10T12:00:00Z"
      })
    ).rejects.toThrow("SNS Error");
  });
});
