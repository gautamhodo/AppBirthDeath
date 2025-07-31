const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

// GET /mortuaryRecords - List all
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM mortuaryRecords');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /mortuaryRecords/:id - Get by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.VarChar, req.params.id)
      .query('SELECT * FROM mortuaryRecords WHERE id = @id');
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /mortuaryRecords - Create new
router.post('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const data = req.body;
    const request = pool.request();
    Object.keys(data).forEach(key => {
      request.input(key, data[key]);
    });
    await request.query(`INSERT INTO mortuaryRecords (${Object.keys(data).join(',')}) VALUES (${Object.keys(data).map(k => '@'+k).join(',')})`);
    res.status(201).json({ message: 'mortuaryRecords created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /mortuaryRecords/:id - Update by ID
router.put('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const data = req.body;
    const request = pool.request();
    Object.keys(data).forEach(key => {
      request.input(key, data[key]);
    });
    request.input('id', req.params.id);
    await request.query(`UPDATE mortuaryRecords SET ${Object.keys(data).map(k => k+'=@'+k).join(', ')} WHERE id=@id`);
    res.json({ message: 'mortuaryRecords updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /mortuaryRecords/:id - Delete by ID
router.delete('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar, req.params.id)
      .query('DELETE FROM mortuaryRecords WHERE id = @id');
    res.json({ message: 'mortuaryRecords deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 