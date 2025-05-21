import { ApolloError } from "apollo-server";


export class AbsenceHasBeenResolvedError extends ApolloError {
    constructor(message = "Cannot perform action, the absence has already been resolved") {
        super(message, "ABSENCE_HAS_BEEN_RESOLVED_ERROR", { statusCode: 406 });
        
        // This is needed to maintain proper stack traces
        Object.setPrototypeOf(this, AbsenceHasBeenResolvedError.prototype);
    }
    serialize(): { statusCode: number; message: string; } {
        return {
            statusCode: this.statusCode,
            message: this.message
        };
    }
}