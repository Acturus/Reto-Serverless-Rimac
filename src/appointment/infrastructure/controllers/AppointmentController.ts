import { AppointmentRepositoryDynamoDB } from "../repositories/AppointmentRepositoryDynamoDB";
import { CreateAppointmentUseCase } from "../../application/useCases/CreateAppointmentUseCase";
import { GetAppointmentsByInsuredIdUseCase } from "../../application/useCases/GetAppointmentsByInsuredIdUseCase";
import { APIGatewayProxyHandler } from "aws-lambda";
import { IAppointmentRepository } from "../../domain/repositories/AppointmentRepository";
import { SNSPublisher } from "../../../common/SNSPublisher";

export class AppointmentController {
  private createAppointment: CreateAppointmentUseCase;
  private getAppointmentsByInsuredId: GetAppointmentsByInsuredIdUseCase;

  constructor(
      private appointmentRepository: IAppointmentRepository = new AppointmentRepositoryDynamoDB()
  ) {
    const snsTopicArn = process.env.SNS_TOPIC_ARN!;
    const snsPublisher = new SNSPublisher(snsTopicArn);
    this.createAppointment = new CreateAppointmentUseCase(this.appointmentRepository, snsPublisher);
    this.getAppointmentsByInsuredId = new GetAppointmentsByInsuredIdUseCase(this.appointmentRepository);
  }

  public createAppointmentHandler: APIGatewayProxyHandler = async (event) => {
    try {
      const body = JSON.parse(event.body || '{}');
      const id = await this.createAppointment.execute(body);
      return {
        statusCode: 201,
        body: JSON.stringify({ message: "Su cita registró con éxito con el código: " + id }),
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: true,
          message: error.message
        }),
      };
    }
  }

  public getAppointmentsByInsuredIdHandler: APIGatewayProxyHandler = async (event) => {

    const insuredId = event.pathParameters?.insuredId;
    if (!insuredId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: true,
          message: "No se envió el código de asegurado"
        }),
      };
    }

    try {
      const result = await this.getAppointmentsByInsuredId.execute(insuredId);
      if (result.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: true,
            message: "No se encontraron citas"
          }),
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: true,
          message: error.message
        }),
      };
    }
  }
}
