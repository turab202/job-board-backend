const express = require("express");
const router = express.Router();
const Job = require("../models/JobModel");
const JobApplication = require("../models/jobApplicationModel");
const authMiddleware = require("../middleware/authMiddleware");

// Get dashboard statistics
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get active jobs count (jobs posted by the user)
    const activeJobs = await Job.countDocuments({ 
      postedBy: userId,
      status: "active" // Assuming you have a status field
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