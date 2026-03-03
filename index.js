const express = require('express');
const userRoutes = require('./routes/userRoutes');
const { syncDatabase } = require('./models');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/users', userRoutes);

// Start server after database sync
const startServer = async () => {
  try {
    await syncDatabase();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
