import { ApolloError } from 'apollo-server';

export class UserNotFoundError extends ApolloError {
  constructor(message = 'User not found') {
    super(message, 'USER_NOT_FOUND_ERROR', { statusCode: 404 });

    // This is needed to maintain proper stack traces
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
  serialize(): { statusCode: number; message: string } {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
