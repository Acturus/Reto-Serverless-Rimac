import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { PatientEntity } from "../../domain/entities/PatientEntity";
import { MedicalCenterEntity } from "../../domain/entities/MedicalCenterEntity";
import { DoctorEntity } from "../../domain/entities/DoctorEntity";
import { ICatalogRepository } from "../../domain/repositories/CatalogRepository";

export class CatalogRepository implements ICatalogRepository {
  constructor() {
    if (!process.env.CATALOGS_TABLE) {
      throw new Error("CATALOGS_TABLE environment variable is not set");
    }
  }
  
  private client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  private table = process.env.CATALOGS_TABLE;

  /**
   * Verifica si un elemento existe en la tabla.
   * @param pk Clave primaria del elemento
   * @param sk Clave secundaria del elemento
   * @returns true si el elemento existe, false en caso contrario
   */
  async exists(pk: string, sk: string): Promise<boolean> {
    const params = {
      TableName: this.table,
      Key: { PK: pk, SK: sk }
    };
    const result = await this.client.send(new GetCommand(params));
    return !!result.Item;
  }

  /**
   * Guarda un nuevo elemento en la tabla.
   * @param item Objeto a guardar
   */
  async save(item: any) {
    await this.client.send(new PutCommand({
      TableName: this.table,
      Item: item,
    }));
  }

  /**
   * Obtiene un paciente por su ID.
   * @param insuredId ID del paciente
   * @returns Objeto PatientEntity o null si no existe
   */
  async getPatientById(insuredId: string): Promise<PatientEntity | null> {
    const params = {
      TableName: this.table,
      Key: {
        PK: `PATIENT#${insuredId}`,
        SK: "METADATA#",
      }
    };
    const result = await this.client.send(new GetCommand(params));
    return result.Item ? (result.Item as PatientEntity) : null;
  }

  /**
   * Obtiene todos los centros médicos de un país.
   * @param countryISO Código ISO del país
   * @returns Array de MedicalCenterEntity
   */
  async getMedicalCentersByCountry(countryISO: string): Promise<MedicalCenterEntity[]> {
    const params = {
      TableName: this.table,
      FilterExpression: "begins_with(PK, :pk) AND countryISO = :country",
      ExpressionAttributeValues: {
        ":pk": "CENTER#",
        ":country": countryISO,
      }
    };
    const result = await this.client.send(new ScanCommand(params));
    return result.Items as MedicalCenterEntity[] || [];
  }

  /**
   * Obtiene todos los doctores de un centro médico y especialidad.
   * @param centerId ID del centro médico
   * @param specialtyId ID de la especialidad
   * @returns Array de DoctorEntity
   */
  async getDoctorsByCenterAndSpecialty(centerId: string, specialtyId: string): Promise<DoctorEntity[]> {
    const params = {
      TableName: this.table,
      FilterExpression: "begins_with(PK, :pk) AND centerId = :centerId AND specialtyId = :specialtyId",
      ExpressionAttributeValues: {
        ":pk": "DOCTOR#",
        ":centerId": centerId,
        ":specialtyId": specialtyId
      }
    };
    const result = await this.client.send(new ScanCommand(params));
    return result.Items as DoctorEntity[] || [];
  }
}
