// Test database connection and table structure
const { poolPromise } = require('./backend/db');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    const pool = await poolPromise;
    console.log('✅ Database connection successful');
    
    // Test basic query
    const testResult = await pool.request().query('SELECT 1 as test');
    console.log('✅ Basic query successful:', testResult.recordset[0]);
    
    // Check if tables exist
    const tables = [
      'PAT_PatientNewBorn_Master_1',
      'IP_Admission_Details', 
      'ParentData',
      'mortuaryRecords'
    ];
    
    for (const table of tables) {
      try {
        const result = await pool.request().query(`
          SELECT COUNT(*) as count 
          FROM INFORMATION_SCHEMA.TABLES 
          WHERE TABLE_NAME = '${table}'
        `);
        
        if (result.recordset[0].count > 0) {
          console.log(`✅ Table ${table} exists`);
          
          // Get row count
          const countResult = await pool.request().query(`SELECT COUNT(*) as total FROM ${table}`);
          console.log(`   - Total rows: ${countResult.recordset[0].total}`);
          
          // For specific tables, check status column
          if (table !== 'IP_Admission_Details') {
            const statusResult = await pool.request().query(`SELECT COUNT(*) as active FROM ${table} WHERE Status = 1`);
            console.log(`   - Active rows: ${statusResult.recordset[0].active}`);
          } else {
            const statusResult = await pool.request().query(`SELECT COUNT(*) as active FROM ${table} WHERE IAD_Status = 1`);
            console.log(`   - Active rows: ${statusResult.recordset[0].active}`);
            
            const deathResult = await pool.request().query(`SELECT COUNT(*) as deaths FROM ${table} WHERE IAD_Discharge_Reason = 2 AND IAD_Status = 1`);
            console.log(`   - Death records: ${deathResult.recordset[0].deaths}`);
          }
        } else {
          console.log(`❌ Table ${table} does not exist`);
        }
      } catch (error) {
        console.log(`❌ Error checking table ${table}:`, error.message);
      }
    }
    
    // Test the actual statistics queries
    console.log('\nTesting statistics queries...');
    
    try {
      const birthQuery = await pool.request().query('SELECT COUNT(*) as total FROM PAT_PatientNewBorn_Master_1 WHERE PNBM_Status = 1');
      console.log('✅ Birth query result:', birthQuery.recordset[0]);
    } catch (error) {
      console.log('❌ Birth query failed:', error.message);
    }
    
    try {
      const deathQuery = await pool.request().query('SELECT COUNT(*) as total FROM IP_Admission_Details WHERE IAD_Discharge_Reason = 2 AND IAD_Status = 1');
      console.log('✅ Death query result:', deathQuery.recordset[0]);
    } catch (error) {
      console.log('❌ Death query failed:', error.message);
    }
    
    try {
      const parentQuery = await pool.request().query('SELECT COUNT(*) as total FROM ParentData WHERE Status = 1');
      console.log('✅ Parent query result:', parentQuery.recordset[0]);
    } catch (error) {
      console.log('❌ Parent query failed:', error.message);
    }
    
    try {
      const mortuaryQuery = await pool.request().query('SELECT COUNT(*) as total FROM mortuaryRecords WHERE Status = 1');
      console.log('✅ Mortuary query result:', mortuaryQuery.recordset[0]);
    } catch (error) {
      console.log('❌ Mortuary query failed:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Error details:', error);
  }
}

testDatabase();