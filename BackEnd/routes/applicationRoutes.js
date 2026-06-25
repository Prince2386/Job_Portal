import express from "express";
import { 
  applyForJob, 
  getJobApplications, 
  updateApplicationStatus,
  getMyApplications // <-- 1. Import the new function
} from "../controllers/applicationController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// 2. Add the /me route HERE (before any /:id routes)
router.get("/me", protect, getMyApplications);

router.post("/apply/:jobId", protect, upload.single("resume"), applyForJob);
router.get("/job/:jobId", protect, getJobApplications);
router.put("/:id/status", protect, updateApplicationStatus);

export default router;