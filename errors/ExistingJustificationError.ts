import { ApolloError } from 'apollo-server';

export class ExistingJustificationError extends ApolloError {
  constructor(message = 'The justification already exists') {
    super(message, 'EXISTING_JUSTIFICATION_ERROR', { statusCode: 409 });

    // This is needed to maintain proper stack traces
    Object.setPrototypeOf(this, ExistingJustificationError.prototype);
  }
  serialize(): { statusCode: number; message: string } {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
