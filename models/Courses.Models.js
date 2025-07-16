// phòng ban
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  depart: { type: mongoose.Schema.Types.ObjectId, ref: 'Depart' },
  name: { type: String, required: true },
  levelNumber: { type: Number, required: true },          // mức độ đào tạo
  code: { type: String, required: true, unique: true }, // mã khóa học phải độc nhất
  describe: { type: String }, // mô tả khóa học
  active: { type: Boolean, default: true }
});

export default mongoose.model('Course', courseSchema);
