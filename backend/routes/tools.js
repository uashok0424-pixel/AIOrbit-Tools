const express = require("express");
const router = express.Router();

const tools = require("../data/tools.json");

// GET all tools
router.get("/", (req, res) => {
  res.json({
    success: true,
    count: tools.length,
    data: tools,
  });
});

// GET categories
router.get("/categories", (req, res) => {
  const categories = ["All", ...new Set(tools.map((tool) => tool.category))];

  res.json({
    success: true,
    data: categories,
  });
});

// GET one tool
router.get("/:id", (req, res) => {
  const tool = tools.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: "Tool not found",
    });
  }

  res.json({
    success: true,
    data: tool,
  });
});

module.exports = router;