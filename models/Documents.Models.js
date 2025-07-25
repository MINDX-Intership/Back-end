import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: String,
  content: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Document', documentSchema);
