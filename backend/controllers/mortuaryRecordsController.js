const MortuaryRecord = require('../models/MortuaryRecord');

const mortuaryRecordsController = {
  // GET /mortuaryRecords - List all
  async getAll(req, res) {
    try {
      const records = await MortuaryRecord.getAll();
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /mortuaryRecords/:id - Get by ID
  async getById(req, res) {
    try {
      const record = await MortuaryRecord.getById(req.params.id);
      if (!record) {
        return res.status(404).json({ error: 'Mortuary record not found' });
      }
      res.json(record);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /mortuaryRecords - Create new
  async create(req, res) {
    try {
      const result = await MortuaryRecord.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /mortuaryRecords/:id - Update by ID
  async update(req, res) {
    try {
      const result = await MortuaryRecord.update(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /mortuaryRecords/:id - Delete by ID
  async delete(req, res) {
    try {
      const result = await MortuaryRecord.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = mortuaryRecordsController;