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
  duration: { type: Number }, // thời gian thực hiện tính bằng giờ
  docTransfer: { type: String }, // đường dẫn tài liệu đính kèm
  createdAt: { type: Date, default: Date.now }
});

const taskModel = mongoose.model('Tasks', taskSchema);
export default taskModel
