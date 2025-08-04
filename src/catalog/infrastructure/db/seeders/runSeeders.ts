import 'dotenv/config';

import { countries, specialties, medicalCenters, patients, doctors } from "./seedData";
import { CatalogRepository } from "../../repositories/CatalogRepositoryImpl";

function mapEntityToItem(entity: any, type: string): Record<string, any> {
  switch (type) {
    case "country":
      return { PK: `COUNTRY#${entity.iso}`, SK: "METADATA#", ...entity };
    case "specialty":
      return { PK: `SPECIALTY#${entity.id}`, SK: "METADATA#", ...entity };
    case "medicalCenter":
      return { PK: `CENTER#${entity.id}`, SK: "METADATA#", ...entity };
    case "patient":
      return { PK: `PATIENT#${entity.id}`, SK: "METADATA#", ...entity };
    case "doctor":
      return { PK: `DOCTOR#${entity.specialtyId}#${entity.centerId}#${entity.countryISO}#${entity.id}`, SK: "METADATA#", ...entity };
    default:
      throw new Error("Unknown entity type: " + type);
  }
}

async function seedAll() {
  const repo = new CatalogRepository();
  const allItems = [
    ...countries.map((c) => mapEntityToItem(c, "country")),
    ...specialties.map((s) => mapEntityToItem(s, "specialty")),
    ...medicalCenters.map((m) => mapEntityToItem(m, "medicalCenter")),
    ...patients.map((p) => mapEntityToItem(p, "patient")),
    ...doctors.map((d) => mapEntityToItem(d, "doctor")),
  ];

  for (const item of allItems) {
    try {
      // Verifica si ya existe
      const exists = await repo.exists(item.PK, item.SK);
      if (exists) {
        console.log("Jumping existing item: ", item.PK);
        continue;
      }
      await repo.save(item);
      console.log("Seeded: ", item.PK);
    } catch (err) {
      console.error("Error seeding ", item.PK, err);
    }
  }
}

seedAll().then(() => console.log("Seeding completed"));
