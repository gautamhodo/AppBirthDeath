const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db');

router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const [births, deaths, parents, mortuary] = await Promise.all([
      pool.request().query('SELECT COUNT(*) as total FROM birthRecords'),
      pool.request().query('SELECT COUNT(*) as total FROM deathRecords'),
      pool.request().query('SELECT COUNT(*) as total FROM ParentData'),
      pool.request().query('SELECT COUNT(*) as total FROM mortuaryRecords')
    ]);
    res.json({
      totalBirths: births.recordset[0].total,
      totalDeaths: deaths.recordset[0].total,
      totalRegistrations: parents.recordset[0].total,
      totalMortuary: mortuary.recordset[0].total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 