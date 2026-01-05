import { logger } from '@/utils/logger.js';
import type { FastifyCorsOptions } from '@fastify/cors';

/**
 * Parse CORS origins from environment variable
 * Format: "origin1,origin2,origin3"
 */
const parseOrigins = (originsStr: string): string[] => {
  return originsStr
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => origin.length > 0);
};

/**
 * Get CORS configuration based on environment
 */
const getCorsConfig = (): FastifyCorsOptions => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const allowedOrigins = process.env.CORS_ORIGINS || '';

  // Development: Allow all origins
  if (nodeEnv === 'development') {
    return {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
      exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
      maxAge: 86400, // 24 hours
    };
  }

  // Production: Restrict to specific origins
  if (!allowedOrigins) {
    throw new Error(
      'CORS_ORIGINS environment variable is required in production. ' + 'Format: "origin1,origin2,origin3"'
    );
  }

  const origins = parseOrigins(allowedOrigins);
  logger.info({ origins }, 'CORS enabled for origins');

  return {
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
  };
};

/**
 * Get Socket.IO CORS configuration based on environment
 */
const getSocketIoCorsConfig = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const allowedOrigins = process.env.CORS_ORIGINS || '';

  // Development: Allow all origins
  if (nodeEnv === 'development') {
    return {
      origin: '*',
      credentials: false,
    };
  }

  // Production: Restrict to specific origins
  if (!allowedOrigins) {
    logger.warn(
      {},
      'WARNING: CORS_ORIGINS environment variable is not set. ' +
        'Allowing all origins for Socket.IO. For security, set CORS_ORIGINS in production.'
    );
    return {
      origin: '*',
      credentials: false,
    };
  }

  const origins = parseOrigins(allowedOrigins);
  logger.info({ origins }, 'Socket.IO CORS enabled for origins');

  return {
    origin: origins,
    credentials: true,
  };
};

export { getCorsConfig, getSocketIoCorsConfig, parseOrigins };
