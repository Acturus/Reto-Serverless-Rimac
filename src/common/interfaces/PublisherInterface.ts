import { AppointmentEntity } from "../../appointment/domain/entities/AppointmentEntity";

export interface PublisherInterface {
    publishAppointment(appointment: AppointmentEntity): Promise<void>;
}
