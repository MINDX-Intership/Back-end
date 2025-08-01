// import Project from '../models/Projects.Models.js';
// import Sprint from '../models/Sprints.Models.js';   
// import Task from '../models/Tasks.Models.js';
// import mongoose from 'mongoose';

// // Tham gia dự án
// export const joinProject = async (req, res) => {
//   const { projectId } = req.params;
//   const userId = req.user._id;

//   const project = await Project.findById(projectId);
//   if (!project) return res.status(404).json({ error: 'Project not found' });

//   if (project.members.includes(userId)) {
//     return res.status(400).json({ error: 'Already a member' });
//   }
//   project.members.push(userId);
//   await project.save();

//   res.json({ message: 'Joined project' });
// };

// // Theo dõi tiến độ dự án
// export const getMyProjectProgress = async (req, res) => {
//   const userId = req.user._id;

//   const projects = await Project.find({ members: userId })
//     .populate({
//       path: 'members',
//       select: 'name email'
//     });

//   const data = await Promise.all(projects.map(async proj => {
//     const sprints = await Sprint.find({ project: proj._id });
//     const tasks = await Task.find({ sprint: { $in: sprints.map(s => s._id) }, assignee: userId });
//     return {
//       project: proj,
//       totalTasks: tasks.length,
//       completedTasks: tasks.filter(t => t.status === 'done').length
//     };
//   }));

//   res.json(data);
// };

// // Gửi báo cáo tiến độ dự án
// export const sendProjectReport = async (req, res) => {
//   const { projectId } = req.params;
//   const { content } = req.body;
//   const userId = req.user._id;

//   if (!mongoose.Types.ObjectId.isValid(projectId)) {
//     return res.status(400).json({ error: 'Invalid project ID' });
//   }

//   const project = await Project.findById(projectId);
//   if (!project || !project.members.includes(userId)) {
//     return res.status(403).json({ error: 'Not a member of this project' });
//   }

//   // Ghi báo cáo vào tasks hoặc collection riêng
//   const sprint = await Sprint.findOne({ project: projectId, isActive: true });
//   if (!sprint) {
//     return res.status(404).json({ error: 'No active sprint found' });
//   }

//   const reportTask = await Task.create({
//     sprint: sprint._id,
//     title: `Report by ${req.user.name} - ${new Date().toLocaleString()}`,
//     description: content,
//     assignee: userId,
//     status: 'report'
//   });

//   res.json({ message: 'Report sent', report: reportTask });
// };

import projectModel from "../models/Projects.Models.js";
import userModel from "../models/Users.Models.js";

const projectController = {
  createProject: async (req, res) => {
    const { title, description, startDate, endDate, teamMembers } = req.body

    if (!title || !startDate || !endDate || !teamMembers) {
      return res.status(400).json({ message: 'Thiếu thông tin cần thiết để tạo dự án' });
    }

    const userProfile = await userModel.findOne({ accountId: req.account._id });
    if (!userProfile) {
      return res.status(404).json({
        message: "Không tìm thấy profile người dùng. Vui lòng tạo profile trước khi tạo dự án."
      });
    }

    try {
      const newProject = await projectModel.create({
        createdBy: userProfile._id, // Người tạo dự án
        title,
        description,
        startDate,
        endDate,
        teamMembers: teamMembers ? teamMembers.map(member => member._id) : [], // Chỉ lưu ID của người dùng
        sprintId: [], // Khởi tạo danh sách sprint rỗng
      });

      await newProject.save()

      res.status(201).json({ message: 'Dự án đã được tạo thành công', project: newProject });

      // Cập nhật danh sách dự án của các thành viên
      await userModel.updateMany(
        { _id: { $in: teamMembers } },
        { $push: { projects: newProject._id } }
      );
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo dự án', error: error.message });
    }
  },
  getAllProjects: async (req, res) => {
    try {
      const projects = await projectModel.find();
      res.status(200).json({ projects });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách dự án', error: error.message });
    }
  },
  getProjectById: async (req, res) => {
    const { projectId } = req.params;

    try {
      const project = await projectModel.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Không tìm thấy dự án' });
      }
      res.status(200).json({ project });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin dự án', error: error.message });
    }
  },
  updateProjectInfo: async (req, res) => {
    const { projectId } = req.params;
    const { title, description, startDate, endDate, teamMembers } = req.body;

    try {
      const project = await projectModel.findByIdAndUpdate(projectId, {
        title,
        description,
        startDate,
        endDate,
        teamMembers
      }, { new: true });

      if (!project) {
        return res.status(404).json({ message: 'Không tìm thấy dự án' });
      }

      res.status(200).json({ message: 'Cập nhật thông tin dự án thành công', project });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật thông tin dự án', error: error.message });
    }
  },
  addUserToProject: async (req, res) => {
    const { projectid } = req.params;
    const { userId } = req.body;

    try {
      const project = await projectModel.findById(projectid);
      if (!project) {
        return res.status(404).json({ message: 'Không tìm thấy dự án' });
      }

      if (project.teamMembers.includes(userId)) {
        return res.status(400).json({ message: 'Người dùng đã là thành viên của dự án' });
      }

      project.teamMembers.push(userId);
      await project.save();

      res.status(200).json({ message: 'Thêm người dùng vào dự án thành công', project });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi thêm người dùng vào dự án', error: error.message });
    }
  },
  addSprintToProject: async (req, res) => {
    const { projectId } = req.params;
    const { sprintId } = req.body;

    try {
      const project = await projectModel.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Không tìm thấy dự án' });
      }

      if (project.sprintId.includes(sprintId)) {
        return res.status(400).json({ message: 'Sprint đã được thêm vào dự án' });
      }

      project.sprintId.push(sprintId);
      await project.save();

      res.status(200).json({ message: 'Thêm sprint vào dự án thành công', project });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi thêm sprint vào dự án', error: error.message });
    }
  },
  getAllMembersInProject: async (req, res) => {
    const { projectId } = req.params;

    try {
      const project = await projectModel.findById(projectId).populate('teamMembers', 'name email role');
      if (!project) {
        return res.status(404).json({ message: 'Không tìm thấy dự án' });
      }

      res.status(200).json({
        message: 'Lấy danh sách thành viên dự án thành công',
        members: project.teamMembers.map(member => ({
          id: member._id,
          name: member.name,
          email: member.email,
          role: member.role
        }))
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách thành viên dự án', error: error.message });
    }
  },
  deleteProject: async (req, res) => {
    const { projectId } = req.params;
    try {
      const project = await projectModel.findByIdAndDelete(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Không tìm thấy dự án' });
      }
      res.status(200).json({ message: 'Xóa dự án thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa dự án', error: error.message });
    }
  },
  getProjectReport: async (req, res) => {
    const { projectId } = req.params;

    try {
      const project = await projectModel.findById(projectId).populate('tasksId');
      if (!project) {
        return res.status(404).json({ message: 'Không tìm thấy dự án' });
      }

      // Giả sử mỗi task có trường status để theo dõi tiến độ
      const completedTasks = project.tasksId.filter(task => task.status === 'COMPLETED').length;
      const totalTasks = project.tasksId.length;
      const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

      res.status(200).json({
        message: 'Theo dõi báo cáo dự án thành công',
        progress: `${progress.toFixed(2)}%`,
        completedTasks,
        totalTasks
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi theo dõi báo cáo dự án', error: error.message });
    }
  }
}

export default projectController;