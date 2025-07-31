const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db');

router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    if (!type || !['birth', 'death'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type parameter' });
    }
    const table = type === 'birth' ? 'birthRecords' : 'deathRecords';
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT * FROM ${table}`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 