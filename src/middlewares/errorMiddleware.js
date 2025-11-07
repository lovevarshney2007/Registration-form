import { ApiError } from "../utils/apiError.js";

const errorMiddleware = (err,req,res,next) => {
    if (err instanceof ApiError){
        return res.status(err.statusCode).json({
            success: false,
            message : err.message,
            errors : err.errors || [],
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,

        });
    }

    if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value for '${duplicateField}' — already registered.`,
    });
  }


    console.error("Unexpected error : ", err);
    return res.status(500).json({
        success:false,
        message: "Internal Server Error",
    });
};

export default errorMiddleware;