import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  departs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Depart', required: true }], // danh sách phòng ban
  jobPosition: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobPosition', required: true }], // danh sách chức vụ

  personalEmail: { type: String, unique: true, required: true },
  companyEmail: { type: String, unique: true },
  name: { type: String, required: true},
  roleTag: { type: String, enum: ['LEADER', 'MEMBER', 'ADMIN'], default: 'MEMBER', required: true }, // phân quyền người dùng
  phoneNumber: { type: String, required: true},
  dob: { type: Date, required: true },
  active: { type: Boolean, default: true }
});

const userModel = mongoose.model('Users', userSchema);
export default userModel
