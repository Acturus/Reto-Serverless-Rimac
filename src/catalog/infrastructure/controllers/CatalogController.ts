import { APIGatewayProxyHandler } from "aws-lambda";
import { GetMedicalCentersByInsuredIdUseCase } from "../../application/useCases/GetMedicalCentersByInsuredIdUseCase";
import { GetDoctorsByCenterAndSpecialtyUseCase } from "../../application/useCases/GetDoctorsByCenterAndSpecialtyUseCase";
import { ICatalogRepository } from "../../domain/repositories/CatalogRepository";
import { CatalogRepository } from "../repositories/CatalogRepositoryImpl";

export class CatalogController {
  private getCentersUseCase: GetMedicalCentersByInsuredIdUseCase;
  private getDoctorsUseCase: GetDoctorsByCenterAndSpecialtyUseCase;

  constructor(
    private catalogRepository: ICatalogRepository = new CatalogRepository()
  ) {
    this.getCentersUseCase = new GetMedicalCentersByInsuredIdUseCase(this.catalogRepository);
    this.getDoctorsUseCase = new GetDoctorsByCenterAndSpecialtyUseCase(this.catalogRepository);
  }

  public getCentersByInsuredIdHandler: APIGatewayProxyHandler = async (event) => {
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
      const result = await this.getCentersUseCase.execute(insuredId);
      if (result.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: true,
            message: "No se encontraron centros médicos disponibles para el asegurado"
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
  };

  public getDoctorsByCenterAndSpecialtyHandler: APIGatewayProxyHandler = async (event) => {
    const { centerId, specialtyId } = event.queryStringParameters || {};

    if (!centerId || !specialtyId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: true,
          message: "Información de búsqueda incompleta"
        }),
      };
    }

    try {
      const result = await this.getDoctorsUseCase.execute(centerId, specialtyId);
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: true, message: "Error desconocido" }),
      };
    }
  };
}
