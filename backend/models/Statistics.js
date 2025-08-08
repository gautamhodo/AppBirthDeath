const { poolPromise } = require('../db');

class Statistics {
  static async getOverview() {
    try {
      console.log('Getting database pool...');
      const pool = await poolPromise;
      console.log('Database pool obtained successfully');

      console.log('Executing database queries...');
      // Try queries with and without status filters to see what works
      const queries = [
        { name: 'births', query: 'SELECT COUNT(*) as total FROM PAT_PatientNewBorn_Master_1' },
        { name: 'births_with_status', query: 'SELECT COUNT(*) as total FROM PAT_PatientNewBorn_Master_1 WHERE PNBM_Status = 1' },
        { name: 'deaths', query: 'SELECT COUNT(*) as total FROM IP_Admission_Details WHERE IAD_Discharge_Reason = 2' },
        { name: 'deaths_with_status', query: 'SELECT COUNT(*) as total FROM IP_Admission_Details WHERE IAD_Discharge_Reason = 2 AND IAD_Status = 1' },
        { name: 'parents', query: 'SELECT COUNT(*) as total FROM ParentData' },
        { name: 'parents_with_status', query: 'SELECT COUNT(*) as total FROM ParentData WHERE Status = 1' },
        { name: 'mortuary', query: 'SELECT COUNT(*) as total FROM mortuaryRecords' },
        { name: 'mortuary_with_status', query: 'SELECT COUNT(*) as total FROM mortuaryRecords WHERE Status = 1' }
      ];

      const results = {};
      for (const { name, query } of queries) {
        try {
          const result = await pool.request().query(query);
          results[name] = result.recordset[0].total;
          console.log(`Query ${name}: ${result.recordset[0].total}`);
        } catch (error) {
          console.log(`Query ${name} failed:`, error.message);
          results[name] = 0;
        }
      }

      // Use the queries that work, prefer status-filtered ones if available
      const totalBirths = results.births_with_status !== undefined ? results.births_with_status : results.births || 0;
      const totalDeaths = results.deaths_with_status !== undefined ? results.deaths_with_status : results.deaths || 0;
      const totalRegistrations = results.parents_with_status !== undefined ? results.parents_with_status : results.parents || 0;
      const totalMortuary = results.mortuary_with_status !== undefined ? results.mortuary_with_status : results.mortuary || 0;

      console.log('Raw query results:');
      console.log('Births:', births.recordset);
      console.log('Deaths:', deaths.recordset);
      console.log('Parents:', parents.recordset);
      console.log('Mortuary:', mortuary.recordset);

      const result = {
        totalBirths: totalBirths,
        totalDeaths: totalDeaths,
        totalRegistrations: totalRegistrations,
        totalMortuary: totalMortuary
      };

      console.log('Final statistics result:', result);
      return result;
    } catch (error) {
      console.error('Error fetching overview statistics:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      
      // Return default values if database query fails
      return {
        totalBirths: 0,
        totalDeaths: 0,
        totalRegistrations: 0,
        totalMortuary: 0
      };
    }
  }

  static async getChartData() {
    try {
      const pool = await poolPromise;

      // Get monthly birth data
      const monthlyBirths = await pool.request().query(`
        SELECT 
          MONTH(PNBM_AddedOn) as month,
          YEAR(PNBM_AddedOn) as year,
          COUNT(*) as count
        FROM PAT_PatientNewBorn_Master_1 
        WHERE PNBM_AddedOn >= DATEADD(MONTH, -12, GETDATE()) AND PNBM_Status = 1
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
          AND IAD_Status = 1
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
        WHERE PNBM.PNBM_Status = 1
        GROUP BY PM.PM_Sex_FK
      `);

      // Get delivery types
      const deliveryTypes = await pool.request().query(`
        SELECT 
          PNBM_DeliveryType_FK as deliveryType,
          COUNT(*) as count
        FROM PAT_PatientNewBorn_Master_1
        WHERE PNBM_Status = 1
        GROUP BY PNBM_DeliveryType_FK
      `);

      return {
        monthlyBirths: monthlyBirths.recordset || [],
        monthlyDeaths: monthlyDeaths.recordset || [],
        genderDistribution: genderDistribution.recordset || [],
        deliveryTypes: deliveryTypes.recordset || []
      };
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Return empty data structure if database query fails
      return {
        monthlyBirths: [],
        monthlyDeaths: [],
        genderDistribution: [],
        deliveryTypes: []
      };
    }
  }
}

module.exports = Statistics;