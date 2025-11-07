import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
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

app.use(express.json({limit : "10kb"}));
app.use(helmet());
// app.use(errorMiddleware);

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


const PORT = process.env.PORT || 8000 ;

app.listen(PORT, ()=> {
    console.log(`Server is running on Port : ${PORT}`);
});


const server = createServer(app);
export default server;