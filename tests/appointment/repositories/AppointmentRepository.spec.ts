import { AppointmentRepository } from "../../../src/appointment/infrastructure/repositories/AppointmentRepositoryImpl";
import { AppointmentEntity } from "../../../src/appointment/domain/entities/AppointmentEntity";

// Mock de DynamoDBDocumentClient y comandos
let lastPutCommandInput: any = undefined;
const sendMock = jest.fn();

jest.mock("@aws-sdk/lib-dynamodb", () => {
  // Mockea PutCommand y QueryCommand para que puedas hacer instanceof si hace falta
  return {
    PutCommand: function(input: any) {
      lastPutCommandInput = input;    // Guarda el input recibido en cada uso
      return { __type: "PutCommand", input };
    },
    QueryCommand: jest.fn(),
    DynamoDBDocumentClient: {
      from: jest.fn(() => ({
        send: sendMock,
      })),
    },
  };
});
jest.mock("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: jest.fn(),
}));

// Setup env var antes de importar el repo
process.env.APPOINTMENTS_TABLE = "test-table";

describe("AppointmentRepository", () => {
  let repo: AppointmentRepository;

  beforeEach(() => {
    sendMock.mockReset();
    repo = new AppointmentRepository();
  });

  it("guarda una cita usando PutCommand correctamente", async () => {
    sendMock.mockResolvedValue({}); // Simula éxito

    const appointment: AppointmentEntity = {
      appointmentId: "A1",
      insuredId: "12345",
      doctorId: "M001",
      medicalCenterId: "C001",
      specialtyId: "S001",
      date: "2024-09-10T12:00:00Z",
      countryISO: "PE",
      state: "pending"
    };

    await repo.save(appointment);

    // Verifica los argumentos recibidos por PutCommand a través del lastPutCommandInput
    expect(lastPutCommandInput.TableName).toBe("test-table");
    expect(lastPutCommandInput.Item.PK).toBe("INSURED#12345");
    expect(lastPutCommandInput.Item.SK).toBe("APPOINTMENT#A1");
  });

  it("obtiene citas de un asegurado usando QueryCommand", async () => {
    sendMock.mockResolvedValue({
      Items: [
        {
          appointmentId: "A1",
          insuredId: "12345",
          doctorId: "M001",
          medicalCenterId: "C001",
          specialtyId: "S001",
          date: "2024-09-10T12:00:00Z",
          countryISO: "PE",
          state: "pending"
        }
      ]
    });

    const result = await repo.getByInsuredId("12345");
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("appointmentId", "A1");
    expect(result[0]).toHaveProperty("insuredId", "12345");
  });

  it("retorna un array vacío si no hay citas", async () => {
    sendMock.mockResolvedValue({ Items: [] });
    const result = await repo.getByInsuredId("99999");
    expect(result).toEqual([]);
  });

  it("lanza error si la variable de entorno falta", () => {
    // Borramos la var antes de importar
    delete process.env.APPOINTMENTS_TABLE;
    expect(() => new AppointmentRepository()).toThrow("APPOINTMENTS_TABLE environment variable is not set");
    process.env.APPOINTMENTS_TABLE = "test-table"; // La reponemos para otros tests
  });

  it("propaga errores del cliente de DynamoDB", async () => {
    sendMock.mockRejectedValue(new Error("AWS error"));
    const appointment: AppointmentEntity = {
      appointmentId: "A2",
      insuredId: "12345",
      doctorId: "M001",
      medicalCenterId: "C001",
      specialtyId: "S001",
      date: "2024-09-10T12:00:00Z",
      countryISO: "PE",
      state: "pending"
    };
    await expect(repo.save(appointment)).rejects.toThrow("AWS error");
  });
});
