const express = require("express");
const router = express.Router();
const { authenticateToken, isStaffOrAdmin } = require("../middlewares/Auth.Middlewares");

const { getMySchedule, addSchedule } = require("../controllers/Sprints.Controllers");

// Nhân viên xem lịch làm việc cá nhân
router.get("/sprints/mine", authenticateToken, isStaffOrAdmin, getMySchedule);

// Nhân viên thêm lịch làm việc
router.post("/sprints", authenticateToken, isStaffOrAdmin, addSchedule);

module.exports = router;
