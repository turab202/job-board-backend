const express = require("express");
const Job = require("../models/JobModel");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware"); // ✅ Make sure it's at the top if not already

// ✅ Get jobs posted by the logged-in employer
router.get("/employer", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employer jobs" });
  }
});


// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// Get job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job" });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.user._id, // 👈 Link to logged-in employer
    });
    await job.save();
    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Error posting job" });
  }
});

module.exports = router;










