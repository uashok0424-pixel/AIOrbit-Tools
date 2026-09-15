const express = require("express");
const cors = require("cors");

const toolsRouter = require("./routes/tools");

const app = express();

// Render provides the PORT through an environment variable.
// 5000 is used when running locally.
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Orbit Tools API is running",
  });
});

// Tools API
app.use("/api/tools", toolsRouter);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`AI Orbit API running on port ${PORT}`);
});