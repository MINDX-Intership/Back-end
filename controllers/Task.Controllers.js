import taskModel from "../models/Tasks.Models.js";
import sprintModel from "../models/Sprints.Models.js";
import userModel from "../models/Users.Models.js";
import mongoose from 'mongoose';

const taskController = {
    // Create a new task
    createTask: async (req, res) => {
        try {
            const { departId, sprintId, title, description, priority, assignees, duration } = req.body;

            // Validate required fields
            if (!departId || !title) {
                return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin: departId, title." });
            }

            // Find user profile from account
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Validate sprint if provided
            if (sprintId) {
                if (!mongoose.Types.ObjectId.isValid(sprintId)) {
                    return res.status(400).json({ message: "ID sprint không hợp lệ." });
                }

                const sprint = await sprintModel.findById(sprintId);
                if (!sprint) {
                    return res.status(404).json({ message: "Sprint không tồn tại." });
                }
            }

            // Create task data
            const newTasks = await taskModel.create({
                departId,
                sprintId,
                title,
                description,
                priority: priority || 'MEDIUM', // Default to Medium if not provided
                duration: duration || 0, // Default to 0 if not provided
                assignees: assignees || userProfile._id, // Default to current user if no assignees,
                status: 'NOTSTARTED', // Default status
                createdBy: userProfile._id, // Set creator as current user
            });

            await newTasks.save();

            res.status(201).json({
                message: "Tạo công việc mới thành công",
                task: newTasks
            });
        } catch (err) {
            console.error('❌ Create task error:', err);
            res.status(500).json({ message: "Lỗi khi tạo công việc", error: err.message });
        }
    },

    // Get all tasks (Admin only)
    getAllTasks: async (req, res) => {
        try {
            const { page = 1, limit = 10, sprintId, status, priority, search } = req.query;

            // Build filter
            const filter = {};

            if (sprintId && mongoose.Types.ObjectId.isValid(sprintId)) {
                filter.sprintId = mongoose.Types.ObjectId(sprintId);
            }

            if (status) {
                filter.status = status;
            }

            if (priority) {
                filter.priority = priority;
            }

            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            const tasks = await taskModel.find(filter)
                .populate('createdBy', 'name personalEmail')
                .populate('assignees', 'name personalEmail') 
                .populate('sprintId', 'title status startDate endDate')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const total = await taskModel.countDocuments(filter);

            res.status(200).json({
                message: "Lấy danh sách công việc thành công",
                tasks,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (err) {
            console.error('❌ Get all tasks error:', err);
            res.status(500).json({ message: "Lỗi khi lấy danh sách công việc", error: err.message });
        }
    },

    // Get tasks for current user
    getMyTasks: async (req, res) => {
        try {
            const { page = 1, limit = 10, sprintId, status, priority } = req.query;

            // Find user profile
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Build filter for user's tasks
            const filter = {
                $or: [
                    { createdBy: userProfile._id },
                    { assignees: userProfile._id }
                ]
            };

            if (sprintId && mongoose.Types.ObjectId.isValid(sprintId)) {
                filter.sprintId = mongoose.Types.ObjectId(sprintId);
            }

            if (status) {
                filter.status = status;
            }

            if (priority) {
                filter.priority = priority;
            }

            const tasks = await taskModel.find(filter)
                .populate('createdBy', 'name personalEmail')
                .populate('assignees', 'name personalEmail')
                .populate('sprintId', 'title status startDate endDate')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const total = await taskModel.countDocuments(filter);

            res.status(200).json({
                message: "Lấy danh sách công việc cá nhân thành công",
                tasks,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (err) {
            console.error('❌ Get my tasks error:', err);
            res.status(500).json({ message: "Lỗi khi lấy danh sách công việc", error: err.message });
        }
    },

    // Get task by ID
    getTaskById: async (req, res) => {
        try {
            const { taskId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(taskId)) {
                return res.status(400).json({ message: "ID task không hợp lệ." });
            }

            const task = await taskModel.findById(taskId)
                .populate('createdBy', 'name personalEmail')
                .populate('assignees', 'name personalEmail')
                .populate('sprintId', 'title status startDate endDate');

            if (!task) {
                return res.status(404).json({ message: "Không tìm thấy công việc." });
            }

            // Find user profile for permission check
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Check permission
            const canView = req.account.role === 'ADMIN' || 
                           task.createdBy._id.equals(userProfile._id) ||
                           task.assignedTo._id.equals(userProfile._id);

            if (!canView) {
                return res.status(403).json({ message: "Bạn không có quyền xem task này." });
            }

            res.status(200).json({
                message: "Lấy thông tin công việc thành công",
                task
            });
        } catch (err) {
            console.error('❌ Get task by ID error:', err);
            res.status(500).json({ message: "Lỗi khi lấy thông tin công việc", error: err.message });
        }
    },

    // Update task
    updateTask: async (req, res) => {
        try {
            const { taskId } = req.params;
            const { title, description, status, priority, duration, assignees } = req.body;

            if (!mongoose.Types.ObjectId.isValid(taskId)) {
                return res.status(400).json({ message: "ID task không hợp lệ." });
            }

            const task = await taskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Không tìm thấy công việc." });
            }

            // Find user profile for permission check
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Check permission
            const canEdit = req.account.role === 'ADMIN' || 
                           task.createdBy.equals(userProfile._id) ||
                           task.assignees.equals(userProfile._id);

            if (!canEdit) {
                return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa task này." });
            }

            // Build update data
            const updateData = {};
            if (title) updateData.title = title;
            if (description) updateData.description = description;
            if (status) updateData.status = status;
            if (priority) updateData.priority = priority;
            if (duration) updateData.duration = new Date(duration);
            if (assignees && mongoose.Types.ObjectId.isValid(assignees)) {
                updateData.assignees = mongoose.Types.ObjectId(assignees);
            }

            const updatedTask = await taskModel.findByIdAndUpdate(
                taskId,
                updateData,
                { new: true, runValidators: true }
            ).populate('createdBy', 'name personalEmail')
             .populate('assignees', 'name personalEmail')
             .populate('sprintId', 'title status');

            res.status(200).json({ 
                message: "Cập nhật công việc thành công", 
                task: updatedTask 
            });
        } catch (err) {
            console.error('❌ Update task error:', err);
            res.status(500).json({ message: "Lỗi khi cập nhật công việc", error: err.message });
        }
    },

    // Delete task
    deleteTask: async (req, res) => {
        try {
            const { taskId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(taskId)) {
                return res.status(400).json({ message: "ID task không hợp lệ." });
            }

            const task = await taskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Không tìm thấy công việc." });
            }

            // Find user profile for permission check
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Check permission (only creator or admin can delete)
            const canDelete = req.account.role === 'ADMIN' || task.createdBy.equals(userProfile._id);

            if (!canDelete) {
                return res.status(403).json({ message: "Bạn không có quyền xóa task này." });
            }

            await taskModel.findByIdAndDelete(taskId);

            res.status(200).json({ 
                message: "Xóa công việc thành công",
                deletedTask: {
                    id: task._id,
                    title: task.title
                }
            });
        } catch (err) {
            console.error('❌ Delete task error:', err);
            res.status(500).json({ message: "Lỗi khi xóa công việc", error: err.message });
        }
    },
    submitTask: async (req, res) => {
        const taskId = req.params.taskId;
        const { documentTransfer } = req.body;

        const task = await taskModel.findById(taskId);

        if (!task) {
            return res.status(400).json({ message: "ID task không hợp lệ." });
        }
    }
}

export default taskController;