const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow requests from any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  console.log(`[${timestamp}] ${req.method} ${req.url} - Client: ${clientIP}`);
  next();
});

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const parentDataRouter = require('./routes/parentData');
app.use('/ParentData', parentDataRouter);

const birthRecordsRouter = require('./routes/birthRecords');
const deathRecordsRouter = require('./routes/deathRecords');
const mortuaryRecordsRouter = require('./routes/mortuaryRecords');
app.use('/birthRecords', birthRecordsRouter);
app.use('/deathRecords', deathRecordsRouter);
app.use('/mortuaryRecords', mortuaryRecordsRouter);

const activitiesRouter = require('./routes/activities');
app.use('/activities', activitiesRouter);

const statisticsRouter = require('./routes/statistics');
app.use('/statistics', statisticsRouter);

const certificatesRouter = require('./routes/certificates');
app.use('/certificates', certificatesRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Test endpoint for network connectivity
app.get('/test', async (req, res) => {
  try {
    const { poolPromise } = require('./db');
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT 1 as test');
    res.json({ 
      status: 'OK', 
      message: 'Backend and database are accessible',
      timestamp: new Date().toISOString(),
      dbTest: result.recordset[0].test === 1 ? 'PASS' : 'FAIL'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`Server accessible at:`);
  console.log(`  - Local: http://localhost:${PORT}`);
  console.log(`  - Network: http://192.168.50.171:${PORT}`);
  console.log(`  - Test page: Open test-connection.html in browser`);
}); 