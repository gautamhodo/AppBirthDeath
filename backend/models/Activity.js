const { poolPromise } = require('../db');

class Activity {
  static async getRecent() {
    const pool = await poolPromise;
    const queries = [
      `SELECT id, Added_on as date, 'ParentData' as type FROM ParentData`,
      `SELECT id, Added_on as date, 'birthRecords' as type FROM birthRecords`,
      `SELECT id, Added_on as date, 'deathRecords' as type FROM deathRecords`,
      `SELECT id, Added_on as date, 'mortuaryRecords' as type FROM mortuaryRecords`
    ];
    
    const results = await Promise.all(queries.map(q => pool.request().query(q)));
    let activities = results.flatMap(r => r.recordset);
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    activities = activities.slice(0, 20);
    
    return activities;
  }
}

module.exports = Activity;