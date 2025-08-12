import { UpdateAppointmentDTO } from "../../application/dtos/UpdateAppointmentDto";
import { AppointmentEntity } from "../entities/AppointmentEntity";

export interface IAppointmentRepository {
    save(appointment: AppointmentEntity): Promise<void>;
    get(id: string): Promise<AppointmentEntity[]>;
    update(data: UpdateAppointmentDTO): Promise<void>;
}
