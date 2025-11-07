import express from "express";
import { registerStudent , getAllRegistrations} from "../controllers/registrationController.js";

const router = express.Router();

router.post("/register",registerStudent);
router.get("/registrations", getAllRegistrations);

export default router;