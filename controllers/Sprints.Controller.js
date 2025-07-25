import sprintModel from "../models/Sprints.Models.js";

const sprintController = {
    createSprint: async (req, res) => {
        const { title, describe, startDate, endDate } = req.body;

        if (!title || !startDate || !endDate) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
        }

        try {
            const newSprint = new sprintModel({
                createdBy: req.user.id,
                title,
                describe,
                startDate,
                endDate
            });

            await newSprint.save();
            res.status(201).json({ message: "Tạo sprint thành công", sprint: newSprint });
        } catch (err) {
            res.status(500).json({ message: "Lỗi khi tạo sprint", error: err.message });
        }
    },
    getSprint: async (req, res) => {
        try {
            const sprints = await sprintModel.find({ createdBy: req.user.id });
            res.status(200).json(sprints);
        } catch (err) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách sprint", error: err.message });
        }
    },
    completeSprint: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Vui lòng cung cấp ID của sprint." });
        }

        try {
            const sprint = await sprintModel.findById(id);
            if (!sprint) {
                return res.status(404).json({ message: "Sprint không tồn tại." });
            }

            sprint.isCompleted = true;
            await sprint.save();
            res.status(200).json({ message: "Hoàn thành sprint thành công.", sprint });
        } catch (err) {
            res.status(500).json({ message: "Lỗi khi hoàn thành sprint", error: err.message });
        }
    },
    deleteSprint: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Vui lòng cung cấp ID của sprint." });
        }

        try {
            const sprint = await sprintModel.findById(id);
            if (!sprint) {
                return res.status(404).json({ message: "Sprint không tồn tại." });
            }

            await sprintModel.findByIdAndDelete(id);
            res.status(200).json({ message: "Xóa sprint thành công." });
        } catch (err) {
            res.status(500).json({ message: "Lỗi khi xóa sprint", error: err.message });
        }
    }
}

export default sprintController;