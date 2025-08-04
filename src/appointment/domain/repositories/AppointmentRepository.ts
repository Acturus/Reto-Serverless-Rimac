import { AppointmentEntity } from "../entities/AppointmentEntity";

export interface IAppointmentRepository {
    save(appointment: AppointmentEntity): Promise<void>;
    getByInsuredId(insuredId: string): Promise<AppointmentEntity[]>;
}