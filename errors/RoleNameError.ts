import { ApolloError } from 'apollo-server';

export class RoleNameError extends ApolloError {
  constructor(message = 'Invalid Role Name') {
    super(message, 'INVALID_ROLE_NAME_ERROR', { statusCode: 400 });

    // This is needed to maintain proper stack traces
    Object.setPrototypeOf(this, RoleNameError.prototype);
  }
  serialize(): { statusCode: number; message: string } {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
