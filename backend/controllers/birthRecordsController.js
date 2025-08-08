const BirthRecord = require('../models/BirthRecord');

const birthRecordsController = {
  // GET /birthRecords - List all
  async getAll(req, res) {
    try {
      const records = await BirthRecord.getAll();
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /birthRecords/:id - Get by ID
  async getById(req, res) {
    try {
      const record = await BirthRecord.getById(req.params.id);
      if (!record) {
        return res.status(404).json({ error: 'Birth record not found' });
      }
      res.json(record);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /birthRecords - Create new
  async create(req, res) {
    try {
      const result = await BirthRecord.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /birthRecords/:id - Update by ID
  async update(req, res) {
    try {
      const result = await BirthRecord.update(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /birthRecords/:id - Delete by ID
  async delete(req, res) {
    try {
      const result = await BirthRecord.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = birthRecordsController;