const express = require("express");
const multer = require("multer");
const path = require("path");
const Job = require("../models/JobModel");
const JobApplication = require("../models/jobApplicationModel");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Multer config for resume uploads
// In your jobApplicationRoutes.js
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST: Apply to a job
router.post("/:jobId/apply", authMiddleware, upload.single("resume"), async (req, res) => {
  try {
    const { name, email, coverLetter } = req.body;
    const { jobId } = req.params;
    const resumePath = req.file ? req.file.path : null;

    if (!name || !email || !resumePath) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const application = new JobApplication({
      jobId,
      userId: req.user._id, // ✅ Correct user ID from decoded token
      applicantName: name,
      email,
      resume: resumePath,
      coverLetter,
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error("Error submitting application:", err);
    res.status(500).json({ message: "Error submitting application", error: err.message });
  }
});

// GET: View applied jobs by user
router.get("/applied-jobs", authMiddleware, async (req, res) => {
  try {
    const applications = await JobApplication.find({ userId: req.user._id })
      .populate("jobId", "title company")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ message: "Error fetching applications", error: err.message });
  }
});
// GET: Get all applications for jobs posted by the logged-in employer
router.get("/employer/applications", authMiddleware, async (req, res) => {
  try {
    const employerId = req.user._id;

    // Step 1: Find all jobs posted by this employer
    const jobs = await Job.find({ postedBy: employerId });
    const jobIds = jobs.map((job) => job._id);

    // Step 2: Find applications for these jobs
    const applications = await JobApplication.find({ jobId: { $in: jobIds } })
      .populate("jobId", "title")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Error fetching employer applications:", err);
    res.status(500).json({ message: "Error fetching employer applications", error: err.message });
  }
});


module.exports = router;







