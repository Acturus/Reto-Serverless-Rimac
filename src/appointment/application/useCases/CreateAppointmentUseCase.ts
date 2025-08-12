import { ulid } from "ulid";
import { AppointmentEntity } from "../../domain/entities/AppointmentEntity";
import { CreateAppointmentDTO } from "../dtos/CreateAppointmentDto";
import { IAppointmentRepository } from "../../domain/repositories/AppointmentRepository";
import { PublisherInterface } from "../../../common/interfaces/PublisherInterface";

export class CreateAppointmentUseCase {
  constructor(
    private readonly repo: IAppointmentRepository,
    private readonly publisher: PublisherInterface
  ) {}

  private allowedCountries = ["PE", "CL"];

  private validDate(fechaStr: unknown): boolean {
    if (typeof fechaStr !== "string") return false;
    const timestamp = Date.parse(fechaStr);
    return !isNaN(timestamp) && timestamp > Date.now();
  }

  private validateInput(input: CreateAppointmentDTO): void {
    if (!input.insuredId || !/^\d{5}$/.test(input.insuredId)) {
      throw new Error("Formato de código de asegurado inválido");
    }
    if (!input.schedule || !input.schedule.medicId || !input.schedule.centerId || !input.schedule.specialtyId) {
      throw new Error("La información de la cita es incompleta");
    }
    if (!this.validDate(input.schedule.date)) {
      throw new Error("Fecha de cita inválida");
    }
    if (!input.countryISO || !this.allowedCountries.includes(input.countryISO)) {
      throw new Error("Código de país incorrecto");
    }
  }

  async execute(input: CreateAppointmentDTO): Promise<string> {
    // Validar la entrada
    this.validateInput(input);
    // Se crea el objeto AppointmentEntity a partir del DTO
    try {
      const appointment: AppointmentEntity = {
        appointmentId: ulid(),
        insuredId: input.insuredId,
        doctorId: input.schedule.medicId,
        medicalCenterId: input.schedule.centerId,
        specialtyId: input.schedule.specialtyId,
        date: input.schedule.date,
        countryISO: input.countryISO,
        state: "pending"
      };
      // Se guarda la cita en el repositorio
      await this.repo.save(appointment);
      // Se publica la cita
      await this.publisher.publishAppointment(appointment);
      return appointment.appointmentId;
    }
    catch (error: any) {
      throw new Error(`Error al crear la cita, contacte al administrador`);
    }
  }
}
