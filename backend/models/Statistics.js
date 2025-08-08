const { poolPromise } = require('../db');

class Statistics {
  static async getOverview() {
    const pool = await poolPromise;
    const [births, deaths, parents, mortuary] = await Promise.all([
      pool.request().query('SELECT COUNT(*) as total FROM birthRecords'),
      pool.request().query('SELECT COUNT(*) as total FROM deathRecords'),
      pool.request().query('SELECT COUNT(*) as total FROM ParentData'),
      pool.request().query('SELECT COUNT(*) as total FROM mortuaryRecords')
    ]);
    
    return {
      totalBirths: births.recordset[0].total,
      totalDeaths: deaths.recordset[0].total,
      totalRegistrations: parents.recordset[0].total,
      totalMortuary: mortuary.recordset[0].total
    };
  }

  static async getChartData() {
    const pool = await poolPromise;
    
    // Get monthly birth data
    const monthlyBirths = await pool.request().query(`
      SELECT 
        MONTH(PNBM_AddedOn) as month,
        YEAR(PNBM_AddedOn) as year,
        COUNT(*) as count
      FROM PAT_PatientNewBorn_Master_1 
      WHERE PNBM_AddedOn >= DATEADD(MONTH, -12, GETDATE())
      GROUP BY YEAR(PNBM_AddedOn), MONTH(PNBM_AddedOn)
      ORDER BY year, month
    `);

    // Get monthly death data
    const monthlyDeaths = await pool.request().query(`
      SELECT 
        MONTH(IAD_AddDate) as month,
        YEAR(IAD_AddDate) as year,
        COUNT(*) as count
      FROM IP_Admission_Details 
      WHERE IAD_Discharge_Reason = 2 
        AND IAD_AddDate >= DATEADD(MONTH, -12, GETDATE())
      GROUP BY YEAR(IAD_AddDate), MONTH(IAD_AddDate)
      ORDER BY year, month
    `);

    // Get gender distribution
    const genderDistribution = await pool.request().query(`
      SELECT 
        PM.PM_Sex_FK as gender,
        COUNT(*) as count
      FROM PAT_PatientNewBorn_Master_1 PNBM
      JOIN PAT_Patient_Master_1 PM ON PNBM.PNBM_Card_FK = PM.PM_Card_PK
      GROUP BY PM.PM_Sex_FK
    `);

    // Get delivery types
    const deliveryTypes = await pool.request().query(`
      SELECT 
        PNBM_DeliveryType_FK as deliveryType,
        COUNT(*) as count
      FROM PAT_PatientNewBorn_Master_1
      GROUP BY PNBM_DeliveryType_FK
    `);

    return {
      monthlyBirths: monthlyBirths.recordset,
      monthlyDeaths: monthlyDeaths.recordset,
      genderDistribution: genderDistribution.recordset,
      deliveryTypes: deliveryTypes.recordset
    };
  }
}

module.exports = Statistics;