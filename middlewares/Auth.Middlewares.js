// import jwt from 'jsonwebtoken';
// import Account from '../models/Accounts.Models.js';

// //  xác thực phải có token + đã verify email
// export const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return res.status(401).json({ message: 'Không có token. Truy cập bị từ chối.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const account = await Account.findById(decoded.accountId);

//     if (!account) {
//       return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
//     }

//     if (!account.isVerified) {
//       return res.status(403).json({ message: 'Tài khoản chưa xác thực email.' });
//     }

//     req.account = account; // gắn vào request để dùng ở controller sau
//     next();

//   } catch (err) {
//     return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn.' });
//   }
// };

// // phân quyền theo role (ADMIN, STAFF)
// export const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.account.role)) {
//       return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này.' });
//     }
//     next();
//   };
// };

import AccountsModels from "../models/Accounts.Models.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';

export const registerValidate = async (req, res, next) => { // kiểm tra dữ liệu đăng ký
    try {
        const { email, password, confirmPassword } = req.body
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Mật khẩu không khớp.' });
        }

        const existingAccount = await AccountsModels.findOne({ email })
        if (existingAccount) {
            return res.status(400).json({ message: 'Email đã được sử dụng.' });
        }

        const emailRegex = /^[\w.+-]+@gmail\.com$/
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        if (!emailRegex.test(email)) return res.status(400).json({ message: 'Hãy sử dụng đúng format Email của Google' })
        if (!passwordRegex.test(password)) return res.status(400).json({ message: 'Mật khẩu cần có nhiều hơn 8 kí tự kèm với 1 kí tự viết hoa, 1 kí tự viết thường và 1 kí tự đặc biệt' })

        next()
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' || error.message })
    }
}

export const authVerify = async (req, res, next) => { // kiểm tra account đã được xác minh hay chưa
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token không hợp lệ hoặc không có token.' });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Không có token. Truy cập bị từ chối.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const account = await AccountsModels.findById(decoded.accountId);

        if (!account) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
        }

        if (!account.isVerified) {
            return res.status(403).json({ message: 'Tài khoản chưa được xác thực email. Vui lòng kiểm tra email để xác thực.' });
        }

        req.account = account; // gắn account vào request để sử dụng ở controller
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token không hợp lệ.' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token đã hết hạn.' });
        } else {
            return res.status(500).json({ message: 'internal server error' || error.message });
        }
    }
}

export const authLeader = async (req, res, next) => { // phân quyền theo role leader
    try {
        if (!req.user) return res.status(401).json({ message: 'Truy cập bị từ chối' });

        if (!req.user.role || req.user.role !== 'LEADER') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'internal server error' || error.message });
    }
}

export const authAdmin = async (req, res, next) => { // phân quyền theo role admin
    try {
        if (!req.user) return res.status(401).json({ message: 'Truy cập bị từ chối' });

        if (!req.user.role || req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'internal server error' || error.message });
    }
}