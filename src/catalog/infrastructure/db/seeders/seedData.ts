import { CountryEntity } from "../../../domain/entities/CountryEntity";
import { MedicalCenterEntity } from "../../../domain/entities/MedicalCenterEntity";
import { SpecialtyEntity } from "../../../domain/entities/SpecialtyEntity";
import { PatientEntity } from "../../../domain/entities/PatientEntity";
import { DoctorEntity } from "../../../domain/entities/DoctorEntity";

export const countries: CountryEntity[] = [
  { iso: "PE", name: "Perú" },
  { iso: "CL", name: "Chile" },
];

// ESPECIALIDADES
export const specialties: SpecialtyEntity[] = [
  { id: "CARD", name: "Cardiología" },
  { id: "ONCO", name: "Oncología" },
  { id: "NEUR", name: "Neurología" },
  { id: "TRAS", name: "Trasplantes" },
  { id: "UCI",  name: "UCI" },
  { id: "PEDI", name: "Pediatría" },
  { id: "TRAU", name: "Trauma" },
  { id: "CIRU", name: "Cirugía" },
  { id: "ENFE", name: "Enfermedades crónicas" },
  { id: "MEDI", name: "Medicina interna" },
  { id: "OBST", name: "Obstetricia" },
  { id: "ROB",  name: "Cirugía robótica" },
  { id: "NEUC", name: "Neurocirugía" },
  { id: "GEN",  name: "Cirugía general" },
  { id: "ORTO", name: "Ortopedia" },
  { id: "URO",  name: "Urología" },
];

// CENTROS MÉDICOS
export const medicalCenters: MedicalCenterEntity[] = [
  {
    id: "REBG",
    name: "Edgardo Rebagliati Martins",
    countryISO: "PE",
    type: "Público EsSalud",
    specialties: ["CARD", "ONCO", "NEUR", "TRAS", "UCI", "PEDI"],
  },
  {
    id: "ALME",
    name: "Guillermo Almenara Irigoyen",
    countryISO: "PE",
    type: "Público EsSalud",
    specialties: ["TRAU", "CIRU", "ENFE"],
  },
  {
    id: "LOAY",
    name: "Arzobispo Loayza",
    countryISO: "PE",
    type: "Público/Docente",
    specialties: ["MEDI", "CIRU", "OBST", "ONCO"],
  },
  {
    id: "ALEM",
    name: "Clínica Alemana de Santiago",
    countryISO: "CL",
    type: "Privado",
    specialties: ["CARD", "ONCO", "ROB", "PEDI"],
  },
  {
    id: "UDECH",
    name: "Clínica Universidad de Chile",
    countryISO: "CL",
    type: "Privado/Universitario",
    specialties: ["NEUC", "PEDI", "GEN"],
  },
  {
    id: "LCOND",
    name: "Clínica Las Condes",
    countryISO: "CL",
    type: "Privado",
    specialties: ["CARD", "ORTO", "URO"],
  },
];

// PACIENTES
export const patients: PatientEntity[] = [
  { id: "00001", name: "Luis",    surname: "Salazar",  countryISO: "PE" },
  { id: "00002", name: "Martín",  surname: "Vargas",   countryISO: "CL" },
  { id: "00003", name: "Carlos",  surname: "Paredes",  countryISO: "PE" },
  { id: "00004", name: "Felipe",  surname: "Toro",     countryISO: "CL" },
  { id: "00005", name: "María",   surname: "Quispe",   countryISO: "PE" },
  { id: "00006", name: "Camila",  surname: "Reyes",    countryISO: "CL" },
  { id: "00007", name: "Isabel",  surname: "Morales",  countryISO: "PE" },
  { id: "00008", name: "Antonia", surname: "Soto",     countryISO: "CL" },
];

