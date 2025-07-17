const Task = require("../models/Tasks.Models");

// Nhân viên gửi thông tin task
const submitTaskInfo = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Cập nhật thông tin submit
    task.status = "in_progress";
    task.submitInfo = req.body.submitInfo;
    await task.save();

    res.status(200).json({ message: "Task submitted successfully", task });
  } catch (err) {
    res.status(500).json({ message: "Error submitting task", error: err.message });
  }
};

// Nhân viên bình luận task
const commentOnTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Thêm bình luận
    const comment = {
      userId: req.user.id,
      content: req.body.comment,
      date: new Date(),
    };

    task.comments.push(comment);
    await task.save();

    res.status(200).json({ message: "Comment added", task });
  } catch (err) {
    res.status(500).json({ message: "Error commenting on task", error: err.message });
  }
};

// Admin thêm task vào sprint
const addTaskToSprint = async (req, res) => {
  try {
    const { title, description, sprintId } = req.body;

    // Tạo task mới
    const newTask = new Task({
      title,
      description,
      sprint: sprintId,
      createdBy: req.user.id,
      status: "not_started",
    });

    await newTask.save();
    res.status(201).json({ message: "Task created", task: newTask });
  } catch (err) {
    res.status(500).json({ message: "Error adding task", error: err.message });
  }
};

module.exports = { submitTaskInfo, commentOnTask, addTaskToSprint };
