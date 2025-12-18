import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { registerRoutes } from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerConfig, swaggerUiConfig } from './config/swagger.js';
import { logger } from './utils/logger.js';

/**
 * Creates and configures the Fastify application instance
 * Registers plugins, middlewares, error handlers, and routes
 */
const createApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: true,
    ajv: {
      customOptions: {
        removeAdditional: 'all',
        useDefaults: true,
        coerceTypes: true,
        strict: false,
      },
    },
  });

  try {
    // Register CORS plugin for cross-origin requests
    logger.debug({}, 'Registering CORS plugin');
    await app.register(fastifyCors, {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    });

    // Register Helmet for security headers
    logger.debug({}, 'Registering Helmet security plugin');
    await app.register(fastifyHelmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    });

    // Register Swagger documentation plugin
    logger.debug({}, 'Registering Swagger documentation plugin');
    await app.register(fastifySwagger, swaggerConfig);

    // Register Swagger UI plugin
    logger.debug({}, 'Registering Swagger UI plugin');
    await app.register(fastifySwaggerUI, swaggerUiConfig);

    // Set global error handler
    app.setErrorHandler(errorHandler);

    // Register all application routes
    logger.debug({}, 'Registering application routes');
    await registerRoutes(app);

    // Post-registration hooks
    logger.info(
      {
        routes: app.printRoutes(),
      },
      'Application routes registered successfully'
    );
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      'Error during application initialization'
    );
    throw error;
  }

  return app;
};

export { createApp };
