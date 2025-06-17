const express = require("express");
const JobApplication = require("../models/jobApplicationModel");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Get all applications for the logged-in candidate
router.get("/applied-jobs", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from JWT token
    
    const applications = await JobApplication.find({ userId: userId })


      .populate("jobId", "title company") // ✅ Correct field names
      .exec();
    
    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applications found" });
    }

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applications", error: err.message });
  }
});

module.exports = router;


