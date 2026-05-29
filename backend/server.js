const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const responseRoutes = require('./routes/responseRoutes');

const app = express();
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

// Security Middlewares
// 1. Helmet secures HTTP headers (e.g., hiding X-Powered-By, enabling XSS protection)
app.use(helmet());

// 2. Mongo Sanitize prevents NoSQL injection by removing malicious keys (like '$') from req.body/query
app.use(mongoSanitize());

// 3. Rate Limiting prevents brute-force attacks by limiting requests per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
// Apply the rate limiting middleware to API calls only
app.use('/api', apiLimiter);

// 4. Relaxed CORS to prevent Vite dev server network errors
app.use(cors());

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('OpenForm API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

const fs = require('fs');
const path = require('path');

let mongoServer; // Keep track of the instance globally

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    // Check if the user has provided a real MongoDB Atlas URI
    if (mongoUri && mongoUri.includes('cluster')) {
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB Atlas permanently!');
    } else {
      // Fallback: Safe, crash-free In-Memory Database for local testing
      console.log('⚠️ No MongoDB Atlas URI detected in .env');
      console.log('⚠️ Falling back to temporary In-Memory Database...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      
      mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
      console.log(`✅ Connected to Temporary MongoDB at ${mongoServer.getUri()}`);
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Graceful shutdown handlers for Nodemon restarts
const shutdown = async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('🛑 MongoDB Memory Server stopped gracefully');
  }
};

process.once('SIGUSR2', async () => {
  await shutdown();
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', async () => {
  await shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await shutdown();
  process.exit(0);
});
