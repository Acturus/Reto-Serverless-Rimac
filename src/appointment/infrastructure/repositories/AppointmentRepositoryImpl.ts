import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AppointmentEntity } from "../../domain/entities/AppointmentEntity";
import {IAppointmentRepository} from "../../domain/repositories/AppointmentRepository";

export class AppointmentRepository implements IAppointmentRepository{
  constructor() {
    if (!process.env.APPOINTMENTS_TABLE) {
      throw new Error("APPOINTMENTS_TABLE environment variable is not set");
    }
  }

  private client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  private table = process.env.APPOINTMENTS_TABLE;

  /**
   * Registra una nueva cita médica.
   * @param appointment Datos completos de la cita (AppointmentEntity)
   */
  async save(appointment: AppointmentEntity): Promise<void> {
    const item = {
      PK: `INSURED#${appointment.insuredId}`,
      SK: `APPOINTMENT#${appointment.appointmentId}`,
      ...appointment,
    };
    await this.client.send(new PutCommand({
      TableName: this.table,
      Item: item,
    }));
  }

  /**
   * Obtiene todas las citas de un asegurado por su código.
   * @param insuredId Código del asegurado
   * @returns Array de citas médicas
   */
  async getByInsuredId(insuredId: string): Promise<AppointmentEntity[]> {
    const params = {
      TableName: this.table,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": `INSURED#${insuredId}`,
        ":sk": "APPOINTMENT#"
      },
      ScanIndexForward: false
    };

    const result = await this.client.send(new QueryCommand(params));
    
    return (result.Items || []).map(item => ({
      appointmentId: item.appointmentId,
      insuredId: item.insuredId,
      doctorId: item.doctorId,
      medicalCenterId: item.medicalCenterId,
      specialtyId: item.specialtyId,
      date: item.date,
      state: item.state,
      countryISO: item.countryISO
    }));
  }
}
