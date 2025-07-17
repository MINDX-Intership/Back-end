const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  isStaffOrAdmin,
} = require("../middlewares/Auth.Middlewares");
s
const {
  addTaskToSprint,
  submitTaskInfo,
  commentOnTask,
} = require("../controllers/Task.Controllers");

// Submit task đã được assign
router.post("/task/:taskId/submit", authenticateToken, isStaffOrAdmin, submitTaskInfo);

// Comment task đã được assign
router.post("/task/:taskId/comment", authenticateToken, isStaffOrAdmin, commentOnTask);

// Thêm task vào sprint
router.post("/task", authenticateToken, isStaffOrAdmin, addTaskToSprint);

module.exports = router;
