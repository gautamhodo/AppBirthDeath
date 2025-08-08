const express = require('express');
const router = express.Router();
const certificatesController = require('../controllers/certificatesController');

router.get('/', certificatesController.getByType);
router.get('/recent', certificatesController.getRecent);

module.exports = router; 