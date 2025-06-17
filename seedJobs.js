// seedJobs.js

const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/book-store-mern-app", {
    serverSelectionTimeoutMS: 50000, // Increase timeout to 50 seconds
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define Job schema
const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  type: String,
  description: String,
});

const Job = mongoose.model("Job", jobSchema);

// Sample jobs
const jobs = [
  {
    title: "Frontend Developer",
    company: "Google",
    location: "Remote",
    type: "Full-time",
    description: "We are looking for a skilled frontend developer to join our team at Google.",
  },
  {
    title: "Backend Developer",
    company: "Amazon",
    location: "USA",
    type: "Part-time",
    description: "Join our backend team at Amazon and work on scalable APIs.",
  },
  {
    title: "UI/UX Designer",
    company: "Microsoft",
    location: "Canada",
    type: "Contract",
    description: "Looking for a creative UI/UX designer to create stunning designs.",
  },
  {
    title: "Graphic Designer",
    company: "Adobe",
    location: "Remote",
    type: "Full-time",
    description: "Join our creative team to design graphics for marketing, websites, and product packaging.",
  },
  {
    title: "Video Editor",
    company: "Netflix",
    location: "USA",
    type: "Part-time",
    description: "Looking for a talented video editor to work on original content for our streaming platform.",
  },
  {
    title: "Full Stack Developer",
    company: "Facebook",
    location: "Remote",
    type: "Full-time",
    description: "Join our engineering team to build scalable, robust full stack applications.",
  },
];

// Insert and print IDs
async function seedJobs() {
  try {
    const result = await Job.insertMany(jobs);
    console.log("✅ Jobs inserted successfully:");
    result.forEach((job) => {
      console.log(`🆔 ${job.title} -> ${job._id}`);
    });
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Failed to insert jobs:", error);
    mongoose.disconnect();
  }
}

seedJobs();
