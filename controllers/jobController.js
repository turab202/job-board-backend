const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const newJob = new Job({ ...req.body, postedBy: req.user.id });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createJob, getJobs };
