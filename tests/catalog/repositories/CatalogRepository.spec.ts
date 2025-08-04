import { CatalogRepository } from "../../../src/catalog/infrastructure/repositories/CatalogRepositoryImpl";
import { MedicalCenterEntity } from "../../../src/catalog/domain/entities/MedicalCenterEntity";
import { DoctorEntity } from "../../../src/catalog/domain/entities/DoctorEntity";
import { PatientEntity } from "../../../src/catalog/domain/entities/PatientEntity";

// ---- Mocks AWS SDK ----
let lastCommandInput: any = undefined;
const sendMock = jest.fn();

jest.mock("@aws-sdk/lib-dynamodb", () => ({
  PutCommand: function(input: any) { lastCommandInput = input; return { __type: "PutCommand", input }; },
  GetCommand: function(input: any) { lastCommandInput = input; return { __type: "GetCommand", input }; },
  ScanCommand: function(input: any) { lastCommandInput = input; return { __type: "ScanCommand", input }; },
  DynamoDBDocumentClient: {
    from: jest.fn(() => ({ send: sendMock })),
  },
}));
jest.mock("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: jest.fn(),
}));

process.env.CATALOGS_TABLE = "test-catalogs-table";

describe("CatalogRepository", () => {
  let repo: CatalogRepository;

  beforeEach(() => {
    sendMock.mockReset();
    lastCommandInput = undefined;
    repo = new CatalogRepository();
  });

  it("lanza error si la variable de entorno falta", () => {
    delete process.env.CATALOGS_TABLE;
    expect(() => new CatalogRepository()).toThrow("CATALOGS_TABLE environment variable is not set");
    process.env.CATALOGS_TABLE = "test-catalogs-table"; // Restore for other tests
  });

  it("verifica existencia de un elemento con exists (true/false)", async () => {
    // Simula item encontrado
    sendMock.mockResolvedValueOnce({ Item: { id: "123" } });
    const exists = await repo.exists("PK001", "SK001");
    expect(exists).toBe(true);
    expect(lastCommandInput).toMatchObject({
      TableName: "test-catalogs-table",
      Key: { PK: "PK001", SK: "SK001" }
    });

    // Simula item NO encontrado
    sendMock.mockResolvedValueOnce({ Item: undefined });
    const notExists = await repo.exists("PK002", "SK002");
    expect(notExists).toBe(false);
  });

  it("guarda un elemento con save", async () => {
    sendMock.mockResolvedValueOnce({});
    const item = { PK: "PATIENT#12345", SK: "METADATA#", name: "Arturo" };
    await repo.save(item);
    expect(sendMock).toHaveBeenCalled();
    expect(lastCommandInput).toMatchObject({
      TableName: "test-catalogs-table",
      Item: item
    });
  });

  it("obtiene un paciente por ID si existe", async () => {
    const patient: PatientEntity = {
      id: "P001",
      name: "Juan",
      surname: "Perez",
      countryISO: "PE"
    };
    sendMock.mockResolvedValueOnce({ Item: patient });
    const result = await repo.getPatientById("12345");
    expect(sendMock).toHaveBeenCalled();
    expect(result).toEqual(patient);
    expect(lastCommandInput).toMatchObject({
      TableName: "test-catalogs-table",
      Key: { PK: "PATIENT#12345", SK: "METADATA#" }
    });
  });

  it("devuelve null si el paciente no existe", async () => {
    sendMock.mockResolvedValueOnce({ Item: undefined });
    const result = await repo.getPatientById("99999");
    expect(result).toBeNull();
  });

  it("obtiene centros médicos por país", async () => {
    const centers: MedicalCenterEntity[] = [
      { id: "C001", name: "Clínica Salud", countryISO: "PE", type: "privado", specialties: ["cardiología"] }
    ];
    sendMock.mockResolvedValueOnce({ Items: centers });
    const result = await repo.getMedicalCentersByCountry("PE");
    expect(result).toEqual(centers);
    expect(lastCommandInput).toMatchObject({
      TableName: "test-catalogs-table",
      FilterExpression: expect.any(String),
      ExpressionAttributeValues: { ":pk": "CENTER#", ":country": "PE" }
    });
  });

  it("devuelve array vacío si no hay centros médicos", async () => {
    sendMock.mockResolvedValueOnce({ Items: [] });
    const result = await repo.getMedicalCentersByCountry("PE");
    expect(result).toEqual([]);
  });

  it("obtiene doctores por centro y especialidad", async () => {
    const doctors: DoctorEntity[] = [
      {
        id: "D001",
        name: "Gregory",
        surname: "House",
        gender: "M",
        specialty: "Diagnóstico",
        specialtyId: "S001",
        centerId: "C001",
        countryISO: "PE"
      }
    ];
    sendMock.mockResolvedValueOnce({ Items: doctors });
    const result = await repo.getDoctorsByCenterAndSpecialty("C001", "S001");
    expect(result).toEqual(doctors);
    expect(lastCommandInput).toMatchObject({
      TableName: "test-catalogs-table",
      FilterExpression: expect.any(String),
      ExpressionAttributeValues: {
        ":pk": "DOCTOR#",
        ":centerId": "C001",
        ":specialtyId": "S001"
      }
    });
  });

  it("devuelve array vacío si no hay doctores", async () => {
    sendMock.mockResolvedValueOnce({ Items: [] });
    const result = await repo.getDoctorsByCenterAndSpecialty("C001", "S001");
    expect(result).toEqual([]);
  });

  it("propaga errores de DynamoDB", async () => {
    sendMock.mockRejectedValueOnce(new Error("DynamoDB error"));
    await expect(repo.save({ PK: "X", SK: "Y" })).rejects.toThrow("DynamoDB error");
  });
});
