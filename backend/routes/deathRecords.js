const express = require('express');
const router = express.Router();
const deathRecordsController = require('../controllers/deathRecordsController');

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
router.get('/', deathRecordsController.getAll);

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
router.get('/:id', deathRecordsController.getById);

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
router.post('/', deathRecordsController.create);

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
router.put('/:id', deathRecordsController.update);

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
router.delete('/:id', deathRecordsController.delete);

module.exports = router; 