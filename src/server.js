import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import connectDB from "./config/db.js";
import requestId from "./middlewares/requestId.js";
import  errorMiddleware  from "./middlewares/errorMiddleware.js";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import {asyncHandler}  from "./utils/AsyncHandler.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import { createServer } from "http";
import { globalLimiter } from "./middlewares/securityLimiters.js";


dotenv.config();

connectDB();

const app = express();


app.use(requestId);

app.set("trust proxy", 1);

app.use(express.json({limit : "10kb"}));

app.use(helmet()); 
app.use(helmet({
    
    contentSecurityPolicy: {
        directives: {

            defaultSrc: ["'self'"], 
            
            // Allow scripts from your site and the official Google/gstatic domains for reCAPTCHA
            scriptSrc: ["'self'", 'https://www.google.com', 'https://www.gstatic.com'],
            
            // Allow iframes for the reCAPTCHA widget
            frameSrc: ["'self'", 'https://www.google.com'],
            
            // Allow connecting to your own backend (self) and Google's verification URL
            connectSrc: ["'self'", 'https://www.google.com', 'http://localhost:5173', 'https://registrationccc.vercel.app'],
            
            // Allow basic styles from 'self' and 'unsafe-inline' temporarily (if necessary for frameworks)
            styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
           
        },
    },

    frameguard: {
        action: 'deny', 
    },
    

    strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
 
    noSniff: true, 
}));

app.use(express.urlencoded({ extended: true, limit: "10kb" }));


app.use(
  hpp({
    whitelist: ["filter", "sort"], 
  })
);

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://registrationccc.vercel.app"]
    : ["http://localhost:5173", "https://registrationccc.vercel.app"];


// cors
app.use(
    cors({
        // origin: process.env.FRONTEND_URL,
        origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(" Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    })
);


app.use(globalLimiter);


// const globalLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, 
//     max: 100,
//     message: "Too many general requests from this IP, please try again later.",
//     standardHeaders: true,
//     legacyHeaders: false,
// });
// app.use(globalLimiter);

// const strictRegistrationLimiter = rateLimit({
//     windowMs: 60*60*1000,
//     max: 5, 
//     standardHeaders: true,
//     legacyHeaders: false,
//     message : { 
//         success: false, 
//         message: "Too many registration attempts. Please try again after one hour." 
//     },
// });
// app.use(strictRegistrationLimiter);


const limiter = rateLimit({
    windowMs: 60*1000,
    max: 20, 
    message : "Too many request,please try again later.",
  });


app.use(limiter);


app.get("/",(req,res) => {
    res.send("SPOCC55 Backend is Running Well");
});

app.get("/test",
    asyncHandler(async (req,res) => {
        const fakeData = {user : "love Varsheny", role : "developer"};
        res.status(200)
        .json ( new ApiResponse(200,fakeData,"Test Route working"))

    })
);


app.use("/api/v1", registrationRoutes);

app.use(errorMiddleware);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


const PORT = process.env.PORT || 8000 ;

app.listen(PORT, ()=> {
    console.log(`Server is running on Port : ${PORT}`);
});


const server = createServer(app);
export default server;
