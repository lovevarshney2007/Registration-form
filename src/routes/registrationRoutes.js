import express from "express";
import { registerStudent , getAllRegistrations} from "../controllers/registrationController.js";
import { strictRegistrationLimiter } from "../middlewares/securityLimiters.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

router.post("/register",strictRegistrationLimiter,registerStudent);
router.get("/registrations",adminAuth, getAllRegistrations);

export default router;