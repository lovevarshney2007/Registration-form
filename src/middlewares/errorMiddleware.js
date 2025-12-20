import { ApiError } from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {

  if (err instanceof ApiError) {
    const response = {
      success: false,
      message: err.message,
      requestId: req.id, 
    };

    
    if (process.env.NODE_ENV === "development") {
      response.stack = err.stack;
    }
    response.requestId = req.id;
    return res.status(err.statusCode).json(response);
  }

  if (err.isJoi) {
  const rawMessage = err.details[0].message;

  const cleanMessage = rawMessage.replace(/"/g, "");

  return res.status(400).json({
    success: false,
    message: cleanMessage,
    requestId: req.id,
  });
}



  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = err.errors
      ? Object.values(err.errors).map(e => e.message)
      : ["Validation failed"];

    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  //  MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "User already registered",
    });
  }

  //  Unknown / unhandled errors
  console.error("Unexpected error:", err);

  const response = {
    success: false,
    message: "Internal Server Error",
    requestId: req.id, 
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }
  response.requestId = req.id;
  return res.status(500).json(response);
};

export default errorMiddleware;
