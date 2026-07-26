require('dotenv').config();
const express = require('express');
const cors = require('cors');
const libraryRouter = require('./routers/library.router');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Library Management API is running'
  });
});

// Library routes
app.use('/api/library', libraryRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler (fallback safety net)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
