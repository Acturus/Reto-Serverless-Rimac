import { DoctorEntity } from "../entities/DoctorEntity";
import { MedicalCenterEntity } from "../entities/MedicalCenterEntity";
import { PatientEntity } from "../entities/PatientEntity";

export interface ICatalogRepository {
    exists(pk: string, sk: string): Promise<boolean>;
    save(item: any): Promise<void>;
    getPatientById(insuredId: string): Promise<PatientEntity | null>;
    getMedicalCentersByCountry(countryISO: string): Promise<MedicalCenterEntity[]>;
    getDoctorsByCenterAndSpecialty(medicalCenterId: string, specialtyId: string): Promise<DoctorEntity[]>;
}