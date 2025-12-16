export const RegisterRequestSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      description: 'User email address for registration',
    },
    password: {
      type: 'string',
      minLength: 6,
      description: 'User password (minimum 6 characters)',
    },
    firstName: {
      type: 'string',
      minLength: 1,
      description: 'User first name',
    },
    lastName: {
      type: 'string',
      minLength: 1,
      description: 'User last name',
    },
    phone: {
      type: 'string',
      minLength: 10,
      description: 'User phone number (minimum 10 characters)',
    },
  },
  required: ['email', 'password', 'firstName', 'lastName', 'phone'],
  additionalProperties: false,
} as const;

export const LoginRequestSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      description: 'User email address for login',
    },
    password: {
      type: 'string',
      description: 'User password',
    },
  },
  required: ['email', 'password'],
  additionalProperties: false,
} as const;
