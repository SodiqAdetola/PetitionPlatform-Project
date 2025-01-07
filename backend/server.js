const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


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
const PORT = process.env.PORT || 9001;

app.get('/', (req, res) => {
    res.send('Hello!');
  });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    });
