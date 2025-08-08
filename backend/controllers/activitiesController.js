const Activity = require('../models/Activity');

const activitiesController = {
  // GET /activities/recent - Get recent activities
  async getRecent(req, res) {
    try {
      const activities = await Activity.getRecent();
      res.json(activities);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = activitiesController;