import { CatalogController } from "./infrastructure/controllers/CatalogController";

const controller = new CatalogController();

const getCentersByInsuredIdHandler = controller.getCentersByInsuredIdHandler;
const getDoctorsByCenterAndSpecialtyHandler = controller.getDoctorsByCenterAndSpecialtyHandler;

export { getCentersByInsuredIdHandler, getDoctorsByCenterAndSpecialtyHandler };