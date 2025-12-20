import mongoose from "mongoose";
import validator from "validator";
import Joi from "joi";

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 character long"],
    validate: {
      validator: (value) => /^[A-Za-z ]+$/.test(value),
      message: "Name must contain only alphabets and spaces",
    },
    trim: true,
  },

  studentNumber: {
    type: String,
    required: [true, "Studnet Id is required"],
    match: [/^24[0-9]{5,6}$/, "Student ID must be start with 24 and be 7 or 8 digits"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "College Email is required"],
    lowercase: true,
    validate: [
      {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
      {
        validator: function (value) {
          if (!value.endsWith("@akgec.ac.in")) return false;

          const match = value.match(/(\d{7,8})@akgec\.ac\.in$/);
          if (!match) return false;

          const emailStudentNumber = match[1];

          return this.studentNumber === emailStudentNumber;
        },
        message: "Email must contain the same student number as the 'studentNumber' field (e.g., name2410084@akgec.ac.in)"
      },
    ],
    unique: true,
  },

  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: [true, "Gender is required"],
  },
  branch: {
    type: String,
    enum: [
      "CSE",
      "CSE(AIML)",
      "CSE(DS)",
      "CSE(HINDI)",
      "CS",
      "IT",
      "CSIT",
      "AIML",
      "ECE",
      "EN",
      "ME",
      "CE",
    ],
    required: [true, "Branch is required"],
  },

  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"],
    unique: true,
  },
  unstopId: {
    type: String,
    required: [true, "Unstop ID is required"],
    match: [
      /^[A-Za-z0-9_.]+$/,
      "Unstop ID can contain only letters, numbers, dot and underscore",
    ],
    trim: true,
  },
  residence: {
    type: String,
    enum: ["Hosteller", "Day Scholar"],
    required: [true, "Residence type is required"],
  },
  captchaToken: {
    type: String,
    required: true,
  }
},
  {
    timestamps: true
  }
);

registrationSchema.index({
  email: 1,
  studentNumber: 1,
  phone: 1
}, { unique: true }
);

export const Registration = mongoose.model("Registration", registrationSchema);
