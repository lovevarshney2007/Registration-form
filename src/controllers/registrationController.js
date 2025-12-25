import { Registration } from "../models/registrationModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { registrationValidation } from "../validations/registrationValidation.js";
import { sendRegisterationEmail } from "../utils/emailService.js";
import axios from "axios";




const registerStudent = asyncHandler(async (req, res) => {

  const { captchaToken } = req.body;

  // captcha Bypass
  const isDev = process.env.NODE_ENV === "development";
  const bypassCaptcha =
    isDev && process.env.RECAPTCHA_BYPASS === "true";

  if (
    process.env.NODE_ENV === "production" &&
    process.env.RECAPTCHA_BYPASS === "true"
  ) {
    throw new Error("SECURITY ERROR: CAPTCHA bypass enabled in production");
  }



  if (!bypassCaptcha && !captchaToken) {
    throw new ApiError(400, "captchaToken  is required");
  }

  if (!bypassCaptcha) {
    // const params = new URLSearchParams();
    // params.append("secret", process.env.RECAPTCHA_SECRET_KEY);
    // params.append("response", captchaToken);

    // POST request to Google reCAPTCHA verification API
    const { data } = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
    new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: captchaToken,
    }).toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 5000,
    }
  );
  
   if (process.env.NODE_ENV === "development") {
  console.log("reCAPTCHA response:", data);
}

    if (!data.success) {
      const errorCode = data["error-codes"]?.[0] || "unknown";

      if (errorCode === "timeout-or-duplicate") {
        throw new ApiError(400, "Captcha expired or already used.");
      }
      if (errorCode === "invalid-input-response") {
        throw new ApiError(400, "Invalid reCAPTCHA token.");
      }

      throw new ApiError(400, "Captcha verification failed.");
    }
  } else if (isDev) {
    console.log("reCAPTCHA bypassed (development mode)");
  }



  // validation
  const value = await registrationValidation.validateAsync(req.body, {
  abortEarly: true,
  stripUnknown: true,
});

const student = await Registration.create(value);

await sendRegisterationEmail(student.email, student.name);

return res
  .status(201)
  .json(new ApiResponse(201, student, "Registration Successful", req.id))


})

const getAllRegistrations = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    branch,
    gender,
    residence
  } = req.query;

  const safePage = Math.max(parseInt(page) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { studentNumber: { $regex: search, $options: "i" } },
    ];
  }

  if (branch) query.branch = branch;
  if (gender) query.gender = gender;
  if (residence) query.residence = residence;

  const skip = (safePage - 1) * safeLimit;

  const [students, total] = await Promise.all([
    Registration.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),
    Registration.countDocuments(query),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { total, page: safePage, limit: safeLimit, students }, "Registrations fetched successfully", req.id));

})

export {
  registerStudent,
  getAllRegistrations
}