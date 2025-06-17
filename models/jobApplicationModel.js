const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  applicantName: { type: String, required: true },
  email: { type: String, required: true },
  resume: { type: String },
  coverLetter: { type: String },
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("JobApplication", jobApplicationSchema);




