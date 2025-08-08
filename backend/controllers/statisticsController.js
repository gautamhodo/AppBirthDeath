const Statistics = require('../models/Statistics');

const statisticsController = {
  // GET /statistics - Get overview statistics
  async getOverview(req, res) {
    try {
      const stats = await Statistics.getOverview();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /statistics/charts - Get detailed statistics for charts
  async getChartData(req, res) {
    try {
      const chartData = await Statistics.getChartData();
      res.json(chartData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = statisticsController;