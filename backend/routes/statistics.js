const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get('/', statisticsController.getOverview);
router.get('/charts', statisticsController.getChartData);

module.exports = router; 