import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },        // email tài khoản
  password: { type: String, required: true },                   // mật khẩu đã mã hóa
  role: { type: String, enum: ['ADMIN', 'STAFF'], default: 'STAFF' }, // vai trò
  active: { type: Boolean, default: true },                     // trạng thái hoạt động
  isVerified: { type: Boolean, default: false }                 //  xác thực email
});

const accountModel = mongoose.model('Accounts', accountSchema);
export default accountModel
