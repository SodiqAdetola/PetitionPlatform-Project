const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


const petitionerRoute = require('./routes/petitionerRoute')
const petitionRoute = require('./routes/petitionRoute')
const adminRoute = require('./routes/adminRoute')

const Petitioner = require('./models/Petitioner')
const Threshold = require('./models/Threshold')



// Initialize app
dotenv.config()
const app = express();



// Middleware
app.use(cors());
app.use(express.json());



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://SLPP:SLPP@cluster0.vmxnt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
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

app.use('/slpp/', petitionerRoute);
app.use('/slpp/', petitionRoute);
app.use('/slpp/', adminRoute);



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    });


