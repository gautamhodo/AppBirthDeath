const { sql, poolPromise } = require('../db');

class DeathRecord {
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        IAD.IAD_ID_PK AS deathId,
        CONCAT_WS(' ', PM.PM_FirstName, PM.PM_MiddleName, PM.PM_LastName) AS fullName,
        PM.PM_Sex_FK AS gender,
        IAD.IAD_Discharge_Date AS dateOfDeath,
        IAD.IABD_IP_Num AS ipNo,
        IAD.IAD_AddDate AS addedOn
      FROM 
        IP_Admission_Details IAD
      JOIN 
        PAT_Patient_Master_1 PM ON IAD.IAD_Patient_fk = PM.PM_Card_PK
      WHERE 
        IAD.IAD_Discharge_Reason = 2
      ORDER BY 
        IAD.IAD_AddDate DESC
    `);
    return result.recordset;
  }

  static async getById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.VarChar, id)
      .query(`
        SELECT 
          IAD.IAD_ID_PK AS deathId,
          PM.PM_FirstName AS firstName,
          PM.PM_MiddleName AS middleName,
          PM.PM_LastName AS lastName,
          CONCAT_WS(' ', PM.PM_FirstName, PM.PM_MiddleName, PM.PM_LastName) AS fullName,
          PM.PM_Sex_FK AS gender,
          PM.PM_DOB AS dateOfBirth,
          PM.PM_PrimaryIdentification AS mobileNumber,
          IAD.IAD_Discharge_Date AS dateOfDeath,
          IAD.IABD_IP_Num AS ipNo,
          IAD.IAD_AddDate AS addedOn
        FROM 
          IP_Admission_Details IAD
        JOIN 
          PAT_Patient_Master_1 PM ON IAD.IAD_Patient_fk = PM.PM_Card_PK
        WHERE 
          IAD.IAD_ID_PK = @id AND IAD.IAD_Discharge_Reason = 2
      `);
    return result.recordset[0];
  }

  static async create(data) {
    const pool = await poolPromise;
    const request = pool.request();
    Object.keys(data).forEach(key => {
      request.input(key, data[key]);
    });
    await request.query(`INSERT INTO IP_Discharge_Summary (${Object.keys(data).join(',')}) VALUES (${Object.keys(data).map(k => '@' + k).join(',')})`);
    return { message: 'Death record created successfully' };
  }

  static async update(id, data) {
    const pool = await poolPromise;
    const request = pool.request();
    Object.keys(data).forEach(key => {
      request.input(key, data[key]);
    });
    request.input('id', id);
    await request.query(`UPDATE IP_Discharge_Summary SET ${Object.keys(data).map(k => k + '=@' + k).join(', ')} WHERE IDS_PK=@id`);
    return { message: 'Death record updated successfully' };
  }

  static async delete(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar, id)
      .query('DELETE FROM IP_Discharge_Summary WHERE IDS_PK = @id');
    return { message: 'Death record deleted successfully' };
  }

  static async getMostRecent() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT TOP 1
        IAD.IAD_ID_PK AS id,
        'death' AS type,
        CONCAT_WS(' ', PM.PM_FirstName, PM.PM_MiddleName, PM.PM_LastName) AS name,
        PM.PM_Sex_FK AS gender,
        IAD.IAD_Discharge_Date AS dateOfDeath,
        IAD.IABD_IP_Num AS ipNo,
        IAD.IAD_AddDate AS registeredOn
      FROM IP_Admission_Details IAD
      JOIN PAT_Patient_Master_1 PM ON IAD.IAD_Patient_fk = PM.PM_Card_PK
      WHERE IAD.IAD_Discharge_Reason = 2
      ORDER BY IAD.IAD_AddDate DESC
    `);
    return result.recordset[0];
  }
}

module.exports = DeathRecord;