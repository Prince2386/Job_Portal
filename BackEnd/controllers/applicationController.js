import { imagekit } from "../config/imageKitConfig.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Candidate)
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body; // resumeLink is no longer coming from body

    // 1. Ensure the user actually uploaded a file via Multer
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload your resume (PDF/DOC)" });
    }

    // 2. Check if the job actually exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // 3. Check if the user has already applied for this exact job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: "You have already applied for this job" });
    }

    // 4. Upload the file buffer to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer, // The file data stored in memory by Multer
      fileName: req.file.originalname,
      folder: "/job_portal_resumes",
    });

    // Extract the secure URL from ImageKit
    const resumeLink = uploadResponse.url;

    // 5. Create the application
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resumeLink, // Save the ImageKit URL to the database
      coverLetter,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Get all applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter who created the job)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1. Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // 2. Security Check: Only the recruiter who made the job can see its applications
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized to view these applications" });
    }

    // 3. Fetch applications and pull in the candidate's name and email
    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    // 1. Find the application and populate the job so we can check who created it
    const application = await Application.findById(applicationId).populate("job");
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // 2. Security Check: Only the recruiter who created the job can update the status
    if (application.job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized to update this status" });
    }

    // 3. Update and save
    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};





// Get applications for the logged-in candidate
export const getMyApplications = async (req, res) => {
  try {
    // Find applications matching the user's ID
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location") // Grabs job details for the frontend table
      .sort({ createdAt: -1 }); // Newest applications first

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load your applications",
    });
  }
};