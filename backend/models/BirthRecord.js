const { sql, poolPromise } = require('../db');

class BirthRecord {
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        PNBM.PNBM_Card_FK AS birthId,
        PNBM.PNBM_Mother_FK AS motherId,
        'B/O ' + ISNULL(Mother.PM_FirstName, '') + ' ' + ISNULL(Mother.PM_LastName, '') AS babyName,
        ISNULL(Mother.PM_FirstName, '') + ' ' + ISNULL(Mother.PM_LastName, '') AS motherName,
        Baby.PM_DOB AS dateOfBirth,
        Baby.PM_PrimaryIdentification AS mobileNo,
        Baby.PM_Sex_FK AS gender,
        Baby.PM_BloodGroup AS bloodGroup,
        PNBM.PNBM_PatientAgeDay AS ageInDays,
        PNBM.PNBM_Weight AS weight,
        PNBM.PNBM_Length AS length,
        PNBM.PNBM_HeadCircumference AS headCircumference,
        PNBM.PNBM_Term AS term,
        PNBM.PNBM_DeliveryType_FK AS deliveryType,
        PNBM.PNBM_AddedOn AS addedOn,
        PNBM.certificateStatus,
        IAD.IABD_IP_Num AS ipNumber,
        IAD.IAD_Date AS admittedDate
      FROM 
        PAT_PatientNewBorn_Master_1 PNBM
      JOIN 
        PAT_Patient_Master_1 Mother ON PNBM.PNBM_Mother_FK = Mother.PM_Card_PK
      LEFT JOIN 
        PAT_Patient_Master_1 Baby ON PNBM.PNBM_Card_FK = Baby.PM_Card_PK
      LEFT JOIN 
        IP_Admission_Details IAD ON IAD.IAD_Patient_FK = Baby.PM_Card_PK
    `);
    return result.recordset;
  }

  static async getById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.VarChar, id)
      .query(`
        SELECT 
          PNBM.PNBM_Card_FK AS birthId,
          PNBM.PNBM_Mother_FK AS motherId,
          'B/O ' + ISNULL(Mother.PM_FirstName, '') + ' ' + ISNULL(Mother.PM_LastName, '') AS babyName,
          ISNULL(Mother.PM_FirstName, '') + ' ' + ISNULL(Mother.PM_LastName, '') AS motherName,
          Baby.PM_DOB AS dateOfBirth,
          Baby.PM_Sex_FK AS gender,
          Baby.PM_BloodGroup AS bloodGroup,
          Baby.PM_PrimaryIdentification AS mobileNo,
          PNBM.PNBM_PatientAgeDay AS ageInDays,
          PNBM.PNBM_Weight AS weight,
          PNBM.PNBM_Length AS length,
          PNBM.PNBM_HeadCircumference AS headCircumference,
          PNBM.PNBM_Term AS term,
          PNBM.PNBM_DeliveryType_FK AS deliveryType,
          PNBM.PNBM_AddedOn AS addedOn,
          PNBM.certificateStatus,
          IAD.IABD_IP_Num AS ipNumber,
          IAD.IAD_Date AS admittedDate
        FROM 
          PAT_PatientNewBorn_Master_1 PNBM
        JOIN 
          PAT_Patient_Master_1 Mother ON PNBM.PNBM_Mother_FK = Mother.PM_Card_PK
        LEFT JOIN 
          PAT_Patient_Master_1 Baby ON PNBM.PNBM_Card_FK = Baby.PM_Card_PK
        LEFT JOIN 
          IP_Admission_Details IAD ON IAD.IAD_Patient_FK = Baby.PM_Card_PK
        WHERE PNBM_Card_FK = @id
      `);
    return result.recordset[0];
  }

  static async create(data) {
    const pool = await poolPromise;
    const request = pool.request();
    Object.keys(data).forEach(key => {
      request.input(key, data[key]);
    });
    await request.query(`INSERT INTO PAT_PatientNewBorn_Master_1 (${Object.keys(data).join(',')}) VALUES (${Object.keys(data).map(k => '@'+k).join(',')})`);
    return { message: 'Birth record created successfully' };
  }

  static async update(id, data) {
    const pool = await poolPromise;
    const request = pool.request();
    Object.keys(data).forEach(key => {
      request.input(key, data[key]);
    });
    request.input('id', id);
    await request.query(`UPDATE PAT_PatientNewBorn_Master_1 SET ${Object.keys(data).map(k => k+'=@'+k).join(', ')} WHERE id=@id`);
    return { message: 'Birth record updated successfully' };
  }

  static async delete(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.VarChar, id)
      .query('DELETE FROM PAT_PatientNewBorn_Master_1 WHERE id = @id');
    return { message: 'Birth record deleted successfully' };
  }

  static async getMostRecent() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT TOP 1
        PNBM.PNBM_Card_FK AS id,
        'birth' AS type,
        'B/O ' + ISNULL(Mother.PM_FirstName, '') + ' ' + ISNULL(Mother.PM_LastName, '') AS name,
        ISNULL(Mother.PM_FirstName, '') + ' ' + ISNULL(Mother.PM_LastName, '') AS motherName,
        Baby.PM_DOB AS dateOfBirth,
        Baby.PM_Sex_FK AS gender,
        PNBM.PNBM_AddedOn AS registeredOn,
        PNBM.certificateStatus
      FROM PAT_PatientNewBorn_Master_1 PNBM
      JOIN PAT_Patient_Master_1 Mother ON PNBM.PNBM_Mother_FK = Mother.PM_Card_PK
      LEFT JOIN PAT_Patient_Master_1 Baby ON PNBM.PNBM_Card_FK = Baby.PM_Card_PK
      ORDER BY PNBM.PNBM_AddedOn DESC
    `);
    return result.recordset[0];
  }
}

module.exports = BirthRecord;