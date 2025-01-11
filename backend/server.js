const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const petitionerRoute = require('./routes/petitionerRoute')
const petitionRoute = require('./routes/petitionRoute')
const Petitioner = require('./models/Petitioner');
const { Admin } = require('mongodb');



// Initialize app
dotenv.config()
const app = express();



// Middleware
app.use(cors());
app.use(express.json());



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(async () => {

  console.log('Connected to MongoDB');

  const adminAccount = {
    fullName: 'Petitions Committee',
    email: 'admin@petition.parliament.sr',
    bioID: 'admin-bioID',
    DoB: '2000-01-01',
    role: 'admin',
  };

  try {
    const Admin = await Petitioner.findOne({ email: adminAccount.email });
    if (!Admin) {
      const newAdmin = new Petitioner(adminAccount);
      await newAdmin.save();
      console.log('Admin account created.');
    } else {
      console.log('Admin account already exists:', Admin);
    }
  } catch (err) {
    console.error('Error:', err);
  }
  
}).catch(err => {
  console.error('Database connection error:', err);
});
  
 

// Start server
const PORT = process.env.PORT || 9000;

app.use('/', petitionerRoute);
app.use('/', petitionRoute)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    });
