// import jwt from 'jsonwebtoken';
// import Account from '../models/Accounts.Models.js';
// import { sendVerificationEmail } from '../utils/sendEmail.js';

// export const register = async (req, res) => {
//   const { email, password, role } = req.body;

//   try {
//     const newAccount = await Account.create({
//       email,
//       password,
//       role,
//       active: true,
//       isVerified: false
//     });

//     const token = jwt.sign(
//       { accountId: newAccount._id },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRE }
//     );

//     const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
//     const html = `<h3>Xác thực tài khoản</h3><a href="${link}">${link}</a>`;

//     await sendVerificationEmail(email, 'Xác thực tài khoản', html);

//     res.status(201).json({ message: 'Vui lòng kiểm tra email để xác thực.' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const account = await Account.findById(decoded.accountId);

//     if (!account) return res.status(404).json({ error: 'Không tìm thấy tài khoản.' });
//     if (account.isVerified) return res.json({ message: 'Tài khoản đã được xác thực.' });

//     account.isVerified = true;
//     await account.save();

//     res.json({ message: 'Xác thực thành công!' });
//   } catch (err) {
//     res.status(400).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
//   }
// };


import AccountsModels from "../models/Accounts.Models.js"

const accountController = {
  register: async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu không khớp.' });
    }

    try {
      // Kiểm tra xem email đã tồn tại chưa
      const existingAccount = await AccountsModels.findOne({ email });
      if (existingAccount) {
        return res.status(400).json({ message: 'Email đã được sử dụng.' });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      // Tạo tài khoản mới
      const newAccount = await AccountsModels.create({
        email,
        password,
        isVerified: false // Mặc định chưa xác thực
      });

      res.status(201).json({ message: 'Tài khoản đã được tạo. Vui lòng xác thực email.' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
  },
  login: async (req, res) => {

  },
  getAccount: async (req, res) => {
    
  }
}

export default accountController;