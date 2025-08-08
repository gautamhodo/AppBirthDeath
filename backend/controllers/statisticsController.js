const Statistics = require('../models/Statistics');

const statisticsController = {
  // GET /statistics - Get overview statistics
  async getOverview(req, res) {
    try {
      console.log('Fetching overview statistics...');
      const stats = await Statistics.getOverview();
      console.log('Statistics fetched successfully:', stats);
      res.json(stats);
    } catch (err) {
      console.error('Error fetching overview statistics:', err);
      res.status(500).json({ 
        error: err.message,
        timestamp: new Date().toISOString(),
        endpoint: '/statistics'
      });
    }
  },

  // GET /statistics/charts - Get detailed statistics for charts
  async getChartData(req, res) {
    try {
      console.log('Fetching chart data...');
      const chartData = await Statistics.getChartData();
      console.log('Chart data fetched successfully');
      res.json(chartData);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      res.status(500).json({ 
        error: err.message,
        timestamp: new Date().toISOString(),
        endpoint: '/statistics/charts'
      });
    }
  }
};

module.exports = statisticsController;