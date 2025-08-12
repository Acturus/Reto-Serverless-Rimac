import { AppointmentEntity } from "../../domain/entities/AppointmentEntity";
import { IAppointmentRepository } from "../../domain/repositories/AppointmentRepository";

export class StoreAppointmentUseCase {

    constructor(private readonly repo: IAppointmentRepository) {}
    async execute(appointment: AppointmentEntity): Promise<void> {
        await this.repo.save(appointment);
    }
}
