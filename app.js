// app.js or index.js

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');
const patientRoutes = require('./src/routes/recordRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const anteNatalRoutes = require('./src/routes/anteNatalRoutes');
const infertilityRoutes = require('./src/routes/infertilityRoutes');
const errorHandler = require('./src/middlewares/errors');
const { responseHandler } = require('./src/middlewares/responseHandler');
require('dotenv').config(); // Load environment variables from .env file
const app = express();
const cors = require('cors');

console.log('Starting the application...'); // Example console.log statement



// Connection URI
const uri = 'mongodb+srv://rishabhagarwalcse14:aps2EFhKhBDNv44z@cluster0.c09ri4w.mongodb.net/PanchkuiyanHospital?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Atlas
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));
  app.use(cors({
    origin: ['http://localhost:3000','https://localhost:3000', 'http://192.168.29.128:3000'], // Allow requests from this origin
    credentials: true, // Allow cookies to be sent along with requests
  }));
  // Handle preflight requests
  // app.options('/api/auth/login', (req, res) => {
  //   // Set CORS headers to allow requests from specific origins
  //   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type');
  //   res.header('Access-Control-Allow-Methods', 'POST');
  //   res.sendStatus(200);
  // });  
// Middleware
app.use(express.json());
// Middleware to handle CORS


app.use(responseHandler);

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/antenatal', anteNatalRoutes);
app.use('/api/infertility', infertilityRoutes);

//Others
app.use(
errorHandler);


// Start server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


