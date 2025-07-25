import taskModel from "../models/Tasks.Models.js";
import taskCommentModel from "../models/TaskComments.Models.js";

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
    getAllTasks: async (req, res) => {
        try {
            const tasks = await taskModel.find().populate('sprint', 'title').populate('createdBy', 'email');
            res.status(200).json(tasks);
        } catch (err) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách công việc", error: err.message });
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
    submitTaskInfo: async (req, res) => {
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
    },
    commentOnTask: async (req, res) => {
        try {
            const task = await taskModel.findById(req.params.taskId);
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
    }
}

export default taskController;