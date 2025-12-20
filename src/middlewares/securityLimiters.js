
import rateLimit from "express-rate-limit";
import { SuspiciousActivity } from "../models/suspiciousActivityModel.js";
import { safePayload } from "../utils/safePayload.js";

// 1. GLOBAL RATE LIMITER 
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many general requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});

// 2. STRICT REGISTRATION RATE LIMITER 
export const strictRegistrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 50, // Strict limit: 50 attempts per hour per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many registration attempts. Please try again after one hour."
    },

    // Handler for logging blocked attacks
    handler: (req, res, next, options) => {
        SuspiciousActivity.create({
            ipAddress: req.ip || req.connection.remoteAddress,
            eventType: 'RATE_LIMIT_BLOCK',
            endpoint: req.originalUrl,
            details: { limit: options.max, window: options.windowMs },
            payload: safePayload(req.body)

        }).catch(err => console.error("Error logging activity:", err));

        res.status(options.statusCode).send(options.message);
    }
});