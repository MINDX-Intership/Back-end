import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  depart: { type: mongoose.Schema.Types.ObjectId, ref: 'Departs' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses' },
  sprint: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprints' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }], // Danh sách người được giao công việc

  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'submitted', 'needs_review', 'complete', 'overdue', 'on_hold'],
    default: 'not_started'
  },
  submitInfo: { type: String },
  duration: { type: Number },
  docTransfer: { type: String },

  createdAt: { type: Date, default: Date.now }
});

const taskModel = mongoose.model('Tasks', taskSchema);
export default taskModel
