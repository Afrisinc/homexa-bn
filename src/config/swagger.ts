import type { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { env } from './env';

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
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Homexa API',
      description:
        'Production-ready REST API built with Fastify, TypeScript, and Prisma ORM. ' +
        'Comprehensive e-commerce and chat functionality with JWT-based authentication.',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        url: 'https://github.com/afrisinc/homexa-bn',
        email: 'support@homexa.com',
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
              url: 'http://localhost:3004',
              description: 'Local Development',
            },
            {
              url: getBaseUrl(),
              description: 'Production Server',
            },
          ]
        : []),
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http' as const,
          scheme: 'bearer' as const,
          bearerFormat: 'JWT',
          description:
            'JWT Bearer token for authentication. ' +
            'Obtain a token from the /auth/login endpoint and include it in the Authorization header: "Authorization: Bearer <token>"',
        },
      },
    },
    tags: [
      {
        name: 'health',
        description: 'Service Health & Status',
      },
      {
        name: 'auth',
        description: 'Authentication (Login, Register, Refresh)',
      },
      {
        name: 'users',
        description: 'User Management',
      },
      {
        name: 'categories',
        description: 'Category Management',
      },
      {
        name: 'products',
        description: 'Product Management',
      },
      {
        name: 'chat',
        description: 'Chat & Messaging',
      },
    ],
    externalDocs: {
      description: 'GitHub Repository',
      url: 'https://github.com/afrisinc/homexa-bn',
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
  staticCSP: false,
  uiConfig: {
    layout: 'BaseLayout',
    deepLinking: true,
    docExpansion: 'none',
    defaultModelExpandDepth: 2,
    filter: true,
    tryItOutEnabled: true,
    persistAuthorization: true,
    displayOperationId: false,
  },
  transformSpecificationClone: true,
};

/**
 * Content Security Policy Directives for Swagger UI
 * Allows CDN resources needed for Swagger UI to render properly
 * Uses https:// protocol for CDN URLs to support reverse proxy with HTTPS
 */
export const swaggerCspDirectives = {
  defaultSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://unpkg.com'],
  scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://unpkg.com'],
  imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
  fontSrc: ["'self'", 'data:', 'https:', 'https://cdn.jsdelivr.net'],
  connectSrc: ["'self'"],
  frameSrc: ["'none'"],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"],
  childSrc: ["'none'"],
};

/**
 * ReDoc Configuration (alternative documentation UI)
 * Uncomment to enable ReDoc alongside Swagger UI
 */
export const redocConfig = {
  routePrefix: '/redoc',
  uiConfig: {
    title: 'Homexa API - ReDoc Documentation',
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
