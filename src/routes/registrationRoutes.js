import express from "express";
import { registerStudent , getAllRegistrations} from "../controllers/registrationController.js";

const router = express.Router();

router.post("/register",strictRegistrationLimiter,registerStudent);
router.get("/registrations",globalLimiter, getAllRegistrations);

export default router;