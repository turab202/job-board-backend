require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Create 'uploads' directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save the file in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname); // Unique filename with timestamp
    cb(null, uniqueName); // Use the unique filename
  }
});

const upload = multer({ storage: storage });

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Import Routes
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

// Use Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobApplicationRoutes);
app.use("/api/candidate", candidateRoutes);

// File Upload Route (for resume uploads or other files)
app.post("/upload", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(200).send({
    message: "File uploaded successfully!",
    file: req.file.filename // Returning the filename to store in your database
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));







