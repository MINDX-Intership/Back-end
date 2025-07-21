import Task from "../models/Tasks.Models.js";

// Nhân viên gửi thông tin task
export const submitTaskInfo = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Không tìm thấy công việc" });

    task.status = "in_progress";
    task.submitInfo = req.body.submitInfo;
    await task.save();

    res.status(200).json({ message: "Gửi thông tin công việc thành công", task });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi gửi thông tin công việc", error: err.message });
  }
};

// Nhân viên bình luận task
export const commentOnTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Không tìm thấy công việc" });

    const comment = {
      userId: req.user.id,
      content: req.body.comment,
      date: new Date(),
    };

    task.comments.push(comment);
    await task.save();

    res.status(200).json({ message: "Đã thêm bình luận", task });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi bình luận công việc", error: err.message });
  }
};

// Admin thêm task vào sprint
export const addTaskToSprint = async (req, res) => {
  try {
    const { title, description, sprintId } = req.body;

    const newTask = new Task({
      title,
      description,
      sprint: sprintId,
      createdBy: req.user.id,
      status: "not_started",
    });

    await newTask.save();
    res.status(201).json({ message: "Tạo công việc mới thành công", task: newTask });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo công việc", error: err.message });
  }
};

// Nhân viên xem các task đã được assign
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách công việc", error: err.message });
  }
};
