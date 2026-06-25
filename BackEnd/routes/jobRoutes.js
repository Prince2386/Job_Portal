import express from "express";
import { 
  createJob, 
  getAllJobs, 
  getJobById, 
  updateJob, 
  deleteJob,
  getMyJobs // <-- 1. We import the new function here
} from "../controllers/jobController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Base route: /api/jobs
router.route("/")
  .get(getAllJobs)
  .post(protect, createJob); 

// CRITICAL: The /me route MUST go above /:id, otherwise Express thinks "me" is an ID!
router.get("/me", protect, getMyJobs); // <-- 2. Added the new route

// ID route: /api/jobs/:id
router.route("/:id")
  .get(getJobById)              
  .put(protect, updateJob)      
  .delete(protect, deleteJob);  

export default router;