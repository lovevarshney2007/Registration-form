import { Registration } from "../models/registrationModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {registrationValidation } from "../validations/registrationValidation.js";
import { sendRegisterationEmail } from "../utils/emailService.js";
import axios from "axios";


const registerStudent = asyncHandler(async (req,res,next) => {

   try {

    const { captchaToken } = req.body;

    const bypassCaptcha =
      process.env.NODE_ENV === "development" ||
      process.env.RECAPTCHA_BYPASS === "true";

    if(!captchaToken && !bypassCaptcha){
        throw new ApiError(400,"captchaToken  is required");
    }

    if(bypassCaptcha){
       console.log("⚠️ reCAPTCHA verification bypassed (development or RECAPTCHA_BYPASS=true)");
    }
    else{
      const params = new URLSearchParams();
      params.append("secret", process.env.RECAPTCHA_SECRET_KEY);
      params.append("response", captchaToken);

      // POST request to Google reCAPTCHA verification API
      const { data } = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        params.toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      console.log("🔍 reCAPTCHA verification data:", data);
       if (!data.success) {
        const errorCode = data["error-codes"] ? data["error-codes"][0] : "unknown";
        if (errorCode === "timeout-or-duplicate") {
          throw new ApiError(400, "Captcha expired or already used. Please refresh and try again.");
        } else if (errorCode === "invalid-input-response") {
          throw new ApiError(400, "Invalid reCAPTCHA token. Please solve again.");
        } else {
          throw new ApiError(400, `Captcha verification failed (${errorCode}).`);
        }
      }
    }

    // const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`

  //   const { data } = await axios.post(verifyURL);
  //     console.log("🔍 reCAPTCHA verification data:", data);

    
  //   if (!data.success) {
  //     const errorCode =  data['error-codes'] ? data['error-codes'][0] : 'unknown';
  //      if (errorCode === 'timeout-or-duplicate') {
  //   throw new ApiError(400, "Captcha expired or already used. Please refresh and try again.");
  // } else {
  //   throw new ApiError(400, `Captcha verification failed (${errorCode}).`);
  // }

  //   }

     const  value  = await registrationValidation.validateAsync(req.body,{
        abortEarly: true,
     });
 
     const student = await Registration.create(value);

     await sendRegisterationEmail(student.email, student.name);
 
     return res
     .status(201)
     .json(new ApiResponse(201,student,"Registration Successful"))
   } catch (error) {
    if(error.isJoi || error.message.includes("registered")){
        const message = error.details && error.details.length > 0
        ? error.details[0].message
        : error.message;

        return res.status(400).json({
           success: false,
           message,
        });
    }

    next (error);
   }
    
})

const getAllRegistrations = asyncHandler(async (req,res,next) => {
    const { page = 1 , limit = 10, search = "", branch,gender,residence} = req.query;

     const query = {};

     if(search){
        query.$or = [
            { name: { $regex: search,$options: "i"}},
            { email: { $regex: search, $options: "i" } },
      { studentNumber: { $regex: search, $options: "i" } },
        ];
     }

     if (branch) query.branch = branch;
  if (gender) query.gender = gender;
  if (residence) query.residence = residence;

    const skip = (page - 1) * limit;

     const [students, total] = await Promise.all([
    Registration.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Registration.countDocuments(query),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { total, page: parseInt(page), limit: parseInt(limit), students }, "Registrations fetched successfully"));

})

export {
    registerStudent,
    getAllRegistrations 
}