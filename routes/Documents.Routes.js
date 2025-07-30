import express from 'express';
import multer from 'multer';
import path from 'path';
import { authVerify } from '../middlewares/Auth.Middlewares.js';
import {
  createDocument,
  updateDocument,
  deleteDocument,
  getMyDocuments
} from '../controllers/Documents.Controller.js';

const router = express.Router();

//  CẤU HÌNH UPLOAD 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/'); // Thư mục lưu file
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// CÁC ROUTES 
router.post('/', authVerify, createDocument);         // Tạo tài liệu
router.put('/:id', authVerify, updateDocument);       // Sửa tài liệu
router.delete('/:id', authVerify, deleteDocument);    // Xóa tài liệu
router.get('/', authVerify, getMyDocuments);          // Quản lý danh sách

// ROUTE UPLOAD FILE
router.post('/upload', authVerify, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/documents/${req.file.filename}`;
  res.status(200).json({ fileUrl });
});

export default router;
