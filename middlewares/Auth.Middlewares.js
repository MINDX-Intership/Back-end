import jwt from 'jsonwebtoken';
import Account from '../models/Accounts.Models.js';

//  xác thực phải có token + đã verify email
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Không có token. Truy cập bị từ chối.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const account = await Account.findById(decoded.accountId);

    if (!account) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
    }

    if (!account.isVerified) {
      return res.status(403).json({ message: 'Tài khoản chưa xác thực email.' });
    }

    req.account = account; // gắn vào request để dùng ở controller sau
    next();

  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn.' });
  }
};

// phân quyền theo role (ADMIN, STAFF)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.account.role)) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này.' });
    }
    next();
  };
};
