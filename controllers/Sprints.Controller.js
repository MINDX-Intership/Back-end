import sprintModel from "../models/Sprints.Models.js";

const sprintController = {
    // Tạo Sprint
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

    // Lấy các Sprint đã tạo
    getSprint: async (req, res) => {
        try {
            const sprints = await sprintModel.find({ createdBy: req.user.id });
            res.status(200).json(sprints);
        } catch (err) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách sprint", error: err.message });
        }
    },

    // Xóa Sprint
    deleteSprint: async (req, res) => {
        try {
            const sprint = await sprintModel.findById(req.params.id);

            if (!sprint) {
                return res.status(404).json({ message: "Sprint không tồn tại." });
            }

            if (sprint.createdBy.toString() !== req.user.id) {
                return res.status(403).json({ message: "Bạn không có quyền xóa sprint này." });
            }

            await sprint.deleteOne();
            res.status(200).json({ message: "Xóa sprint thành công." });
        } catch (err) {
            res.status(500).json({ message: "Lỗi khi xóa sprint", error: err.message });
        }
    }
};

export default sprintController;
