const express = require("express");
const router = express.Router();
const Job = require("../models/JobModel");
const JobApplication = require("../models/jobApplicationModel");
const authMiddleware = require("../middleware/authMiddleware");

// Get dashboard statistics
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all jobs posted by the user (assuming all are active if no status field)
    const activeJobs = await Job.countDocuments({ 
      postedBy: userId
    });
    
    // Get applications count for jobs posted by the user
    const jobsPostedByUser = await Job.find({ postedBy: userId });
    const jobIds = jobsPostedByUser.map(job => job._id);
    
    const applications = await JobApplication.countDocuments({ 
      jobId: { $in: jobIds } 
    });
    
    // For new messages, you'll need to implement a message system
    // For now, we'll return 0 as a placeholder
    const newMessages = 0;
    
    res.json({
      activeJobs,
      applications,
      newMessages
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ 
      message: "Error fetching dashboard statistics", 
      error: err.message 
    });
  }
});

module.exports = router;