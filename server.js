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
