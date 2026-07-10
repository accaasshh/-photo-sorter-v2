const express = require("express");
const cors = require("cors");
const path = require("path");

// Initialize Database
require("./db/database");

// Import Routes
const photoRoutes = require("./routes/photos");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use(photoRoutes);

// Home Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log("================================");
  console.log("🚀 Photo Sorter Started");
  console.log(`🌍 http://localhost:${PORT}`);
  console.log("================================");
});