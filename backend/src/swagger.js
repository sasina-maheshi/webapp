const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'ProTask API',
    description: 'IT Project Management System API'
  },
  host: 'localhost:5000',
  schemes: ['http', 'https'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization'
    }
  }
};

const outputFile = './src/swagger-output.json';
const endpointsFiles = ['./src/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);