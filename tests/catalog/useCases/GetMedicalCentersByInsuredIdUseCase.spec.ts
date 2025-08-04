import { GetMedicalCentersByInsuredIdUseCase } from "../../../src/catalog/application/useCases/GetMedicalCentersByInsuredIdUseCase";
import { ICatalogRepository } from "../../../src/catalog/domain/repositories/CatalogRepository";
import { MedicalCenterEntity } from "../../../src/catalog/domain/entities/MedicalCenterEntity";

describe("GetMedicalCentersByInsuredIdUseCase", () => {
  let repo: jest.Mocked<ICatalogRepository>;
  let useCase: GetMedicalCentersByInsuredIdUseCase;

  const insuredId = "12345";
  const patientMock = { countryISO: "PE" };
  const centersMock: MedicalCenterEntity[] = [
    {
      id: "C001",
      name: "Clínica Salud",
      countryISO: "PE",
      type: "privado",
      specialties: ["cardiología", "pediatría"]
    },
    {
      id: "C002",
      name: "Policlínico Sur",
      countryISO: "PE",
      type: "público",
      specialties: ["ginecología"]
    }
  ];

  beforeEach(() => {
    repo = {
      getPatientById: jest.fn().mockResolvedValue(patientMock),
      getMedicalCentersByCountry: jest.fn().mockResolvedValue(centersMock),
    } as any;
    useCase = new GetMedicalCentersByInsuredIdUseCase(repo);
  });

  it("devuelve los centros médicos si el ID del asegurado es válido y existe paciente", async () => {
    const result = await useCase.execute(insuredId);
    expect(repo.getPatientById).toHaveBeenCalledWith(insuredId);
    expect(repo.getMedicalCentersByCountry).toHaveBeenCalledWith(patientMock.countryISO);
    expect(result).toEqual(centersMock);
  });

  it("devuelve array vacío si el paciente no existe", async () => {
    repo.getPatientById.mockResolvedValueOnce(undefined as any);
    const result = await useCase.execute(insuredId);
    expect(result).toEqual([]);
    expect(repo.getMedicalCentersByCountry).not.toHaveBeenCalled();
  });

  it("lanza error si el ID del asegurado es inválido", async () => {
    await expect(useCase.execute("12A45")).rejects.toThrow("Código de asegurado inválido");
    await expect(useCase.execute("1234")).rejects.toThrow("Código de asegurado inválido");
  });
});
