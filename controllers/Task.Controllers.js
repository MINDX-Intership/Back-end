import taskModel from "../models/Tasks.Models.js";
import sprintModel from "../models/Sprints.Models.js";
import userModel from "../models/Users.Models.js";
import mongoose from 'mongoose';

const taskController = {
    // Create a new task
    createTask: async (req, res) => {
        try {
            const { title, description, sprintId, priority = 'MEDIUM', dueDate } = req.body;

            // Validate required fields
            if (!title || !description) {
                return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin: title, description." });
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

                // Check if user owns the sprint or is admin
                if (req.account.role !== 'ADMIN' && !sprint.user.equals(userProfile._id)) {
                    return res.status(403).json({ message: "Bạn không có quyền thêm task vào sprint này." });
                }
            }

            // Create task data
            const taskData = {
                title,
                description,
                createdBy: userProfile._id, // Use user profile ID
                assignedTo: userProfile._id, // Assign to creator by default
                priority,
                status: 'PENDING'
            };

            if (sprintId) {
                taskData.sprintId = mongoose.Types.ObjectId(sprintId);
            }

            if (dueDate) {
                taskData.dueDate = new Date(dueDate);
            }

            const newTask = await taskModel.create(taskData);

            // Populate the created task
            const populatedTask = await taskModel.findById(newTask._id)
                .populate('createdBy', 'name personalEmail')
                .populate('assignedTo', 'name personalEmail')
                .populate('sprintId', 'title status');

            res.status(201).json({ 
                message: "Tạo công việc mới thành công", 
                task: populatedTask 
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
                .populate('assignedTo', 'name personalEmail') 
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
                    { assignedTo: userProfile._id }
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
                .populate('assignedTo', 'name personalEmail')
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

    // Get tasks by sprint ID
    getTasksBySprint: async (req, res) => {
        try {
            const { sprintId } = req.params;
            const { status, priority, assignedTo } = req.query;

            if (!mongoose.Types.ObjectId.isValid(sprintId)) {
                return res.status(400).json({ message: "ID sprint không hợp lệ." });
            }

            // Check if sprint exists
            const sprint = await sprintModel.findById(sprintId);
            if (!sprint) {
                return res.status(404).json({ message: "Sprint không tồn tại." });
            }

            // Find user profile for permission check
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Check permission to view sprint tasks
            if (req.account.role !== 'ADMIN' && !sprint.user.equals(userProfile._id)) {
                return res.status(403).json({ message: "Bạn không có quyền xem tasks của sprint này." });
            }

            // Build filter
            const filter = { sprintId: mongoose.Types.ObjectId(sprintId) };

            if (status) filter.status = status;
            if (priority) filter.priority = priority;
            if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
                filter.assignedTo = mongoose.Types.ObjectId(assignedTo);
            }

            const tasks = await taskModel.find(filter)
                .populate('createdBy', 'name personalEmail')
                .populate('assignedTo', 'name personalEmail')
                .populate('sprintId', 'title status startDate endDate')
                .sort({ createdAt: -1 });

            res.status(200).json({
                message: "Lấy danh sách công việc theo sprint thành công",
                sprint: {
                    _id: sprint._id,
                    title: sprint.title,
                    status: sprint.status,
                    startDate: sprint.startDate,
                    endDate: sprint.endDate
                },
                tasks,
                summary: {
                    totalTasks: tasks.length,
                    pendingTasks: tasks.filter(t => t.status === 'PENDING').length,
                    inProgressTasks: tasks.filter(t => t.status === 'IN_PROGRESS').length,
                    completedTasks: tasks.filter(t => t.status === 'COMPLETED').length
                }
            });
        } catch (err) {
            console.error('❌ Get tasks by sprint error:', err);
            res.status(500).json({ message: "Lỗi khi lấy danh sách công việc theo sprint", error: err.message });
        }
    },

    // Add task to sprint (same as create task with sprint)
    addTaskToSprint: async (req, res) => {
        try {
            const { title, description, priority = 'MEDIUM', dueDate, assignedTo } = req.body;
            const { sprintId } = req.params;

            // Validate required fields
            if (!title || !description) {
                return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin: title, description." });
            }

            if (!mongoose.Types.ObjectId.isValid(sprintId)) {
                return res.status(400).json({ message: "ID sprint không hợp lệ." });
            }

            // Find user profile
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Validate sprint
            const sprint = await sprintModel.findById(sprintId);
            if (!sprint) {
                return res.status(404).json({ message: "Sprint không tồn tại." });
            }

            // Check permission
            if (req.account.role !== 'ADMIN' && !sprint.user.equals(userProfile._id)) {
                return res.status(403).json({ message: "Bạn không có quyền thêm task vào sprint này." });
            }

            // Validate assignedTo if provided
            let assignedToUser = userProfile._id; // Default to creator
            if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
                const targetUser = await userModel.findById(assignedTo);
                if (targetUser) {
                    assignedToUser = targetUser._id;
                }
            }

            const taskData = {
                title,
                description,
                sprintId: mongoose.Types.ObjectId(sprintId),
                createdBy: userProfile._id,
                assignedTo: assignedToUser,
                priority,
                status: 'PENDING'
            };

            if (dueDate) {
                taskData.dueDate = new Date(dueDate);
            }

            const newTask = await taskModel.create(taskData);

            // Populate the created task
            const populatedTask = await taskModel.findById(newTask._id)
                .populate('createdBy', 'name personalEmail')
                .populate('assignedTo', 'name personalEmail')
                .populate('sprintId', 'title status');

            res.status(201).json({ 
                message: "Thêm công việc vào sprint thành công", 
                task: populatedTask 
            });
        } catch (err) {
            console.error('❌ Add task to sprint error:', err);
            res.status(500).json({ message: "Lỗi khi thêm công việc vào sprint", error: err.message });
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
                .populate('assignedTo', 'name personalEmail')
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
            const { title, description, status, priority, dueDate, assignedTo } = req.body;

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
                           task.assignedTo.equals(userProfile._id);

            if (!canEdit) {
                return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa task này." });
            }

            // Build update data
            const updateData = {};
            if (title) updateData.title = title;
            if (description) updateData.description = description;
            if (status) updateData.status = status;
            if (priority) updateData.priority = priority;
            if (dueDate) updateData.dueDate = new Date(dueDate);
            if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
                updateData.assignedTo = mongoose.Types.ObjectId(assignedTo);
            }

            const updatedTask = await taskModel.findByIdAndUpdate(
                taskId,
                updateData,
                { new: true, runValidators: true }
            ).populate('createdBy', 'name personalEmail')
             .populate('assignedTo', 'name personalEmail')
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

    // Submit task info (mark as in progress with submission details)
    submitTaskInfo: async (req, res) => {
        try {
            const { taskId } = req.params;
            const { submitInfo } = req.body;

            if (!mongoose.Types.ObjectId.isValid(taskId)) {
                return res.status(400).json({ message: "ID task không hợp lệ." });
            }

            const task = await taskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Không tìm thấy công việc." });
            }

            // Find user profile
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Check if user is assigned to this task
            if (!task.assignedTo.equals(userProfile._id)) {
                return res.status(403).json({ message: "Chỉ người được giao task mới có thể submit thông tin." });
            }

            // Update task
            task.status = "IN_PROGRESS";
            task.submitInfo = submitInfo;
            task.submittedAt = new Date();
            await task.save();

            const populatedTask = await taskModel.findById(taskId)
                .populate('createdBy', 'name personalEmail')
                .populate('assignedTo', 'name personalEmail')
                .populate('sprintId', 'title status');

            res.status(200).json({ 
                message: "Gửi thông tin công việc thành công", 
                task: populatedTask 
            });
        } catch (err) {
            console.error('❌ Submit task info error:', err);
            res.status(500).json({ message: "Lỗi khi gửi thông tin công việc", error: err.message });
        }
    }
}

export default taskController;