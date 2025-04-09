const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API del Grupo de Consumo',
      version: '1.0.0',
      description: 'Documentación de la API para la gestión del grupo de consumo local y ecológico',
    },
    servers: [
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
  apis: [path.join(__dirname, 'routes/*.js')], // Cambia a una ruta absoluta

};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

console.log('Mostrar swaggerDocs');
console.log(swaggerDocs);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
