import { CreateAppointmentUseCase } from "../../../src/appointment/application/useCases/CreateAppointmentUseCase";
import { SNSPublisher } from "../../../src/common/SNSPublisher";
import { IAppointmentRepository } from "../../../src/appointment/domain/repositories/AppointmentRepository";
import { CreateAppointmentDTO } from "../../../src/appointment/application/dtos/CreateAppointmentDto";

jest.mock("ulid", () => ({ ulid: () => "TEST_ULID" }));

describe("CreateAppointmentUseCase", () => {
  let repo: jest.Mocked<IAppointmentRepository>;
  let snsPublisher: jest.Mocked<SNSPublisher>;
  let useCase: CreateAppointmentUseCase;

  const validInput: CreateAppointmentDTO = {
    insuredId: "12345",
    countryISO: "PE",
    schedule: {
      scheduleId: 111,
      centerId: "C001",
      specialtyId: "S001",
      medicId: "M001",
      date: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1h futuro
    },
  };

  beforeEach(() => {
    repo = { save: jest.fn().mockResolvedValue(undefined) } as any;
    snsPublisher = { publishAppointment: jest.fn().mockResolvedValue(undefined) } as any;
    useCase = new CreateAppointmentUseCase(repo, snsPublisher);
  });

  it("crea una cita y retorna el appointmentId", async () => {
    const id = await useCase.execute(validInput);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(snsPublisher.publishAppointment).toHaveBeenCalledTimes(1);
    expect(id).toBe("TEST_ULID");
    // Verifica argumentos recibidos por el repo
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({
      insuredId: validInput.insuredId,
      doctorId: validInput.schedule.medicId,
      state: "pending",
    }));
  });

  it("lanza error si insuredId tiene formato incorrecto", async () => {
    await expect(
      useCase.execute({ ...validInput, insuredId: "12A45" })
    ).rejects.toThrow("Formato de código de asegurado inválido");
  });

  it("lanza error si falta info en schedule", async () => {
    const badSchedule = { ...validInput.schedule, medicId: undefined as any };
    await expect(
      useCase.execute({ ...validInput, schedule: badSchedule })
    ).rejects.toThrow("La información de la cita es incompleta");
  });

  it("lanza error si la fecha es inválida o pasada", async () => {
    await expect(
      useCase.execute({ ...validInput, schedule: { ...validInput.schedule, date: "notadate" } })
    ).rejects.toThrow("Fecha de cita inválida");

    await expect(
      useCase.execute({ ...validInput, schedule: { ...validInput.schedule, date: new Date(Date.now() - 10000).toISOString() } })
    ).rejects.toThrow("Fecha de cita inválida");
  });

  it("lanza error si el countryISO no está permitido", async () => {
    await expect(
      useCase.execute({ ...validInput, countryISO: "BR" })
    ).rejects.toThrow("Código de país incorrecto");
  });

  it("lanza error genérico si falla el repo o publisher", async () => {
    repo.save.mockRejectedValue(new Error("DB Error"));
    await expect(
      useCase.execute(validInput)
    ).rejects.toThrow("Error al crear la cita, contacte al administrador");
  });
});
