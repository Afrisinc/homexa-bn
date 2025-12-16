import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { env } from './env.js';

/**
 * Swagger/OpenAPI Configuration
 * Defines API documentation settings including authentication, servers, and UI options
 */

const isDevelopment = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Base URL configuration for Swagger UI
 * Used to determine the correct server URL for API requests
 */
const getBaseUrl = (): string => {
  if (isProduction) {
    return process.env.API_BASE_URL || 'https://api.example.com';
  }
  return `http://localhost:${env.PORT}`;
};

/**
 * Fastify Swagger Plugin Configuration (OpenAPI 3.0)
 * Generates OpenAPI specification for API documentation
 */
export const swaggerConfig = {
  mode: 'dynamic' as const,
  swagger: {
    info: {
      title: 'Backend REST API',
      description:
        'Production-ready REST API built with Fastify, TypeScript, and Prisma ORM. ' +
        'This API provides comprehensive user management and authentication features with JWT-based security.',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        url: 'https://github.com/yourusername/backend-template',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: getBaseUrl(),
        description: isDevelopment ? 'Development Server' : 'Production Server',
      },
      ...(isDevelopment
        ? [
            {
              url: 'http://localhost:3000',
              description: 'Local Development',
            },
          ]
        : []),
    ],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey' as const,
        name: 'Authorization',
        in: 'header' as const,
        description:
          'JWT Bearer token for authentication. ' +
          'Obtain a token from the /auth/login endpoint and include it in the Authorization header: "Authorization: Bearer <token>"',
      },
    },
    tags: [
      {
        name: 'health',
        description:
          'Health Check - Service availability and status monitoring',
      },
      {
        name: 'auth',
        description: 'Authentication - User registration and login operations',
      },
      {
        name: 'users',
        description: 'User Management - User profile and account operations',
      },
    ],
    externalDocs: {
      description: 'Find more info here',
      url: 'https://github.com/yourusername/backend-template',
    },
  },
  hideUntagged: false,
};

/**
 * Fastify Swagger UI Plugin Configuration
 * Customizes the Swagger UI appearance and behavior
 */
export const swaggerUiConfig: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
    layout: 'BaseLayout',
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
  },
  staticCSP: true,
  transformSpecificationClone: true,
};

/**
 * ReDoc Configuration (alternative documentation UI)
 * Uncomment to enable ReDoc alongside Swagger UI
 */
export const redocConfig = {
  routePrefix: '/redoc',
  uiConfig: {
    title: 'Backend API - ReDoc Documentation',
    specUrl: '/swagger/json',
    hideHostname: false,
    hideDownloadButton: false,
    expandDefaultServerVariables: true,
    sortEnumValuesAlphabetically: false,
    sortPropsAlphabetically: false,
    showExtensions: false,
    disableSearch: false,
    scrollYOffset: 0,
  },
};
