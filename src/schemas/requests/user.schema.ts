export const UpdateUserRequestSchema = {
  type: 'object',
  properties: {
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
      description: 'User phone number',
    },
  },
  additionalProperties: false,
} as const;

export const UserParamsSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'User unique identifier',
    },
  },
  required: ['id'],
} as const;
