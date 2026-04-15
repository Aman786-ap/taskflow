const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

// CREATE TASK
router.post("/", auth, async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      userId: req.user._id
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET TASKS
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user._id
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE TASK
router.delete("/:id", auth, async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;