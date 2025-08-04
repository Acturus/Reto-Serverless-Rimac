export interface AppointmentEntity {
  appointmentId: string;
  insuredId: string;
  doctorId: string;
  medicalCenterId: string;
  specialtyId: string;
  countryISO: string;
  date: string;
  state?: string;
}
