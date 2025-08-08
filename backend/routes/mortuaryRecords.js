const express = require('express');
const router = express.Router();
const mortuaryRecordsController = require('../controllers/mortuaryRecordsController');

// GET /mortuaryRecords - List all
router.get('/', mortuaryRecordsController.getAll);

// GET /mortuaryRecords/:id - Get by ID
router.get('/:id', mortuaryRecordsController.getById);

// POST /mortuaryRecords - Create new
router.post('/', mortuaryRecordsController.create);

// PUT /mortuaryRecords/:id - Update by ID
router.put('/:id', mortuaryRecordsController.update);

// DELETE /mortuaryRecords/:id - Delete by ID
router.delete('/:id', mortuaryRecordsController.delete);

module.exports = router; 