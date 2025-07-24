import express from 'express';
import { authVerify } from '../middlewares/Auth.Middlewares.js';
import {
  createDocument,
  updateDocument,
  deleteDocument,
  getMyDocuments
} from '../controllers/Documents.Controller.js';

const router = express.Router();

router.post('/', authVerify, createDocument);        // Tạo tài liệu
router.put('/:id', authVerify, updateDocument);      // Sửa tài liệu
router.delete('/:id', authVerify, deleteDocument);   // Xóa tài liệu
router.get('/', authVerify, getMyDocuments);         // Quản lý danh sách

export default router;
