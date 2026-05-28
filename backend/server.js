const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const responseRoutes = require('./routes/responseRoutes');

const app = express();

// Middleware
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

// Connect to MongoDB
const connectDB = async () => {
  try {
    // We will use mongodb-memory-server for this local testing session
    // so you don't need to install MongoDB on your machine!
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
    console.log(`Connected to IN-MEMORY MongoDB successfully at ${mongoUri}`);
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();
