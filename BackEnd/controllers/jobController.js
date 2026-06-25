import Job from "../models/Job.js";

// @desc    Create a new job listing
// @route   POST /api/jobs
// @access  Private (Recruiter only)
export const createJob = async (req, res) => {
  try {
    const { title, company, description, requirements, location, salary, jobType } = req.body;

    // Validation
    if (!title || !company || !description || !requirements || !location || !salary) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    // Create job and link it to the logged-in recruiter (Fallback added for temporary testing)
    const job = await Job.create({
      title,
      company,
      description,
      requirements: Array.isArray(requirements) ? requirements : requirements.split(",").map(req => req.trim()),
      location,
      salary,
      jobType,
      createdBy: req.user?._id || "65f1a2b3c4d5e6f7a8b9c0d1", // Safe fallback for public route testing
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not create job",
      error: error.message,
    });
  }
};

// @desc    Get all job listings
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req, res) => {
  try {
    // Fetch jobs and optionally populate recruiter details (excluding password)
    const jobs = await Job.find().populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch jobs",
      error: error.message,
    });
  }
};




// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("createdBy", "name email");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Update a job listing
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if the logged-in user is the actual creator of this job
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "User not authorized to update this job" });
    }

    // Update the job
    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures the new data meets your schema rules
    });

    res.status(200).json({ success: true, message: "Job updated", job });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// @desc    Delete a job listing
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if the logged-in user is the actual creator of this job
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "User not authorized to delete this job" });
    }

    await job.deleteOne();

    res.status(200).json({ success: true, message: "Job removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


// Get jobs created by the logged-in recruiter
export const getMyJobs = async (req, res) => {
  try {
    // req.user._id comes from your 'protect' middleware!
    // We sort by createdAt: -1 to show the newest jobs first.
    const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error("Error in getMyJobs:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch your jobs" 
    });
  }
};