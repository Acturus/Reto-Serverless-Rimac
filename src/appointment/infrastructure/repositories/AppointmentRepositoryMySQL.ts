import mysql, {Connection} from "mysql2/promise";
import { AppointmentEntity } from "../../domain/entities/AppointmentEntity";
import { MySQLConfig } from "../types/MySQLConfig";
import { IAppointmentRepository } from "../../domain/repositories/AppointmentRepository";
import { UpdateAppointmentDTO } from "../../application/dtos/UpdateAppointmentDto";

export class AppointmentRepositoryMySQL implements IAppointmentRepository {
  private config: MySQLConfig;
  private conn!: Connection;

  constructor(config: MySQLConfig) {
    this.config = config;
  }
  update(data: UpdateAppointmentDTO): Promise<void> {
    throw new Error("Method not implemented.");
  }
  get(id: string): Promise<AppointmentEntity[]> {
    throw new Error("Method not implemented.");
  }

  async init() {
    if (!this.conn) {
      this.conn = await mysql.createConnection(this.config);
    }
  }

  async close() {
    if (this.conn) {
      await this.conn.end();
    }
  }

  private async ensureTableExists() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS appointments (
        appointment_id varchar(26) NOT NULL,
        insured_id char(5) NOT NULL,
        doctor_id varchar(30) NOT NULL,
        medical_center_id varchar(30) NOT NULL,
        specialty_id varchar(30) NOT NULL,
        date datetime NOT NULL,
        country_iso char(2) NOT NULL,
        state varchar(20) NOT NULL DEFAULT 'completed',
        PRIMARY KEY (appointment_id)
      );`;

    try {
      await this.conn.execute(createTableSQL);
    } catch (error) {
      console.warn("There was an error ensuring the table existence: ", error);
    }
  }

  async save(appointment: AppointmentEntity) {
    
    await this.init();

    await this.ensureTableExists();

    console.log("Saving appointment: ", appointment);

    try {
      await this.conn.execute(
        `INSERT IGNORE INTO appointments 
          (appointment_id, insured_id, doctor_id, medical_center_id, specialty_id, date, country_iso)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          appointment.appointmentId,
          appointment.insuredId,
          appointment.doctorId,
          appointment.medicalCenterId,
          appointment.specialtyId,
          appointment.date,
          appointment.countryISO
        ]
      );
    } catch (error) {
      console.error("Error storing data: ", error);
      throw error;
    } finally {
      this.close();
    }
  }
}
