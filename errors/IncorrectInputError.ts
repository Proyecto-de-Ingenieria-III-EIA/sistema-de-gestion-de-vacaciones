import { ApolloError } from "apollo-server";


export class IncorrectInputError extends ApolloError {
    constructor(message = "The provided input is unvalid") {
        super(message, "INCORRECT_INPUT_ERROR", { statusCode: 406 });
        
        // This is needed to maintain proper stack traces
        Object.setPrototypeOf(this, IncorrectInputError.prototype);
    }
    serialize(): { statusCode: number; message: string; } {
        return {
            statusCode: this.statusCode,
            message: this.message
        };
    }
}