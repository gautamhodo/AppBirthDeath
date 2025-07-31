const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'test@1234',
  server: '192.168.50.210', // e.g., 'localhost'
  database: 'devdb',
  options: {
    encrypt: true, // for Azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL');
    return pool;
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

module.exports = {
  sql, poolPromise
}; 