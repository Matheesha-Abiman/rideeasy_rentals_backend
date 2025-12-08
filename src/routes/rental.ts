import { Router } from "express";
import {
  createRental,
  getAllRentals,
  getRentalById,
  updateRentalStatus,
  deleteRental,
} from "../controllers/rental.controller";
import { requireRole } from "../middleware/role";
import { Role } from "../models/user.model";

const router = Router();

router.post(
  "/create",
  requireRole([Role.ADMIN, Role.USER]),
  createRental
);

router.get(
  "/getAll",
  requireRole([Role.ADMIN, Role.USER]),
  getAllRentals
);

router.get(
  "/:id",
  requireRole([Role.ADMIN, Role.USER]),
  getRentalById
);

router.put(
  "/status/:id",
  requireRole([Role.ADMIN, Role.USER]),
  updateRentalStatus
);

router.delete(
  "/delete/:id",
  requireRole([Role.ADMIN, Role.USER]),
  deleteRental
);

export default router;
