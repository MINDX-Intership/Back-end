import Sprint from "../models/Sprints.Models.js";

// Nhân viên xem lịch làm việc cá nhân
export const getMySchedule = async (req, res) => {
  try {
    const sprints = await Sprint.find({ user: req.user.id });
    res.status(200).json(sprints);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy lịch làm việc", error: err.message });
  }
};

// Nhân viên thêm lịch làm việc
export const addSchedule = async (req, res) => {
  try {
    const newSprint = new Sprint({ ...req.body, user: req.user.id });
    const saved = await newSprint.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Dữ liệu không hợp lệ", error: err.message });
  }
};
