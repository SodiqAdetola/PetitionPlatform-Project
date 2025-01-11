const mongoose = require('mongoose');

const PetitionSchema = new mongoose.Schema({
  status: { type: String, required: true, default: "Open"},
  petitionTitle: { type: String, required: true, unique: true },
  petitionText: { type: String, required: true, unique: true },
  petitioner: { type: String, required: true },
  signitures: { type: Number, required: false, default: 0 },
  response: { type: String, required: false },

});

module.exports = mongoose.model('Petition', PetitionSchema);
