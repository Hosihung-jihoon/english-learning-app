import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;
const MONGO_URI = process.env.MONGO_URI ?? '';

// Middleware
app.use(cors());
app.use(express.json());

// Routes (thêm dần khi build)
// app.use('/api/auth', authRoutes);
// app.use('/api/lessons', lessonRoutes);

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'OK', message: 'English Learning API is running' });
});

// Connect DB & Start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
