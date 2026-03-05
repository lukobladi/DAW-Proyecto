const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API del Grupo de Consumo',
      version: '1.0.0',
      description: 'Documentación de la API para la gestión del grupo de consumo local y ecológico',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
      {
        url: 'http://ekonsumo.duckdns.org:3000',
        description: 'Servidor remoto',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, 'src/routes/*.js')], 

};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

if (process.env.NODE_ENV !== 'test') {
  console.log('Mostrar swaggerDocs');
  console.log(swaggerDocs);
}

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
