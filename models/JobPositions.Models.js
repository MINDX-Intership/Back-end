import mongoose from 'mongoose';

const jobPositionSchema = new mongoose.Schema({
  title: { type: String, required: true },    // tên chức vụ
  code: { type: String, required: true, unique: true },     // mã chức vụ
  describe: { type: String },
  active: { type: Boolean, default: true }
});

const jobPositionModel = mongoose.model('JobPosition', jobPositionSchema);
export default jobPositionModel
