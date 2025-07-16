import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'
import cors from 'cors';
import rootRouter from './routes';

const app = express();

app.use(express.json());
app.use(cors());


// Routes
app.use('/api', rootRouter);

// Kết nối MongoDB và chạy server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server chạy ở http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error('MongoDB lỗi:', err));
