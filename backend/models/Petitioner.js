const mongoose = require('mongoose');

const PetitionerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bioID: { type: String, required: true, unique: true },
  DoB: { type: Date, required: true },
  signedPetitions: { type: Array, required: false }
});

module.exports = mongoose.model('Petitioner', PetitionerSchema);
