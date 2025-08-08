const Certificate = require('../models/Certificate');

const certificatesController = {
  // GET /certificates - Get certificates by type
  async getByType(req, res) {
    try {
      const { type } = req.query;
      if (!type || !['birth', 'death'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type parameter' });
      }
      
      const certificates = await Certificate.getByType(type);
      res.json(certificates);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /certificates/recent - Get the most recent birth and death certificates
  async getRecent(req, res) {
    try {
      const recentCertificates = await Certificate.getRecent();
      res.json(recentCertificates);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = certificatesController;