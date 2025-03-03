import { Enum_RoleName, PrismaClient } from "@prisma/client";

interface OurContext {
    db: PrismaClient;
    authData: {
        email: string,
        role: Enum_RoleName,
        expires: Date,
    }
}

export type { OurContext };