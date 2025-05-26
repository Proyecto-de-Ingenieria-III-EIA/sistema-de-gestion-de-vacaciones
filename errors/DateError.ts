import { ApolloError } from 'apollo-server';

export class DateError extends ApolloError {
  constructor(message = 'Invalid date') {
    super(message, 'DATE_ERROR', { statusCode: 400 });

    // This is needed to maintain proper stack traces
    Object.setPrototypeOf(this, DateError.prototype);
  }
  serialize(): { statusCode: number; message: string } {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
