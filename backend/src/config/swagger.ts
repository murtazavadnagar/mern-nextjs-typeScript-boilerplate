import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'Production-ready MERN User Management System API',
    },
    servers: [
      {
        url: `${env.HOST}/api/v1`,
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
  },
  apis: [
    path.join(__dirname, '../routes/v1/*.ts'), // local
    path.join(__dirname, '../routes/v1/*.js'), // production
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
