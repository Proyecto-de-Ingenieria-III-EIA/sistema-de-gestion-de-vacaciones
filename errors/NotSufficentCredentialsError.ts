import { ApolloError } from 'apollo-server';

export class NotSufficentCredentialsError extends ApolloError {
  constructor(
    message = 'You do not have the credentials to make this operation'
  ) {
    super(message, 'NOT_SUFFICIENT_CREDENTIALS_ERROR', { statusCode: 403 });

    // This is needed to maintain proper stack traces
    Object.setPrototypeOf(this, NotSufficentCredentialsError.prototype);
  }
  serialize(): { statusCode: number; message: string } {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
