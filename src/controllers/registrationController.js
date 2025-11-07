import { Registration } from "../models/registrationModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerStudent = asyncHandler(async (req,res,next) => {

    const { name,
    studentNumber,
    email,
    gender,
    branch,
    phone,
    unstopId,
    residence } = req.body;

    if( !name || !studentNumber || !email || !gender || !branch || !phone || !unstopId || !residence){
        throw new ApiError(400 , "All fields are required");
    }

    const existing = await Registration.findOne({
        $or : [{ email }, {phone} , {studentNumber}],
    });
    if(existing){
        throw new ApiError(409,"A registration already exists with same Email, Phone or Student Number.");
    }

    const student = await Registration.create ({
        name,
        studentNumber,
        email,
        gender,
        branch,
        phone,
        unstopId,
        residence
    });

    return res
    .status(201)
    .json(new ApiResponse(201,student,"Registration Successful"))
    
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