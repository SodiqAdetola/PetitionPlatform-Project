const express = require('express');
const router = express.Router();
const { createPetition, getAllPetitions, signPetition } = require('../controllers/petitionController');

// POST request for user registration
router.post('/petition', createPetition);

router.get('/petitions', getAllPetitions);

router.post('/petition/:id', signPetition)

module.exports = router;
