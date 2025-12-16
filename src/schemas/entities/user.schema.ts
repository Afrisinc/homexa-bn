export const UserEntitySchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique identifier for the user',
    },
    firstName: {
      type: 'string',
      description: 'User first name',
    },
    lastName: {
      type: 'string',
      description: 'User last name',
    },
    phone: {
      type: 'string',
      description: 'User phone number',
    },
    email: {
      type: 'string',
      description: 'User email address',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'Account creation timestamp',
    },
  },
  required: ['id', 'email', 'firstName', 'lastName', 'phone', 'createdAt'],
} as const;

export const UserPublicSchema = {
  type: 'object',
  properties: {
    id: UserEntitySchema.properties.id,
    email: UserEntitySchema.properties.email,
    firstName: UserEntitySchema.properties.firstName,
    lastName: UserEntitySchema.properties.lastName,
    phone: UserEntitySchema.properties.phone,
    createdAt: UserEntitySchema.properties.createdAt,
  },
  required: ['id', 'email', 'createdAt'],
} as const;
