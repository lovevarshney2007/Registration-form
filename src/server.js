import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sanitize from "mongo-sanitize";
import xss from "xss";
import hpp from "hpp";
import connectDB from "./config/db.js";
import  errorMiddleware  from "./middlewares/errorMiddleware.js";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import {asyncHandler}  from "./utils/AsyncHandler.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import { createServer } from "http";


dotenv.config();

connectDB();

const app = express();

app.set("trust proxy", 1);

app.use(express.json({limit : "10kb"}));
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use((req, res, next) => {
  // sanitize req.body
  if (req.body && typeof req.body === "object") {
    console.log(" Sanitizing input data");

    for (const key in req.body) {
      req.body[key] = sanitize(req.body[key]);
    }
  }

  // sanitize req.query safely (no reassignment)
  if (req.query && typeof req.query === "object") {
    for (const key in req.query) {
      req.query[key] = sanitize(req.query[key]);
    }
  }

  // sanitize req.params
  if (req.params && typeof req.params === "object") {
    for (const key in req.params) {
      req.params[key] = sanitize(req.params[key]);
    }
  }

  next();
});

// app.use(xss());
app.use((req, res, next) => {
  // sanitize body
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  // sanitize query
  if (req.query && typeof req.query === "object") {
    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        req.query[key] = xss(req.query[key]);
      }
    }
  }

  // sanitize params
  if (req.params && typeof req.params === "object") {
    for (const key in req.params) {
      if (typeof req.params[key] === "string") {
        req.params[key] = xss(req.params[key]);
      }
    }
  }

  next();
});

app.use(
  hpp({
   
    whitelist: ["filter", "sort"], 
  })
);

const allowedOrigins = [
            "http://localhost:5173",
            "https://registrationccc.vercel.app"
];

app.use(
    cors({
        // origin: process.env.FRONTEND_URL,
        origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("🚫 Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    })
);

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

// test error route
app.get("/error", (req,res,next) => {
  next( new ApiError(400, "Manual error generated!"));
});

app.get("/api/test-cors", (req, res) => {
  res.json({ success: true, message: "CORS is configured correctly ✅" });
});




app.use("/api/v1", registrationRoutes);


app.use(errorMiddleware);


// const PORT = process.env.PORT || 8000 ;

// app.listen(PORT, ()=> {
//     console.log(`Server is running on Port : ${PORT}`);
// });


const server = createServer(app);
export default server;
