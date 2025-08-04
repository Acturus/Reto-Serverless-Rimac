import { AppointmentController } from "./infrastructure/controllers/AppointmentController";

const controller = new AppointmentController();

const createAppointmentHandler = controller.createAppointmentHandler;
const getAppointmentsByInsuredIdHandler = controller.getAppointmentsByInsuredIdHandler;

export { createAppointmentHandler, getAppointmentsByInsuredIdHandler };