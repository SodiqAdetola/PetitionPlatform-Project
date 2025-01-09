const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const petitionerRoute = require('./routes/petitionerRoute')
const petitionRoute = require('./routes/petitionRoute')


// Initialize app
dotenv.config()
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));


// Start server
const PORT = process.env.PORT || 9000;

app.use('/', petitionerRoute);
app.use('/', petitionRoute)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    });
