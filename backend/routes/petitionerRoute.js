const express = require('express');
const router = express.Router();
const { createPetitioner, getAllPetitioners, getPetitionerByEmail } = require('../controllers/petitionerController');

// POST request for user registration
router.post('/petitioner', createPetitioner);

router.get('/petitioners', getAllPetitioners);

router.get('/petitioner', getPetitionerByEmail);



module.exports = router;
