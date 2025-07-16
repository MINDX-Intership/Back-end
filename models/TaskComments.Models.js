import mongoose from 'mongoose';

const taskCommentSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replyComment: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskComment' } // phản hồi bình luận
});

export default mongoose.model('TaskComment', taskCommentSchema);
