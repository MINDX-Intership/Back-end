const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  isStaffOrAdmin,
} = require("../middlewares/Auth.Middlewares");

const {
  addTaskToSprint,
  submitTaskInfo,
  commentOnTask,
  getMyTasks,
} = require("../controllers/Task.Controllers");

// Gửi thông tin task
router.post("/task/:taskId/submit", authenticateToken, isStaffOrAdmin, submitTaskInfo);

// Bình luận task
router.post("/task/:taskId/comment", authenticateToken, isStaffOrAdmin, commentOnTask);

// Thêm task mới
router.post("/task", authenticateToken, isStaffOrAdmin, addTaskToSprint);

// Lấy task của người dùng
router.get("/tasks/mine", authenticateToken, isStaffOrAdmin, getMyTasks);

module.exports = router;
