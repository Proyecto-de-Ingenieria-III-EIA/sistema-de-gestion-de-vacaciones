import { ApolloError } from 'apollo-server';

export class NonExistentJustificationError extends ApolloError {
  constructor(message = 'The justification does not exists') {
    super(message, 'NON_EXISTENT_JUSTIFICATION_ERROR', { statusCode: 409 });

    // This is needed to maintain proper stack traces
    Object.setPrototypeOf(this, NonExistentJustificationError.prototype);
  }
  serialize(): { statusCode: number; message: string } {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
