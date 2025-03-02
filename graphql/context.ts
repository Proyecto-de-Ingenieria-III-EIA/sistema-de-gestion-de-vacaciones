import { PrismaClient } from "@prisma/client";

interface OurContext {
    db: PrismaClient;
}

export type { OurContext };