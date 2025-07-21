import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  describe: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const sprintModel = mongoose.model('Sprint', sprintSchema);
export default sprintModel;
