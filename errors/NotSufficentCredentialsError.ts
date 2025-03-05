import { CustomErrorInterface } from "./CustomErrorInterface";


export class NotSufficentCredentialsError extends Error implements CustomErrorInterface {
    statusCode: number;

    constructor(message = "You do not have the credentials to make this operation") {
        super(message);
        this.name = "Not Enough Credentials Error";
        this.statusCode = 403;
        
        // This is needed to maintain proper stack traces
        Object.setPrototypeOf(this, NotSufficentCredentialsError.prototype);
    }
    serialize(): { statusCode: number; message: string; } {
        return {
            statusCode: this.statusCode,
            message: this.message
        };
    }
}