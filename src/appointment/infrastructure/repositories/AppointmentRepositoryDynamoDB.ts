import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AppointmentEntity } from "../../domain/entities/AppointmentEntity";
import {IAppointmentRepository} from "../../domain/repositories/AppointmentRepository";
import { UpdateAppointmentDTO } from "../../application/dtos/UpdateAppointmentDto";

export class AppointmentRepositoryDynamoDB implements IAppointmentRepository{
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
  async get(id: string): Promise<AppointmentEntity[]> {
    const params = {
      TableName: this.table,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": `INSURED#${id}`,
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

  /*
   * Actualiza la cita de un asegurado
   */
  async update(data: UpdateAppointmentDTO): Promise<void> {

    const params = {
      TableName: this.table,
      Key: { PK: { S: `INSURED#${data.insuredId}` }, SK: { S: `APPOINTMENT#${data.appointmentId}` } },
      UpdateExpression: "SET #state = :newState",
      ExpressionAttributeNames: { "#state": "state" },
      ExpressionAttributeValues: { ":newState": { S: "completed" } }
    };
    
    await this.client.send(new UpdateCommand(params));
  }
}
