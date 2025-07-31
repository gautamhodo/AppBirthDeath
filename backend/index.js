const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 