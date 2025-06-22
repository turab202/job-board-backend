const express = require("express");
const mongoose = require("mongoose"); // Need to import mongoose for ID validation
const Job = require("../models/JobModel");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// Get jobs posted by the logged-in employer
router.get("/employer", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching employer jobs:", err);
    res.status(500).json({ 
      message: "Error fetching employer jobs",
      error: err.message 
    });
  }
});

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ 
      message: "Error fetching jobs",
      error: err.message 
    });
  }
});

// Get job by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid job ID format" });
    }
    
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({ 
      message: "Error fetching job",
      error: err.message 
    });
  }
});

// Create new job
router.post("/add", authMiddleware, async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['title', 'company', 'location', 'description', 'salary', 'type'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: "Missing required fields",
        missingFields
      });
    }

    const job = new Job({
      ...req.body,
      postedBy: req.user._id
    });
    
    await job.save();
    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    console.error("Error posting job:", err);
    res.status(500).json({ 
      message: "Error posting job",
      error: err.message,
      validationErrors: err.errors // Mongoose validation errors if any
    });
  }
});

// Update job by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job ID format" });
    }

    // Verify all required fields exist
    const requiredFields = ['title', 'company', 'location', 'description', 'salary', 'type'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: "Missing required fields",
        missingFields
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      req.body,
      { 
        new: true,
        runValidators: true // This ensures schema validation
      }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(updatedJob);
  } catch (err) {
    console.error('Error updating job:', {
      error: err.message,
      stack: err.stack,
      body: req.body
    });
    
    res.status(500).json({ 
      message: "Error updating job",
      detailedError: err.message,
      validationErrors: err.errors // Mongoose validation errors if any
    });
  }
});

module.exports = router;