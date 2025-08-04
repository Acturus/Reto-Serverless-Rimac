import { GetAppointmentsByInsuredIdUseCase } from "../../../src/appointment/application/useCases/GetAppointmentsByInsuredIdUseCase";
import { IAppointmentRepository } from "../../../src/appointment/domain/repositories/AppointmentRepository";
import { AppointmentEntity } from "../../../src/appointment/domain/entities/AppointmentEntity";

describe("GetAppointmentsByInsuredIdUseCase", () => {
  let repo: jest.Mocked<IAppointmentRepository>;
  let useCase: GetAppointmentsByInsuredIdUseCase;

  const insuredId = "12345";

  const appointments: AppointmentEntity[] = [
    {
      appointmentId: "A1",
      insuredId: "12345",
      doctorId: "M001",
      medicalCenterId: "C001",
      specialtyId: "S001",
      date: "2024-09-10T12:00:00Z",
      countryISO: "PE",
      state: "pending"
    },
    {
      appointmentId: "A2",
      insuredId: "12345",
      doctorId: "M002",
      medicalCenterId: "C002",
      specialtyId: "S002",
      date: "2024-09-11T10:00:00Z",
      countryISO: "PE",
      state: "completed"
    },
  ];

  beforeEach(() => {
    repo = {
      getByInsuredId: jest.fn().mockResolvedValue(appointments),
    } as any;
    useCase = new GetAppointmentsByInsuredIdUseCase(repo);
  });

  it("retorna las citas para un insuredId válido", async () => {
    const result = await useCase.execute(insuredId);
    expect(repo.getByInsuredId).toHaveBeenCalledWith(insuredId);
    expect(result).toEqual(appointments);
  });

  it("lanza error si el insuredId tiene formato inválido", async () => {
    await expect(useCase.execute("12A45")).rejects.toThrow("Código de asegurado inválido");
    await expect(useCase.execute("1234")).rejects.toThrow("Código de asegurado inválido");
    await expect(useCase.execute("")).rejects.toThrow("Código de asegurado inválido");
  });

  it("retorna un array vacío si el insuredId no tiene citas", async () => {
    repo.getByInsuredId.mockResolvedValueOnce([]);
    const result = await useCase.execute(insuredId);
    expect(result).toEqual([]);
  });
});
