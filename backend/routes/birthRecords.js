const express = require('express');
const router = express.Router();
const birthRecordsController = require('../controllers/birthRecordsController');

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
router.get('/', birthRecordsController.getAll);

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
router.get('/:id', birthRecordsController.getById);

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
router.post('/', birthRecordsController.create);

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
router.put('/:id', birthRecordsController.update);

// DELETE /birthRecords/:id - Delete by ID
router.delete('/:id', birthRecordsController.delete);

module.exports = router; 