const express = require('express');
require("dotenv").config()
const { syncDatabase } = require('./models');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const commentRoutes = require('./routes/commentRoutes');
const seedDb = require('./db/seed');

const app = express();
const port = process.env.APP_PORT ?? 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/tickets', ticketRoutes);
app.use('/comments', commentRoutes);

// Start server after database sync
const startServer = async () => {
  try {
    await syncDatabase();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();