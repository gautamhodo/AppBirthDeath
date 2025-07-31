const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Birth and Death Records API',
      version: '1.0.0',
      description: 'API documentation for Birth and Death Records Management System',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        BirthRecord: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the birth record'
            },
            firstName: {
              type: 'string',
              description: 'First name of the newborn'
            },
            lastName: {
              type: 'string',
              description: 'Last name of the newborn'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time of birth'
            },
            gender: {
              type: 'string',
              enum: ['Male', 'Female', 'Other'],
              description: 'Gender of the newborn'
            },
            weight: {
              type: 'number',
              format: 'float',
              description: 'Weight at birth in kilograms'
            },
            motherName: {
              type: 'string',
              description: 'Full name of the mother'
            },
            fatherName: {
              type: 'string',
              description: 'Full name of the father'
            },
            placeOfBirth: {
              type: 'string',
              description: 'Place where the birth occurred'
            },
            registrationDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the record was registered'
            }
          },
          required: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'motherName']
        },
        DeathRecord: {
          type: 'object',
          properties: {
            IDS_PK: { type: 'string', description: 'Unique identifier' },
            IDS_IPID: { type: 'string', description: 'Inpatient ID' },
            IDS_FirstName: { type: 'string', description: 'First name' },
            IDS_LastName: { type: 'string', description: 'Last name' },
            IDS_Age: { type: 'number', description: 'Age at death' },
            IDS_Gender: { 
              type: 'string', 
              enum: ['Male', 'Female', 'Other'],
              description: 'Gender'
            },
            IDS_DateOfDeath: { 
              type: 'string', 
              format: 'date-time',
              description: 'Date and time of death'
            },
            IDS_PlaceOfDeath: { type: 'string' },
            IDS_CauseOfDeath: { type: 'string' },
            IDS_DoctorName: { type: 'string' },
            IDS_RegistrationDate: { 
              type: 'string', 
              format: 'date-time'
            },
            IDS_ISDeath_Flag: { 
              type: 'integer',
              enum: [0, 1],
              description: 'Death record flag (1 = true)'
            }
          },
          required: ['IDS_FirstName', 'IDS_LastName', 'IDS_DateOfDeath']
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
