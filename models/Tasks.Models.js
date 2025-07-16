import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  depart: { type: mongoose.Schema.Types.ObjectId, ref: 'Depart' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sprint: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' },

  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ['NOTSTARTED', 'INPROGRESS', 'SUBMITED', 'NEEDSREVIEW', 'COMPLETE', 'OVERDUE', 'ONHOLD'],
    default: 'NOTSTARTED',
    required: true
  },
  duration: Number,
  docTransfer: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', taskSchema);
