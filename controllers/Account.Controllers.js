import AccountsModels from "../models/Accounts.Models.js"
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { sendResetPasswordEmail, sendVerifyEmail } from '../utils/sendEmail.js';

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

      const hashPassword = await bcrypt.hash(password, 10); //hash mật khẩu

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
  verifyEmail: async (req, res) => {
    try {
      const { email } = req.body
      console.log('Email cần xác thực:', email);

      const account = await AccountsModels.findOne({ email });
      if (!account) {
        console.log('Tài khoản không tồn tại:', email);
        return res.status(404).json({ message: 'Tài khoản không tồn tại.' });
      }

      const token = crypto.randomBytes(32).toString('hex'); // Tạo token xác thực
      const hash = crypto.createHash('sha256').update(token).digest('hex');

      account.verifyToken = hash
      account.verifyTokenExpire = Date.now() + 3600000; // Token hết hạn sau 1 giờ

      await account.save();

      await sendVerifyEmail(email, token); // Gửi email xác thực

      return res.status(200).json({ message: 'Vui lòng kiểm tra email để xác thực tài khoản.' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Vui lòng cung cấp email.' });
    }

    try {
      const account = await AccountsModels.findOne({ email });
      if (!account) {
        return res.status(404).json({ message: 'Tài khoản không tồn tại.' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const hash = crypto.createHash('sha256').update(token).digest('hex');

      account.resetPasswordToken = hash;
      account.resetPasswordExpire = Date.now() + 3600000; // Token hết hạn sau 1 giờ

      await account.save();

      await sendResetPasswordEmail(email, token); // Gửi email đặt lại mật khẩu

      return res.status(200).json({ message: 'Vui lòng kiểm tra email để đặt lại mật khẩu.' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { token } = req.params
      const { password } = req.body

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const account = await AccountsModels.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() } // Kiểm tra token còn hiệu lực
      });

      if (!account) {
        return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
      }

      account.password = await bcrypt.hash(password, 10); // Mã hóa mật khẩu mới
      account.resetPasswordToken = undefined; // Xóa token reset
      account.resetPasswordExpire = undefined; // Xóa thời gian hết hạn

      await account.save();

      return res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công.' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const account = req.account; // Lấy account từ middleware validateLogin

      const jwtToken = jwt.sign({
        id: account._id,
        email: account.email,
        role: account.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE
      });

      return res.status(200).json({
        message: 'Đăng nhập thành công',
        token: jwtToken,
        account: {
          email: account.email,
          role: account.role
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
  },
  getAccount: async (req, res) => {
    try {
      const account = await AccountsModels.find()
      return res.status(200).json(account);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
  }
}

export default accountController;