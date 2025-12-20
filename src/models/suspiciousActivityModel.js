import mongoose from "mongoose";

const suspiciousActivitySchema = new mongoose.Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    ipAddress: { 
        type: String, 
        required: true,
        index: true 
    }, 
    
    // Type of event (e.g., 'RATE_LIMIT_BLOCK', 'CAPTCHA_FAIL', 'JESUS_ATTACK')
    eventType: { 
        type: String, 
        required: true,
        enum: ['RATE_LIMIT_BLOCK', 'CAPTCHA_FAIL', 'INPUT_VALIDATION_FAIL', 'E11000_RACE_CONDITION']
    },

    endpoint: { type: String, required: true },

    details: { type: mongoose.Schema.Types.Mixed },

    payload: { type: mongoose.Schema.Types.Mixed, 
    default: null } 
}, {
    timestamps: true 
});

export const SuspiciousActivity = mongoose.model("SuspiciousActivity", suspiciousActivitySchema);