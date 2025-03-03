/**
 * Interface for custom application errors
 * Extend this interface for all custom error classes
 */
export interface CustomErrorInterface extends Error {
    // HTTP status code (e.g., 400, 404, 500)
    statusCode: number;
    
    // Method to serialize the error for responses
    serialize(): {
        statusCode: number;
        message: string;
    };
}