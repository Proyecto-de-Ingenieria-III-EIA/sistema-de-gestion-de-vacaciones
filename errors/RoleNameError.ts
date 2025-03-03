import { CustomErrorInterface } from "./CustomErrorInterface";

export class RoleNameError extends Error implements CustomErrorInterface {
    statusCode: number;

    constructor(message = "Invalid Role Name") {
        super(message);
        this.name = "Failed Auth Error";
        this.statusCode = 400;
        
        // This is needed to maintain proper stack traces
        Object.setPrototypeOf(this, RoleNameError.prototype);
    }
    serialize(): { statusCode: number; message: string; } {
        return {
            statusCode: this.statusCode,
            message: this.message,
        }
    }
}