const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activitiesController');

router.get('/recent', activitiesController.getRecent);

module.exports = router; 