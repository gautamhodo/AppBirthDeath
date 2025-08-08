const { sql, poolPromise } = require('../db');

class ParentData {
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM ParentData');
    return result.recordset;
  }

  static async getById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.VarChar, id)
      .query('SELECT * FROM ParentData WHERE id = @id');
    return result.recordset[0];
  }

  static async create(data) {
    const pool = await poolPromise;
    const {
      id, firstName, lastName, gender, dateOfBirth, mobileNo, email, term, deliveryType, uhid, civilIds, nationality, doctor, bloodGroup, Added_By, Added_on, Modified_By, Modified_on, Status, Provider_FK
    } = data;
    
    await pool.request()
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
    
    return { message: 'Parent data created successfully' };
  }

  static async update(id, data) {
    const pool = await poolPromise;
    const {
      firstName, lastName, gender, dateOfBirth, mobileNo, email, term, deliveryType, uhid, civilIds, nationality, doctor, bloodGroup, Added_By, Added_on, Modified_By, Modified_on, Status, Provider_FK
    } = data;
    
    await pool.request()
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
      .query(`UPDATE ParentData SET firstName=@firstName, lastName=@lastName, gender=@gender, dateOfBirth=@dateOfBirth, mobileNo=@mobileNo, email=@email, term=@term, deliveryType=@deliveryType, uhid=@uhid, civilIds=@civilIds, nationality=@nationality, doctor=@doctor, bloodGroup=@bloodGroup, Added_By=@Added_By, Added_on=@Added_on, Modified_By=@Modified_By, Modified_on=@Modified_on, Status=@Status, Provider_FK=@Provider_FK WHERE id=@id`);
    
    return { message: 'Parent data updated successfully' };
  }

  static async delete(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar, id)
      .query('DELETE FROM ParentData WHERE id = @id');
    return { message: 'Parent data deleted successfully' };
  }
}

module.exports = ParentData;