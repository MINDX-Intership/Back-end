import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  departs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Depart' }], // danh sách phòng ban
  jobPosition: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobPosition' }], // danh sách chức vụ

  personalEmail: String,
  companyEmail: String,
  name: String,
  roleTag: { type: String, enum: ['LEADER', 'MEMBER', 'ADMIN'] },
  phoneNumber: String,
  dob: Date,
  active: { type: Boolean, default: true }
});

export default mongoose.model('User', userSchema);
