import { ApiError } from "../utils/ApiError.js";

const adminAuth = (req,res,next) => {
    const adminKey = req.headers["x-admin-key"];

    if(!adminKey){
        return res.status(401).json({
      success: false,
      message: "Unauthorized access",
      requestId: req.id,  
    });
    }

     if (adminKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
      requestId: req.id,  
    });
  }
   next();
}

export default adminAuth;