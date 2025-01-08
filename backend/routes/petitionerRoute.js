const express = require('express');
const router = express.Router();
const { createPetitioner, getAllPetitioners } = require('../controllers/petitionerController');

// POST request for user registration
router.post('/petitioner', createPetitioner);

router.get('/petitioners', getAllPetitioners);

module.exports = router;
