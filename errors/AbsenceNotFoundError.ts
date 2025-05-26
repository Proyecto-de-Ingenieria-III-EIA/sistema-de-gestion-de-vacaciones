import { ApolloError } from 'apollo-server';

export class AbsenceNotFoundError extends ApolloError {
  constructor(message = 'Absence not found') {
    super(message, 'ABSENCE_NOT_FOUND', { statusCode: 400 });

    // This is needed to maintain proper stack traces
    Object.setPrototypeOf(this, AbsenceNotFoundError.prototype);
  }
  serialize(): { statusCode: number; message: string } {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
