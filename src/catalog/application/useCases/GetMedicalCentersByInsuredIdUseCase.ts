import { MedicalCenterEntity } from "../../domain/entities/MedicalCenterEntity";
import { ICatalogRepository } from "../../domain/repositories/CatalogRepository";


export class GetMedicalCentersByInsuredIdUseCase {
  constructor(private readonly repo: ICatalogRepository) {}

  /**
   * Valida que el ID del asegurado sea un string de 5 dígitos.
   * @param insuredId ID del asegurado
   */
  private validateInsuredId(insuredId: string): void {
    if (!/^\d{5}$/.test(insuredId)) {
      throw new Error("Código de asegurado inválido");
    }
  }

  /**
   * Ejecuta el caso de uso para obtener centros médicos por ID de asegurado.
   * @param insuredId ID del asegurado
   * @returns Lista de centros médicos
   */
  async execute(insuredId: string): Promise<MedicalCenterEntity[]> {
    let centers: MedicalCenterEntity[] = [];
    // Validar el ID del asegurado
    this.validateInsuredId(insuredId);
    // Buscar paciente
    const patient = await this.repo.getPatientById(insuredId);
    // Si hay un paciente, buscar centros médicos por país
    if(patient)
      centers = await this.repo.getMedicalCentersByCountry(patient.countryISO);    
    // Retornar los centros médicos encontrados
    return centers;
  }
}