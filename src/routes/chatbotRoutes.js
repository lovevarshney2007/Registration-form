import express from "express";
import {
  chat,
  chatStream,
  suggest,
  health,
} from "../controllers/chatbotController.js";


const router = express.Router();

router.post("/chat", chat);
router.post("/chat/stream", chatStream);
router.post("/suggest", suggest);
router.get("/health", health);

export default router;