import Project from '../models/Projects.Models.js';
import Sprint from '../models/Sprints.Models.js';   
import Task from '../models/Tasks.Models.js';
import mongoose from 'mongoose';

// Tham gia dự án
export const joinProject = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  if (project.members.includes(userId)) {
    return res.status(400).json({ error: 'Already a member' });
  }
  project.members.push(userId);
  await project.save();

  res.json({ message: 'Joined project' });
};

// Theo dõi tiến độ dự án
export const getMyProjectProgress = async (req, res) => {
  const userId = req.user._id;

  const projects = await Project.find({ members: userId })
    .populate({
      path: 'members',
      select: 'name email'
    });

  const data = await Promise.all(projects.map(async proj => {
    const sprints = await Sprint.find({ project: proj._id });
    const tasks = await Task.find({ sprint: { $in: sprints.map(s => s._id) }, assignee: userId });
    return {
      project: proj,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'done').length
    };
  }));

  res.json(data);
};

// Gửi báo cáo tiến độ dự án
export const sendProjectReport = async (req, res) => {
  const { projectId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  const project = await Project.findById(projectId);
  if (!project || !project.members.includes(userId)) {
    return res.status(403).json({ error: 'Not a member of this project' });
  }

  // Ghi báo cáo vào tasks hoặc collection riêng
  const sprint = await Sprint.findOne({ project: projectId, isActive: true });
  if (!sprint) {
    return res.status(404).json({ error: 'No active sprint found' });
  }

  const reportTask = await Task.create({
    sprint: sprint._id,
    title: `Report by ${req.user.name} - ${new Date().toLocaleString()}`,
    description: content,
    assignee: userId,
    status: 'report'
  });

  res.json({ message: 'Report sent', report: reportTask });
};
