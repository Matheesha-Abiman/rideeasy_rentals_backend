import { Router } from "express";

import {
  createBike,
  deleteBike,
  editBike,
  getAllBike,
} from "../controllers/bike.controller";
import { Role } from "../models/user.model";
import { requireRole } from "../middleware/role";
import { upload } from "../middleware/upload";
import { getBikeById } from "../controllers/bike.controller";
import { searchBike } from "../controllers/bike.controller";

const router = Router();

router.post(
  "/create",
  requireRole([Role.ADMIN, Role.USER]),
  upload.single("images"),
  createBike
);

router.get("/getAll", requireRole([Role.ADMIN, Role.USER]), getAllBike);

router.put(
  "/update/:id",
  requireRole([Role.ADMIN, Role.USER]),
  upload.single("image"),
  editBike
);

router.delete("/delete/:id", requireRole([Role.ADMIN, Role.USER]), deleteBike);

router.get("/:id", requireRole([Role.ADMIN, Role.USER]), getBikeById);

router.get("/", requireRole([Role.ADMIN, Role.USER]), searchBike);
export default router;
