import { CustomErrorInterface } from "./CustomErrorInterface";


export class FailedAuthError extends Error implements CustomErrorInterface {
    statusCode: number;

    constructor(message = "Authentication failed: Invalid or expired session token") {
        super(message);
        this.name = "Failed Auth Error";
        this.statusCode = 401;
        
        // This is needed to maintain proper stack traces
        Object.setPrototypeOf(this, FailedAuthError.prototype);
    }
    serialize(): { statusCode: number; message: string; } {
        return {
            statusCode: this.statusCode,
            message: this.message
        };
    }
}