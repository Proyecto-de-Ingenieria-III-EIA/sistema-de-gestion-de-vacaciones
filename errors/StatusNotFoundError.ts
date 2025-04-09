import { ApolloError } from "apollo-server";

export class StatusNotFoundError extends ApolloError {
    constructor(message = "Spontaneous Absence Status not found") {
        super(message, "STATUS_NOT_FOUND_ERROR", { statusCode: 404 });
        
        // This is needed to maintain proper stack traces
        Object.setPrototypeOf(this, StatusNotFoundError.prototype);
    }
    serialize(): { statusCode: number; message: string; } {
        return {
            statusCode: this.statusCode,
            message: this.message
        };
    }
}