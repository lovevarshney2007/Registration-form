import express from "express";
import { registerStudent , getAllRegistrations} from "../controllers/registrationController.js";
import { strictRegistrationLimiter } from "../middlewares/securityLimiters.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

<<<<<<< HEAD
router.post("/register",strictRegistrationLimiter,registerStudent);
router.get("/registrations",adminAuth, getAllRegistrations);
=======
router.post("/register",registerStudent);
router.get("/registrations", getAllRegistrations);
>>>>>>> 534ea81bc78768941917e210abb0803c43231ee3

export default router;
