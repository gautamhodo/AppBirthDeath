const DeathRecord = require('../models/DeathRecord');

const deathRecordsController = {
  // GET /deathRecords - List all
  async getAll(req, res) {
    try {
      const records = await DeathRecord.getAll();
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /deathRecords/:id - Get by ID
  async getById(req, res) {
    try {
      const record = await DeathRecord.getById(req.params.id);
      if (!record) {
        return res.status(404).json({ error: 'Death record not found' });
      }
      res.json(record);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /deathRecords - Create new
  async create(req, res) {
    try {
      const result = await DeathRecord.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /deathRecords/:id - Update by ID
  async update(req, res) {
    try {
      const result = await DeathRecord.update(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /deathRecords/:id - Delete by ID
  async delete(req, res) {
    try {
      const result = await DeathRecord.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = deathRecordsController;