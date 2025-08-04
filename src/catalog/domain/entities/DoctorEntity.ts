export interface DoctorEntity {
  id: string;
  name: string;
  surname: string;
  gender: 'M' | 'F';
  specialty: string;
  specialtyId: string;
  centerId: string;
  countryISO: string;
}