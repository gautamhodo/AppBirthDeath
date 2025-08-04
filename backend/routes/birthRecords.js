const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

/**
 * @swagger
 * tags:
 *   name: Birth Records
 *   description: API for managing birth records
 */

/**
 * @swagger
 * /birthRecords:
 *   get:
 *     summary: Get all birth records
 *     tags: [Birth Records]
 *     responses:
 *       200:
 *         description: A list of birth records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BirthRecord'
 */
// GET /birthRecords - List all
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query
    // ('SELECT * FROM PAT_PatientNewBorn_Master_1');
    (`
 SELECT 
  PNBM.PNBM_Card_FK AS birthId,
  PNBM.PNBM_Mother_FK AS motherId,
  'B/O ' + ISNULL(Mother.PM_FirstName, '') + ' ' + ISNULL(Mother.PM_LastName, '') AS babyName,
  ISNULL(Mother.PM_FirstName, '') + ' ' + ISNULL(Mother.PM_LastName, '') AS motherName,
  Baby.PM_DOB AS dateOfBirth,
  Baby.PM_Sex_FK AS gender,
  PNBM.PNBM_PatientAgeDay AS ageInDays,
  PNBM.PNBM_Weight AS weight,
  PNBM.PNBM_Length AS length,
  PNBM.PNBM_HeadCircumference AS headCircumference,
  PNBM.PNBM_Term AS term,
  PNBM.PNBM_DeliveryType_FK AS deliveryType,
  PNBM.PNBM_AddedOn AS addedOn,
  PNBM.certificateStatus
FROM 
  PAT_PatientNewBorn_Master_1 PNBM
JOIN 
  PAT_Patient_Master_1 Mother ON PNBM.PNBM_Mother_FK = Mother.PM_Card_PK
LEFT JOIN 
  PAT_Patient_Master_1 Baby ON PNBM.PNBM_Card_FK = Baby.PM_Card_PK

`);

    res.json(result.recordset);
  } catch (err) { 
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /birthRecords/{id}:
 *   get:
 *     summary: Get a birth record by ID
 *     tags: [Birth Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Birth record ID
 *     responses:
 *       200:
 *         description: Birth record data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BirthRecord'
 *       404:
 *         description: Birth record not found
 */
// GET /birthRecords/:id - Get by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.VarChar, req.params.id)
      .query('SELECT * FROM PAT_PatientNewBorn_Master_1 WHERE id = @id');
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
 * /birthRecords:
 *   post:
 *     summary: Create a new birth record
 *     tags: [Birth Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BirthRecord'
 *     responses:
 *       201:
 *         description: Birth record created successfully
 *       400:
 *         description: Invalid input
 */
// POST /birthRecords - Create new
router.post('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    // Add all fields as needed
    const data = req.body;
    const request = pool.request();
    Object.keys(data).forEach(key => {
      request.input(key, data[key]);
    });
    await request.query(`INSERT INTO PAT_PatientNewBorn_Master_1 (${Object.keys(data).join(',')}) VALUES (${Object.keys(data).map(k => '@'+k).join(',')})`);
    res.status(201).json({ message: 'birthRecords created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /birthRecords/{id}:
 *   put:
 *     summary: Update a birth record by ID
 *     tags: [Birth Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Birth record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BirthRecord'
 *     responses:
 *       200:
 *         description: Birth record updated successfully
 *       404:
 *         description: Birth record not found
 */
// PUT /birthRecords/:id - Update by ID
router.put('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const data = req.body;
    const request = pool.request();
    Object.keys(data).forEach(key => {
      request.input(key, data[key]);
    });
    request.input('id', req.params.id);
    await request.query(`UPDATE PAT_PatientNewBorn_Master_1 SET ${Object.keys(data).map(k => k+'=@'+k).join(', ')} WHERE id=@id`);
    res.json({ message: 'birthRecords updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /birthRecords/:id - Delete by ID
router.delete('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar, req.params.id)
      .query('DELETE FROM PAT_PatientNewBorn_Master_1 WHERE id = @id');
    res.json({ message: 'birthRecords deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 