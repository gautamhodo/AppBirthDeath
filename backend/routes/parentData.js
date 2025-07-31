const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db');

// GET /ParentData - List all
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM ParentData');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /ParentData/:id - Get by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.VarChar, req.params.id)
      .query('SELECT * FROM ParentData WHERE id = @id');
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /ParentData - Create new
router.post('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    // Add all fields as needed
    const {
      id, firstName, lastName, gender, dateOfBirth, mobileNo, email, term, deliveryType, uhid, civilIds, nationality, doctor, bloodGroup, Added_By, Added_on, Modified_By, Modified_on, Status, Provider_FK
    } = req.body;
    const result = await pool.request()
      .input('id', sql.VarChar, id)
      .input('firstName', sql.VarChar, firstName)
      .input('lastName', sql.VarChar, lastName)
      .input('gender', sql.VarChar, gender)
      .input('dateOfBirth', sql.Date, dateOfBirth)
      .input('mobileNo', sql.VarChar, mobileNo)
      .input('email', sql.VarChar, email)
      .input('term', sql.VarChar, term)
      .input('deliveryType', sql.VarChar, deliveryType)
      .input('uhid', sql.VarChar, uhid)
      .input('civilIds', sql.VarChar, civilIds)
      .input('nationality', sql.VarChar, nationality)
      .input('doctor', sql.VarChar, doctor)
      .input('bloodGroup', sql.VarChar, bloodGroup)
      .input('Added_By', sql.VarChar, Added_By)
      .input('Added_on', sql.DateTime, Added_on)
      .input('Modified_By', sql.VarChar, Modified_By)
      .input('Modified_on', sql.DateTime, Modified_on)
      .input('Status', sql.Bit, Status)
      .input('Provider_FK', sql.BigInt, Provider_FK)
      .query(`INSERT INTO ParentData (id, firstName, lastName, gender, dateOfBirth, mobileNo, email, term, deliveryType, uhid, civilIds, nationality, doctor, bloodGroup, Added_By, Added_on, Modified_By, Modified_on, Status, Provider_FK)
        VALUES (@id, @firstName, @lastName, @gender, @dateOfBirth, @mobileNo, @email, @term, @deliveryType, @uhid, @civilIds, @nationality, @doctor, @bloodGroup, @Added_By, @Added_on, @Modified_By, @Modified_on, @Status, @Provider_FK)`);
    res.status(201).json({ message: 'ParentData created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /ParentData/:id - Update by ID
router.put('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    // Add all fields as needed
    const {
      firstName, lastName, gender, dateOfBirth, mobileNo, email, term, deliveryType, uhid, civilIds, nationality, doctor, bloodGroup, Added_By, Added_on, Modified_By, Modified_on, Status, Provider_FK
    } = req.body;
    const result = await pool.request()
      .input('id', sql.VarChar, req.params.id)
      .input('firstName', sql.VarChar, firstName)
      .input('lastName', sql.VarChar, lastName)
      .input('gender', sql.VarChar, gender)
      .input('dateOfBirth', sql.Date, dateOfBirth)
      .input('mobileNo', sql.VarChar, mobileNo)
      .input('email', sql.VarChar, email)
      .input('term', sql.VarChar, term)
      .input('deliveryType', sql.VarChar, deliveryType)
      .input('uhid', sql.VarChar, uhid)
      .input('civilIds', sql.VarChar, civilIds)
      .input('nationality', sql.VarChar, nationality)
      .input('doctor', sql.VarChar, doctor)
      .input('bloodGroup', sql.VarChar, bloodGroup)
      .input('Added_By', sql.VarChar, Added_By)
      .input('Added_on', sql.DateTime, Added_on)
      .input('Modified_By', sql.VarChar, Modified_By)
      .input('Modified_on', sql.DateTime, Modified_on)
      .input('Status', sql.Bit, Status)
      .input('Provider_FK', sql.BigInt, Provider_FK)
      .query(`UPDATE ParentData SET firstName=@firstName, lastName=@lastName, gender=@gender, dateOfBirth=@dateOfBirth, mobileNo=@mobileNo, email=@email, term=@term, deliveryType=@deliveryType, uhid=@uhid, civilIds=@civilIds, nationality=@nationality, doctor=@doctor, bloodGroup=@bloodGroup, Added_By=@Added_By, Added_on=@Added_on, Modified_By=@Modified_By, Modified_on=@Modified_on, Status=@Status, Provider_FK=@Provider_FK WHERE id=@id`);
    res.json({ message: 'ParentData updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /ParentData/:id - Delete by ID
router.delete('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.VarChar, req.params.id)
      .query('DELETE FROM ParentData WHERE id = @id');
    res.json({ message: 'ParentData deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 