import AccountsModels from "../models/Accounts.Models.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { sendResetPasswordEmail, sendVerifyEmail } from '../utils/sendEmail.js';

const accountController = {
  register: async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu không khớp.' });
    }

    try {
      const existingAccount = await AccountsModels.findOne({ email });
      if (existingAccount) {
        return res.status(400).json({ message: 'Email đã được sử dụng.' });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newAccount = await AccountsModels.create({
        email,
        password: hashPassword,
        isVerified: false
      });

      res.status(201).json({ message: 'Tài khoản đã được tạo. Vui lòng xác thực email.', account: newAccount });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { email } = req.body;
      console.log('Email cần xác thực:', email);

      const account = await AccountsModels.findOne({ email });
      if (!account) {
        return res.status(404).json({ message: 'Tài khoản không tồn tại.' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const hash = crypto.createHash('sha256').update(token).digest('hex');

      account.verifyToken = hash;
      account.verifyTokenExpire = Date.now() + 3600000;

      await account.save();
      await sendVerifyEmail(email, token);

      return res.status(200).json({ message: 'Vui lòng kiểm tra email để xác thực tài khoản.' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
  },
  verifyAccount: async (req, res) => {
    try {
      const { token } = req.params;
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const account = await AccountsModels.findOne({
        verifyToken: hashedToken,
        verifyTokenExpire: { $gt: Date.now() }
      });

      if (!account) {
        return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
      }
      account.isVerified = true;
      account.verifyToken = undefined;
      account.verifyTokenExpire = undefined;

      await account.save();
      return res.status(200).json({ message: 'Tài khoản đã được xác thực thành công.' });
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
      account.resetPasswordExpire = Date.now() + 3600000;

      await account.save();
      await sendResetPasswordEmail(email, token);

      return res.status(200).json({ message: 'Vui lòng kiểm tra email để đặt lại mật khẩu.' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const account = await AccountsModels.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!account) {
        return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
      }

      account.password = await bcrypt.hash(password, 10);
      account.resetPasswordToken = undefined;
      account.resetPasswordExpire = undefined;

      await account.save();

      return res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công.' });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const account = req.account;

      const jwtToken = jwt.sign({
        accountId: account._id, // ✅ Change from 'id' to 'accountId'
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
          accountId: account._id, // ✅ Change from 'id' to 'accountId'
          email: account.email,
          role: account.role
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
  },
  getAccountById: async (req, res) => {
    try {
      const account = await AccountsModels.findById(req.params.id).select('-password -verifyToken -resetPasswordToken');
      if (!account) {
        return res.status(404).json({ message: 'Tài khoản không tồn tại.' });
      }
      return res.status(200).json(account);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
  },
  // ...existing code...

  // Add this new method for getting current user's account
  getCurrentAccount: async (req, res) => {
    try {
      console.log('🔍 getCurrentAccount called');
      console.log('🔍 req.account exists:', !!req.account);

      // Account is already attached by authVerify middleware
      const account = req.account;

      if (!account) {
        return res.status(401).json({ message: 'Không tìm thấy thông tin tài khoản.' });
      }

      return res.status(200).json({
        message: 'Lấy thông tin tài khoản thành công',
        account: {
          id: account._id,
          email: account.email,
          role: account.role,
          isVerified: account.isVerified,
          active: account.active
        }
      });
    } catch (error) {
      console.error('❌ getCurrentAccount error:', error);
      return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
  }

  // ...existing code...
};

export default accountController;
