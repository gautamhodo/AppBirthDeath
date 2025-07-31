const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

/**
 * @swagger
 * tags:
 *   name: Death Records
 *   description: API for managing death records
 */

/**
 * @swagger
 * /deathRecords:
 *   get:
 *     summary: Get all death records
 *     tags: [Death Records]
 *     responses:
 *       200:
 *         description: A list of death records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeathRecord'
 */
// GET /deathRecords - List all
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM IP_Discharge_Summary WHERE IDS_ISDeath_Flag = 1');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /deathRecords/{id}:
 *   get:
 *     summary: Get a death record by ID
 *     tags: [Death Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Death record ID
 *     responses:
 *       200:
 *         description: Death record data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeathRecord'
 *       404:
 *         description: Death record not found
 */
// GET /deathRecords/:id - Get by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.VarChar, req.params.id)
      .query('SELECT * FROM IP_Discharge_Summary WHERE IDS_PK = @id AND IDS_ISDeath_Flag = 1');
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /deathRecords:
 *   post:
 *     summary: Create a new death record
 *     tags: [Death Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeathRecord'
 *     responses:
 *       201:
 *         description: Death record created successfully
 *       400:
 *         description: Invalid input
 */
// POST /deathRecords - Create new
router.post('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const data = req.body;
    const request = pool.request();
    Object.keys(data).forEach(key => {
      request.input(key, data[key]);
    });
    await request.query(`INSERT INTO IP_Discharge_Summary (${Object.keys(data).join(',')}) VALUES (${Object.keys(data).map(k => '@'+k).join(',')})`);
    res.status(201).json({ message: 'deathRecords created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /deathRecords/{id}:
 *   put:
 *     summary: Update a death record by ID
 *     tags: [Death Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Death record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeathRecord'
 *     responses:
 *       200:
 *         description: Death record updated successfully
 *       404:
 *         description: Death record not found
 */
// PUT /deathRecords/:id - Update by ID
router.put('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const data = req.body;
    const request = pool.request();
    Object.keys(data).forEach(key => {
      request.input(key, data[key]);
    });
    request.input('id', req.params.id);
    await request.query(`UPDATE IP_Discharge_Summary SET ${Object.keys(data).map(k => k+'=@'+k).join(', ')} WHERE IDS_PK=@id`);
    res.json({ message: 'deathRecords updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /deathRecords/{id}:
 *   delete:
 *     summary: Delete a death record
 *     tags: [Death Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Death record ID
 *     responses:
 *       200:
 *         description: Death record deleted successfully
 *       404:
 *         description: Death record not found
 */
// DELETE /deathRecords/:id - Delete by ID
router.delete('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar, req.params.id)
      .query('DELETE FROM IP_Discharge_Summary WHERE IDS_PK = @id');
    res.json({ message: 'deathRecords deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 