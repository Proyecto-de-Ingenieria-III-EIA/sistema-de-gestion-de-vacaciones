import { ApolloError } from 'apollo-server';

export class FailedAuthError extends ApolloError {
  constructor(
    message = 'Authentication failed: Invalid or expired session token'
  ) {
    super(message, 'FAILED_AUTH_ERROR', { statusCode: 401 });

    // This is needed to maintain proper stack traces
    Object.setPrototypeOf(this, FailedAuthError.prototype);
  }
  serialize(): { statusCode: number; message: string } {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
