import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxLength: [100, "Job title cannot exceed 100 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    requirements: {
      type: [String], // Array of strings (e.g., ["Node.js", "React", "2+ years experience"])
      required: [true, "Job requirements are required"],
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
    },
    salary: {
      type: String, // String type allows formats like "₹50,000 - ₹70,000" or "Negotiable"
      required: [true, "Salary information is required"],
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
      default: "Full-time",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links the job to the Recruiter who created it
      required: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;