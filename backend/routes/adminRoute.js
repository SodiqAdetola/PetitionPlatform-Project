const express = require('express');
const router = express.Router();
const { setThreshold, createResponse, getThreshold } = require('../controllers/adminController');



router.get('/threshold', getThreshold);

router.post('/threshold', setThreshold);
router.post('/response', createResponse);

module.exports = router;
