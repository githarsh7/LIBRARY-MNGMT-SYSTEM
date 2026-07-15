const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandlers');

const app = express();

app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Library Management API is running',
    endpoints: [
      'POST   /api/library/books',
      'GET    /api/library/books',
      'POST   /api/library/members',
      'GET    /api/library/members',
      'POST   /api/library/borrow/:bookId',
      'PUT    /api/library/return/:borrowId',
      'GET    /api/library/borrowed'
    ]
  });
});

app.use('/api/library/books', bookRoutes);
app.use('/api/library/members', memberRoutes);
app.use('/api/library', borrowRoutes); // provides /borrow/:bookId, /return/:borrowId, /borrowed

app.use(notFound);
app.use(errorHandler);

module.exports = app;
