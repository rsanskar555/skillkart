import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import roadmapRoutes from './src/routes/roadmaps.js';
import userRoutes from './src/routes/users.js';

dotenv.config();



const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.ORIGIN_1, process.env.ORIGIN_2]
  : ['http://localhost:5173']; // or whichever local dev port you're using

// CORS middleware
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      console.log('CORS allowed:', origin);
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};


const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', {
  dbName: 'skillkart'
}).then(() => {
  console.log('MongoDB connected to skillkart database');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});