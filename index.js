const express = require('express');
require("dotenv").config()

const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.APP_PORT ?? 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/users', userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
