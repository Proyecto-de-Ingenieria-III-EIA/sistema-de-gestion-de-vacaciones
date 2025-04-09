import { CustomErrorInterface } from "./CustomErrorInterface";

export class UserNotFoundError extends Error implements CustomErrorInterface {
    statusCode: number;

    constructor(message = "User not found") {
        super(message);
        this.name = "User Not Found Error";
        this.statusCode = 404;
        
        // This is needed to maintain proper stack traces
        Object.setPrototypeOf(this, UserNotFoundError.prototype);
    }
    serialize(): { statusCode: number; message: string; } {
        return {
            statusCode: this.statusCode,
            message: this.message
        };
    }
}