import { AppointmentEntity } from "../../domain/entities/AppointmentEntity";
import { IAppointmentRepository } from "../../domain/repositories/AppointmentRepository";

export class GetAppointmentsByInsuredIdUseCase {
  constructor(private readonly repo: IAppointmentRepository) {}

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
   * Ejecuta el caso de uso para obtener citas por ID de asegurado.
   * @param insuredId ID del asegurado
   * @returns Lista de citas médicas
   */
  async execute(insuredId: string): Promise<AppointmentEntity[]> {
    this.validateInsuredId(insuredId);
    return await this.repo.getByInsuredId(insuredId);
  }
}