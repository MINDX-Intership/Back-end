import taskModel from "../models/Tasks.Models";
import { addTaskToSprint } from "./Task.Controllers";

const taskController = {
    createTask: async (req, res) => {
        const { title, description, sprintId } = req.body;

        if (!title || !description || !sprintId) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
        }

        try {
            const newTask = new taskModel({
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
    },
    getTasks: async (req, res) => {
        try {
            const tasks = await taskModel.find({ createdBy: req.user.id });
            res.status(200).json(tasks);
        } catch (err) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách công việc", error: err.message });
        }
    },
    addTaskToSprint: async (req, res) => {
        try {
            const { title, description, sprintId } = req.body;

            const newTask = new taskModel({
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
    },
    
}

export default taskController;