// DOCTORES
export const doctors: DoctorEntity[] = [
    // Cardiología
    { id: "CARD_REBG_PE_01", name: "Javier", surname: "Cruz", gender: "M", specialty: "Cardiología", specialtyId: "CARD", centerId: "REBG", countryISO: "PE" },
    { id: "CARD_REBG_PE_02", name: "Valeria", surname: "Torres", gender: "F", specialty: "Cardiología", specialtyId: "CARD", centerId: "REBG", countryISO: "PE" },
    { id: "CARD_ALEM_CL_01", name: "Nicolás", surname: "Martínez", gender: "M", specialty: "Cardiología", specialtyId: "CARD", centerId: "ALEM", countryISO: "CL" },
    { id: "CARD_ALEM_CL_02", name: "Daniela", surname: "Espinoza", gender: "F", specialty: "Cardiología", specialtyId: "CARD", centerId: "ALEM", countryISO: "CL" },
    // Oncología
    { id: "ONCO_REBG_PE_01", name: "Ricardo", surname: "Mendoza", gender: "M", specialty: "Oncología", specialtyId: "ONCO", centerId: "REBG", countryISO: "PE" },
    { id: "ONCO_REBG_PE_02", name: "Lucía", surname: "Vargas", gender: "F", specialty: "Oncología", specialtyId: "ONCO", centerId: "REBG", countryISO: "PE" },
    { id: "ONCO_ALEM_CL_01", name: "Francisco", surname: "Bravo", gender: "M", specialty: "Oncología", specialtyId: "ONCO", centerId: "ALEM", countryISO: "CL" },
    { id: "ONCO_ALEM_CL_02", name: "Josefa", surname: "Salinas", gender: "F", specialty: "Oncología", specialtyId: "ONCO", centerId: "ALEM", countryISO: "CL" },
    // Neurología (Perú - REBG)
    { id: "NEUR_REBG_PE_01", name: "Andrés", surname: "Fuentes", gender: "M", specialty: "Neurología", specialtyId: "NEUR", centerId: "REBG", countryISO: "PE" },
    { id: "NEUR_REBG_PE_02", name: "Carolina", surname: "Muñoz", gender: "F", specialty: "Neurología", specialtyId: "NEUR", centerId: "REBG", countryISO: "PE" },
    // Trasplantes (Perú - REBG)
    { id: "TRAS_REBG_PE_01", name: "Samuel", surname: "Zapata", gender: "M", specialty: "Trasplantes", specialtyId: "TRAS", centerId: "REBG", countryISO: "PE" },
    { id: "TRAS_REBG_PE_02", name: "Sofía", surname: "Ramírez", gender: "F", specialty: "Trasplantes", specialtyId: "TRAS", centerId: "REBG", countryISO: "PE" },
    // UCI (Perú - REBG)
    { id: "UCI_REBG_PE_01", name: "Fernando", surname: "Ponce", gender: "M", specialty: "UCI", specialtyId: "UCI", centerId: "REBG", countryISO: "PE" },
    { id: "UCI_REBG_PE_02", name: "Natalia", surname: "Peralta", gender: "F", specialty: "UCI", specialtyId: "UCI", centerId: "REBG", countryISO: "PE" },
    // Pediatría (Perú - REBG)
    { id: "PEDI_REBG_PE_01", name: "Oscar", surname: "Valdivia", gender: "M", specialty: "Pediatría", specialtyId: "PEDI", centerId: "REBG", countryISO: "PE" },
    { id: "PEDI_REBG_PE_02", name: "Patricia", surname: "Mora", gender: "F", specialty: "Pediatría", specialtyId: "PEDI", centerId: "REBG", countryISO: "PE" },
    // Pediatría (Chile - ALEM)
    { id: "PEDI_ALEM_CL_01", name: "Cristóbal", surname: "Campos", gender: "M", specialty: "Pediatría", specialtyId: "PEDI", centerId: "ALEM", countryISO: "CL" },
    { id: "PEDI_ALEM_CL_02", name: "Gabriela", surname: "Ríos", gender: "F", specialty: "Pediatría", specialtyId: "PEDI", centerId: "ALEM", countryISO: "CL" },
    // Trauma (Perú - ALME)
    { id: "TRAU_ALME_PE_01", name: "Mauricio", surname: "Vega", gender: "M", specialty: "Trauma", specialtyId: "TRAU", centerId: "ALME", countryISO: "PE" },
    { id: "TRAU_ALME_PE_02", name: "Daniela", surname: "Aguilar", gender: "F", specialty: "Trauma", specialtyId: "TRAU", centerId: "ALME", countryISO: "PE" },
    // Cirugía (Perú - ALME)
    { id: "CIRU_ALME_PE_01", name: "Alonso", surname: "Quinteros", gender: "M", specialty: "Cirugía", specialtyId: "CIRU", centerId: "ALME", countryISO: "PE" },
    { id: "CIRU_ALME_PE_02", name: "Jimena", surname: "Estrada", gender: "F", specialty: "Cirugía", specialtyId: "CIRU", centerId: "ALME", countryISO: "PE" },
    // Cirugía (Perú - LOAY)
    { id: "CIRU_LOAY_PE_01", name: "Sergio", surname: "Pineda", gender: "M", specialty: "Cirugía", specialtyId: "CIRU", centerId: "LOAY", countryISO: "PE" },
    { id: "CIRU_LOAY_PE_02", name: "Fiorella", surname: "Montes", gender: "F", specialty: "Cirugía", specialtyId: "CIRU", centerId: "LOAY", countryISO: "PE" },
    // Enfermedades crónicas (Perú - ALME)
    { id: "ENFE_ALME_PE_01", name: "Eduardo", surname: "Solís", gender: "M", specialty: "Enfermedades crónicas", specialtyId: "ENFE", centerId: "ALME", countryISO: "PE" },
    { id: "ENFE_ALME_PE_02", name: "Melina", surname: "Zapata", gender: "F", specialty: "Enfermedades crónicas", specialtyId: "ENFE", centerId: "ALME", countryISO: "PE" },
    // Medicina interna (Perú - LOAY)
    { id: "MEDI_LOAY_PE_01", name: "Jorge", surname: "Silva", gender: "M", specialty: "Medicina interna", specialtyId: "MEDI", centerId: "LOAY", countryISO: "PE" },
    { id: "MEDI_LOAY_PE_02", name: "Elena", surname: "Castillo", gender: "F", specialty: "Medicina interna", specialtyId: "MEDI", centerId: "LOAY", countryISO: "PE" },
    // Obstetricia (Perú - LOAY)
    { id: "OBST_LOAY_PE_01", name: "Hernán", surname: "Ortega", gender: "M", specialty: "Obstetricia", specialtyId: "OBST", centerId: "LOAY", countryISO: "PE" },
    { id: "OBST_LOAY_PE_02", name: "Ariana", surname: "Cáceres", gender: "F", specialty: "Obstetricia", specialtyId: "OBST", centerId: "LOAY", countryISO: "PE" },
    // Cirugía robótica (Chile - ALEM)
    { id: "ROB_ALEM_CL_01", name: "Esteban", surname: "Ferrari", gender: "M", specialty: "Cirugía robótica", specialtyId: "ROB", centerId: "ALEM", countryISO: "CL" },
    { id: "ROB_ALEM_CL_02", name: "Macarena", surname: "Cordero", gender: "F", specialty: "Cirugía robótica", specialtyId: "ROB", centerId: "ALEM", countryISO: "CL" },
    // Neurocirugía (Chile - UDECH)
    { id: "NEUC_UDECH_CL_01", name: "Patricio", surname: "Aravena", gender: "M", specialty: "Neurocirugía", specialtyId: "NEUC", centerId: "UDECH", countryISO: "CL" },
    { id: "NEUC_UDECH_CL_02", name: "Cecilia", surname: "Fuenzalida", gender: "F", specialty: "Neurocirugía", specialtyId: "NEUC", centerId: "UDECH", countryISO: "CL" },
    // Pediatría (Chile - UDECH)
    { id: "PEDI_UDECH_CL_01", name: "Tomás", surname: "Rivas", gender: "M", specialty: "Pediatría", specialtyId: "PEDI", centerId: "UDECH", countryISO: "CL" },
    { id: "PEDI_UDECH_CL_02", name: "Francisca", surname: "Gallardo", gender: "F", specialty: "Pediatría", specialtyId: "PEDI", centerId: "UDECH", countryISO: "CL" },
    // Cirugía general (Chile - UDECH)
    { id: "GEN_UDECH_CL_01", name: "Ignacio", surname: "Correa", gender: "M", specialty: "Cirugía general", specialtyId: "GEN", centerId: "UDECH", countryISO: "CL" },
    { id: "GEN_UDECH_CL_02", name: "Bárbara", surname: "Riquelme", gender: "F", specialty: "Cirugía general", specialtyId: "GEN", centerId: "UDECH", countryISO: "CL" },
    // Ortopedia (Chile - LCOND)
    { id: "ORTO_LCOND_CL_01", name: "Rodrigo", surname: "Sanhueza", gender: "M", specialty: "Ortopedia", specialtyId: "ORTO", centerId: "LCOND", countryISO: "CL" },
    { id: "ORTO_LCOND_CL_02", name: "Constanza", surname: "Meza", gender: "F", specialty: "Ortopedia", specialtyId: "ORTO", centerId: "LCOND", countryISO: "CL" },
    // Urología (Chile - LCOND)
    { id: "URO_LCOND_CL_01", name: "Felipe", surname: "Espinosa", gender: "M", specialty: "Urología", specialtyId: "URO", centerId: "LCOND", countryISO: "CL" },
    { id: "URO_LCOND_CL_02", name: "Valentina", surname: "Herrera", gender: "F", specialty: "Urología", specialtyId: "URO", centerId: "LCOND", countryISO: "CL" },
]