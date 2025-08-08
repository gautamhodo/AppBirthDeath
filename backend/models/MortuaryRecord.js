const { sql, poolPromise } = require('../db');

class MortuaryRecord {
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM mortuaryRecords');
    return result.recordset;
  }

  static async getById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.VarChar, id)
      .query('SELECT * FROM mortuaryRecords WHERE id = @id');
    return result.recordset[0];
  }

  static async create(data) {
    const pool = await poolPromise;
    const request = pool.request();
    Object.keys(data).forEach(key => {
      request.input(key, data[key]);
    });
    await request.query(`INSERT INTO mortuaryRecords (${Object.keys(data).join(',')}) VALUES (${Object.keys(data).map(k => '@'+k).join(',')})`);
    return { message: 'Mortuary record created successfully' };
  }

  static async update(id, data) {
    const pool = await poolPromise;
    const request = pool.request();
    Object.keys(data).forEach(key => {
      request.input(key, data[key]);
    });
    request.input('id', id);
    await request.query(`UPDATE mortuaryRecords SET ${Object.keys(data).map(k => k+'=@'+k).join(', ')} WHERE id=@id`);
    return { message: 'Mortuary record updated successfully' };
  }

  static async delete(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar, id)
      .query('DELETE FROM mortuaryRecords WHERE id = @id');
    return { message: 'Mortuary record deleted successfully' };
  }
}

module.exports = MortuaryRecord;