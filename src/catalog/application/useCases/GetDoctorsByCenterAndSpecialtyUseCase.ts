import { DoctorEntity } from "../../domain/entities/DoctorEntity";
import { ICatalogRepository } from "../../domain/repositories/CatalogRepository";


export class GetDoctorsByCenterAndSpecialtyUseCase {
  constructor(private repo: ICatalogRepository) {}

  async execute(centerId: string, specialtyId: string) : Promise<DoctorEntity[]> {
    return this.repo.getDoctorsByCenterAndSpecialty(centerId, specialtyId);
  }
}