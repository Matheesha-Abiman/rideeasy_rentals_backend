import { Router } from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  deletePayment,
} from "../controllers/payment.controller";
import { requireRole } from "../middleware/role";
import { Role } from "../models/user.model";

const router = Router();

router.post(
  "/create",
  requireRole([Role.ADMIN, Role.USER]),
  createPayment
);

router.get(
  "/getAll",
  requireRole([Role.ADMIN, Role.USER]),
  getAllPayments
);

router.get(
  "/:id",
  requireRole([Role.ADMIN, Role.USER]),
  getPaymentById
);

router.delete(
  "/delete/:id",
  requireRole([Role.ADMIN, Role.USER]),
  deletePayment
);

export default router;
