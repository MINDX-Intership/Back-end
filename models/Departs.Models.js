import mongoose from 'mongoose';

const departSchema = new mongoose.Schema({
  title: { type: String, required: true },     // tên phòng ban
  code: { type: String, required: true },      // mã phòng ban
  describe: { type: String },                // mô tả phòng ban
  active: { type: Boolean, default: true }
});

export default mongoose.model('Depart', departSchema);
