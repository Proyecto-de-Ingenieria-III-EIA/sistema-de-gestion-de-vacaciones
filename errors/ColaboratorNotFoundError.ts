import { ApolloError } from 'apollo-server';

export class ColaboratorNotFoundError extends ApolloError {
  constructor(message = 'Colaborator not found') {
    super(message, 'COLABORATOR_NOT_FOUND', { statusCode: 401 });

    // This is needed to maintain proper stack traces
    Object.setPrototypeOf(this, ColaboratorNotFoundError.prototype);
  }
  serialize(): { statusCode: number; message: string } {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
