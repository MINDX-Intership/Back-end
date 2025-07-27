import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // người sở hữu sprint
  title: { type: String, required: true },            // tên công việc hoặc sprint
  description: { type: String },                      // mô tả công việc
  startDate: { type: Date, required: true },          // ngày bắt đầu
  endDate: { type: Date, required: true },            // ngày kết thúc
  status: {
    type: String,
    enum: ['Chưa bắt đầu', 'Đang làm', 'Hoàn thành'],
    default: 'Chưa bắt đầu'
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Projects' }, // liên kết dự án 
  createdAt: { type: Date, default: Date.now }
});

const sprintModel = mongoose.model('Sprints', sprintSchema);
export default sprintModel;
