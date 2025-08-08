const { poolPromise } = require('../db');
const BirthRecord = require('./BirthRecord');
const DeathRecord = require('./DeathRecord');

class Certificate {
  static async getByType(type) {
    const table = type === 'birth' ? 'birthRecords' : 'deathRecords';
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT * FROM ${table}`);
    return result.recordset;
  }

  static async getRecent() {
    const [lastBirthCertificate, lastDeathCertificate] = await Promise.all([
      BirthRecord.getMostRecent(),
      DeathRecord.getMostRecent()
    ]);

    return {
      lastBirthCertificate: lastBirthCertificate || null,
      lastDeathCertificate: lastDeathCertificate || null
    };
  }
}

module.exports = Certificate;