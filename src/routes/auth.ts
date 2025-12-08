import { Router } from "express"
import {

    login,
  registerUser
} from "../controllers/auth.controller"
// import { authenticate } from "../middleware/auth"
// import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"

const router = Router()

// register (only USER) - public
router.post("/register", registerUser)

router.post("/login", login)

export default router