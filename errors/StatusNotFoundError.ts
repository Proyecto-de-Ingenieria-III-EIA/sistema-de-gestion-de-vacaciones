import { CustomErrorInterface } from "./CustomErrorInterface";

export class StatusNotFoundError extends Error implements CustomErrorInterface {
    statusCode: number;

    constructor(message = "Spontaneous Absence Status not found") {
        super(message);
        this.name = "Status Not Found Error";
        this.statusCode = 404;
        
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