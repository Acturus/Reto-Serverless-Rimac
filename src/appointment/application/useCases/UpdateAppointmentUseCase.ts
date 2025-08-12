import { IAppointmentRepository } from "../../domain/repositories/AppointmentRepository";
import { UpdateAppointmentDTO } from "../dtos/UpdateAppointmentDto";

export class UpdateAppointmentUseCase {

    constructor(private readonly repo: IAppointmentRepository) {}

    execute(data: UpdateAppointmentDTO ): Promise<void> {
        return this.repo.update(data);
    }
    
}
