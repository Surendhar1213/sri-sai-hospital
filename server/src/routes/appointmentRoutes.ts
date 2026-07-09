import { Router } from "express";
import {
  createAppointment,
  getAllAppointments,
  updateAppointment,
  getBookedSlots,
  appointmentSSE,
  getRevenueStats,
} from "../controllers/appointmentController.js";
import { verifyAdminToken, verifyUserOrAdminToken } from "../middlewares/authMiddleware.js";
import { bookingLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// /api/appointments/live -> SSE endpoint
router.get("/live", appointmentSSE);
router.get("/booked-slots", getBookedSlots); // <--- Add this route BEFORE "/"
router.get("/revenue-stats", verifyAdminToken, getRevenueStats);
// Public route for patients to book (Rate limited to prevent spam)
router.post("/", bookingLimiter, createAppointment);
// Admin dashboard actions secured with authentication middleware
router.get("/", verifyUserOrAdminToken, getAllAppointments);
router.put("/:id", verifyAdminToken, updateAppointment);

export default router;
