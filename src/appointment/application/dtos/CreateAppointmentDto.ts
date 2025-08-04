export interface CreateAppointmentDTO {
  insuredId: string;
  countryISO: string;
  schedule: {
    scheduleId: number;  
    centerId: string;
    specialtyId: string;
    medicId: string;
    date: string;
  }
}
