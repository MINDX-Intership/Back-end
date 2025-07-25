import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: String,
  content: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model('Notification', notificationSchema);
