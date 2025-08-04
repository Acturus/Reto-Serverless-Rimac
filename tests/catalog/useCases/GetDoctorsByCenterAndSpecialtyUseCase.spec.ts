import { GetDoctorsByCenterAndSpecialtyUseCase } from "../../../src/catalog/application/useCases/GetDoctorsByCenterAndSpecialtyUseCase";
import { ICatalogRepository } from "../../../src/catalog/domain/repositories/CatalogRepository";
import { DoctorEntity } from "../../../src/catalog/domain/entities/DoctorEntity";

describe("GetDoctorsByCenterAndSpecialtyUseCase", () => {
  let repo: jest.Mocked<ICatalogRepository>;
  let useCase: GetDoctorsByCenterAndSpecialtyUseCase;

  const doctorsMock: DoctorEntity[] = [
    {
      id: "D001",
      name: "Gregory",
      surname: "House",
      gender: "M",
      specialty: "Diagnóstico",
      specialtyId: "S001",
      centerId: "C001",
      countryISO: "PE"
    },
    {
      id: "D002",
      name: "Meredith",
      surname: "Grey",
      gender: "F",
      specialty: "Cirugía",
      specialtyId: "S001",
      centerId: "C001",
      countryISO: "PE"
    }
  ];

  beforeEach(() => {
    repo = {
      getDoctorsByCenterAndSpecialty: jest.fn().mockResolvedValue(doctorsMock)
    } as any;
    useCase = new GetDoctorsByCenterAndSpecialtyUseCase(repo);
  });

  it("devuelve los doctores para el centro y especialidad indicados", async () => {
    const result = await useCase.execute("C001", "S001");
    expect(repo.getDoctorsByCenterAndSpecialty).toHaveBeenCalledWith("C001", "S001");
    expect(result).toEqual(doctorsMock);
  });

  it("devuelve array vacío si el repo retorna vacío", async () => {
    repo.getDoctorsByCenterAndSpecialty.mockResolvedValueOnce([]);
    const result = await useCase.execute("C001", "S001");
    expect(result).toEqual([]);
  });
});
