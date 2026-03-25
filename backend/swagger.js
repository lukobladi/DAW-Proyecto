// Configuracion de Swagger para la documentacion de la API
// Genera la documentacion automaticamente desde los comentarios en las rutas

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API del Grupo de Consumo',
      version: '1.0.0',
      description:
        'Documentacion de la API para la gestion del grupo de consumo local y ecologico',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://ekonsumo.duckdns.org'
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Servidor de producción' : 'Servidor de desarrollo',
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
  apis: [path.join(__dirname, 'src/routes/*.js')], // Buscar y lee comentarios de las rutas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

if (process.env.NODE_ENV !== 'test') {
  console.log('Mostrar swaggerDocs');
  console.log(swaggerDocs);
}

const swaggerUiOptions = {
    explorer: true,
    swaggerOptions: {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://ekonsumo.duckdns.org/api-docs.json'
        : '/api-docs.json',
      tryItOutEnabled: true,
    },
  };

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));

  // Endpoint para obtener la especificación OpenAPI en JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });
  
};
