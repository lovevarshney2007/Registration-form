import { Registration } from "../models/registrationModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {registrationValidation } from "../validations/registrationValidation.js";

const registerStudent = asyncHandler(async (req,res,next) => {

   try {

     const  value  = await registrationValidation.validateAsync(req.body,{
        abortEarly: true,
     });
 
     const student = await Registration.create(value);
 
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