const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const predictionRoutes = require('./routes/predictionRoutes');

const app = express();

// Establish Database Connection
connectDB();

// Middleware Configuration
app.use(cors());
app.use(express.json());

// API Routing
app.use('/api/predictions', predictionRoutes);

// Server Status / Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    service: 'FIFA World Cup 2026 Prediction Backend'
  });
});

// Serve static assets in production
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // Fallback for all other routes to serve index.html (ignoring API paths)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Express API Server running on port ${PORT}`);
});
