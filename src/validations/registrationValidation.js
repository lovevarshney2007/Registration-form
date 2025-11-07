import Joi from "joi";
import { Registration } from "../models/registrationModel.js";

const registrationValidation = Joi.object({
    name: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[A-Za-z ]+$/)
    .required()
    .messages({
        "string.empty": "Name is required",
        "string.pattern.base": "Name must contain only alphabets and spaces"
    }),

    studentNumber: Joi.string()
    .pattern(/^24[0-9]{5,6}$/)
    .required()
    .messages({
        "string.pattern.base": "Student ID must start with 24 and be 7–8 digits",
    }),

    email: Joi.string()
    .email()
    .pattern(/@akgec\.ac\.in$/)
    .required()
    .external(async (value) => {
      const existing = await Registration.findOne({ email: value });
      if (existing) {
        throw new Error("This email is already registered!");
      }
    })
    .messages({
      "string.email": "Invalid email format",
      "string.pattern.base": "Use your official college email ID (@akgec.ac.in)",
    }),

    gender: Joi.string()
    .valid("Male","Female")
    .required()
    .messages({
        "any.only": "Gender must be either Male or Female",
    }),

    branch: Joi.string()
    .valid(
      "CSE",
      "CSE(AIML)",
      "CSE(DS)",
      "CS(HINDI)",
      "CS",
      "IT",
      "CSIT",
      "AIML",
      "ECE",
      "EN",
      "ME",
      "CE"
    )
    .required()
    .messages({
        "any.only": "Invalid branch selection",
    }),

    phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
     .external(async (value) => {
      const existing = await Registration.findOne({ phone: value });
      if (existing) {
        throw new Error("This phone number is already registered!");
      }
    })
    .messages({
        "string.pattern.base":"Enter a valid 10-digit Mobile number",
    }),


    unstopId: Joi.string()
    .pattern(/^[A-Za-z0-9_.]+$/)
    .required()
     .external(async (value) => {
      const existing = await Registration.findOne({ unstopId: value });
      if (existing) {
        throw new Error("This unstopId is already registered!");
      }
    })
    .messages({
      "string.pattern.base":
        "Unstop ID can contain only letters, numbers, dot and underscore",
    }),
    residence: Joi.string()
    .valid("Hosteller", "Day Scholar")
    .required()
    .messages({
      "any.only": "Residence must be either Hosteller or Day Scholar",
    }),

})

export {
    registrationValidation
}