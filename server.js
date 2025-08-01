import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import 'dotenv/config'
import cors from 'cors';
import rootRouter from './routes/index.js';
import { Server } from 'socket.io';
// import socketController from './controllers/Socket.Controllers.js';

const app = express();
// const server = http.createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
  accessControlAllowCredentials: true, // Cho phép cookie và thông tin xác thực
}

app.use(express.json());
app.use(cors(corsOptions));

// const io = new Server(server, {
//   cors: corsOptions,
//   pingTimeout: 60000,
//   pingInterval: 25000,
//   transports: ['websocket', 'polling']
// });

// app.set('io', io);

// socketController(io);

// Routes
app.use('/api', rootRouter);

// app.get('/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     timestamp: new Date(),
//     environment: process.env.NODE_ENV || 'development',
//     socket: {
//       connected: io.engine.clientsCount,
//       rooms: io.sockets.adapter.rooms.size
//     }
//   });
// });

// app.use('*', (req, res) => {
//   res.status(404).json({
//     message: 'Route not found',
//     path: req.originalUrl
//   });
// });

// Kết nối MongoDB và chạy server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server chạy ở http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error('MongoDB lỗi:', err));
