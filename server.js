import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'
import cors from 'cors';
import rootRouter from './routes/index.js';

// Import all models to register them with Mongoose
import './models/Accounts.Models.js';
import './models/Users.Models.js';
import './models/Departs.Models.js';
import './models/JobPositions.Models.js';
import './models/Courses.Models.js';
import './models/Sprints.Models.js';
import './models/Tasks.Models.js';
import './models/TaskComments.Models.js';
import './models/Projects.Models.js'
import './models/Timeline.Models.js'

const app = express();

app.use(express.json());
app.use(cors(
  {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
    accessControlAllowCredentials: true, // Cho phép cookie và thông tin xác thực
  }
));


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
