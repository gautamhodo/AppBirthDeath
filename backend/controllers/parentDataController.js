const ParentData = require('../models/ParentData');

const parentDataController = {
  // GET /ParentData - List all
  async getAll(req, res) {
    try {
      const records = await ParentData.getAll();
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /ParentData/:id - Get by ID
  async getById(req, res) {
    try {
      const record = await ParentData.getById(req.params.id);
      if (!record) {
        return res.status(404).json({ error: 'Parent data not found' });
      }
      res.json(record);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /ParentData - Create new
  async create(req, res) {
    try {
      const result = await ParentData.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /ParentData/:id - Update by ID
  async update(req, res) {
    try {
      const result = await ParentData.update(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /ParentData/:id - Delete by ID
  async delete(req, res) {
    try {
      const result = await ParentData.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = parentDataController;