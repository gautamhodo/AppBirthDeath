const express = require('express');
const router = express.Router();
const parentDataController = require('../controllers/parentDataController');

// GET /ParentData - List all
router.get('/', parentDataController.getAll);

// GET /ParentData/:id - Get by ID
router.get('/:id', parentDataController.getById);

// POST /ParentData - Create new
router.post('/', parentDataController.create);

// PUT /ParentData/:id - Update by ID
router.put('/:id', parentDataController.update);

// DELETE /ParentData/:id - Delete by ID
router.delete('/:id', parentDataController.delete);

module.exports = router; 