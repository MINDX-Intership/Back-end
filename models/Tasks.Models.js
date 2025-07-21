import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  depart: { type: mongoose.Schema.Types.ObjectId, ref: 'Depart' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  sprint: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'submitted', 'needs_review', 'complete', 'overdue', 'on_hold'],
    default: 'not_started'
  },
  submitInfo: { type: String },
  comments: [commentSchema],
  duration: { type: Number },
  docTransfer: { type: String },

  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
