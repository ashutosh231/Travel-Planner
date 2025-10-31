import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../../backend/config/database.js';

// Import routes
import authRoutes from '../../backend/routes/auth.js';
import userRoutes from '../../backend/routes/user.js';
import bookingRoutes from '../../backend/routes/booking.js';
import adminRoutes from '../../backend/routes/admin.js';
import reviewRoutes from '../../backend/routes/review.js';
import queryRoutes from '../../backend/routes/query.js';
import destinationRoutes from '../../backend/routes/destination.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/destination', destinationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Travel Planner API is running on Netlify Functions',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Travel Planner API',
    version: '1.0.0',
    endpoints: [
      '/api/auth/*',
      '/api/user/*',
      '/api/booking/*',
      '/api/admin/*',
      '/api/review/*',
      '/api/query/*',
      '/api/destination/*'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Ensure database connection before handling requests
const handler = async (event, context) => {
  // Prevent function from timing out
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    // Connect to database
    await connectDB();
    
    // Handle request
    return await serverless(app)(event, context);
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Database connection failed',
        message: error.message 
      })
    };
  }
};

export { handler };
