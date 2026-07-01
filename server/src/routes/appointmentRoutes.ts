import { Router } from "express";
import {
  createAppointment,
  getAllAppointments,
  updateAppointment,
  getBookedSlots,
} from "../controllers/appointmentController.js";

const router = Router();

router.get("/booked-slots", getBookedSlots); // <--- Add this route BEFORE "/"
// Public route for patients to book
router.post("/", createAppointment);
// Admin dashboard actions (Neenga middle-ware protections add pannikalaam)
router.get("/", getAllAppointments);
router.put("/:id", updateAppointment);

export default router;
